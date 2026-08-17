/**
 * Cloudflare Worker for vibecoders.
 *
 * Everything under `/api/*` is handled here; every other request falls through
 * to the static assets built into `dist/client` (see `wrangler.jsonc`).
 *
 * Endpoints:
 *   POST /api/subscribe    add an address to the newsletter list (D1)
 */

interface Env {
  DB: D1Database
  ASSETS: Fetcher
  /** Optional shared secret guarding /api/subscribers. Set with `wrangler secret put ADMIN_TOKEN`. */
  ADMIN_TOKEN?: string
}

interface SubscribePayload {
  email?: unknown
  city?: unknown
  /** Honeypot — must be empty. */
  website?: unknown
}

const ALLOWED_CITIES = new Set(['tokyo', 'singapore', 'else'])

/**
 * Deliberately permissive: the goal is to reject obvious typos, not to
 * adjudicate RFC 5322. Anything that gets past this still has to bounce.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })

async function subscribe(request: Request, env: Env): Promise<Response> {
  let payload: SubscribePayload
  try {
    payload = (await request.json()) as SubscribePayload
  } catch {
    return json({ error: 'Expected a JSON body.' }, 400)
  }

  // Honeypot: a filled-in "website" field means a bot walked the form.
  // Answer 200 so the bot believes it succeeded and does not retry.
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return json({ ok: true })
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
  if (!email) return json({ error: 'Email is required.' }, 400)
  if (email.length > 254) return json({ error: 'That email address is too long.' }, 400)
  if (!EMAIL_RE.test(email)) return json({ error: "That doesn't look like an email address." }, 400)

  const rawCity = typeof payload.city === 'string' ? payload.city.trim().toLowerCase() : ''
  const city = ALLOWED_CITIES.has(rawCity) ? rawCity : null

  try {
    // Re-subscribing updates the city and clears any previous opt-out rather
    // than erroring, so the form always confirms for a genuine person.
    await env.DB.prepare(
      `INSERT INTO subscribers (email, city, source)
       VALUES (?1, ?2, 'website')
       ON CONFLICT(email) DO UPDATE SET
         city = COALESCE(excluded.city, subscribers.city),
         unsubscribed_at = NULL,
         updated_at = datetime('now')`,
    )
      .bind(email, city)
      .run()
  } catch (error) {
    console.error('subscribe failed', error)
    return json({ error: 'Could not save your signup. Please try again.' }, 500)
  }

  return json({ ok: true })
}

/** Read-only export of the list, for pasting into a mail provider. */
async function listSubscribers(request: Request, env: Env): Promise<Response> {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    return json({ error: 'Not authorised.' }, 401)
  }

  try {
    const { results } = await env.DB.prepare(
      `SELECT email, city, created_at
         FROM subscribers
        WHERE unsubscribed_at IS NULL
        ORDER BY created_at DESC`,
    ).all()

    return json({ count: results.length, subscribers: results })
  } catch (error) {
    // Never surface the raw error: D1 messages carry SQL and file paths.
    console.error('listSubscribers failed', error)
    return json({ error: 'Could not read the subscriber list.' }, 500)
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await route(request, env)
    } catch (error) {
      // Belt and braces: an uncaught throw must never return a stack trace.
      console.error('unhandled worker error', error)
      return json({ error: 'Something went wrong.' }, 500)
    }
  },
} satisfies ExportedHandler<Env>

async function route(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)

  if (url.pathname === '/api/subscribe') {
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed.' }, 405)
    }
    return subscribe(request, env)
  }

  if (url.pathname === '/api/subscribers') {
    if (request.method !== 'GET') {
      return json({ error: 'Method not allowed.' }, 405)
    }
    return listSubscribers(request, env)
  }

  if (url.pathname.startsWith('/api/')) {
    return json({ error: 'Not found.' }, 404)
  }

  // Static assets: `run_worker_first` only routes /api/* here, but keep the
  // fallback so the Worker is correct even if that config changes.
  return env.ASSETS.fetch(request)
}
