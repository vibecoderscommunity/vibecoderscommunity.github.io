# Cloudflare setup

The site is a single Cloudflare Worker that does two things:

- serves the prerendered static site from `dist/client`
- handles `POST /api/subscribe`, writing newsletter signups to a **D1** database

You only need to do this setup **once**. After that, deploying is
`pnpm run deploy`.

---

## Prerequisites

- A Cloudflare account (the free plan is enough for all of this)
- Node 20+ and `pnpm`
- `pnpm install` has been run in this repo

Wrangler is a dev dependency, so every command below uses `pnpm exec wrangler`
— there's nothing to install globally.

---

## 1. Log in

```bash
pnpm exec wrangler login
```

This opens a browser and authorises Wrangler against your Cloudflare account.
Confirm it worked:

```bash
pnpm exec wrangler whoami
```

---

## 2. Create the D1 database

D1 is Cloudflare's serverless SQLite. It stores the newsletter list.

```bash
pnpm exec wrangler d1 create vibecoders-site
```

The output ends with a block like this:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "vibecoders-site",
      "database_id": "a1b2c3d4-0000-1111-2222-333344445555"
    }
  ]
}
```

**Copy the `database_id`** and paste it into `wrangler.jsonc`, replacing
`REPLACE_WITH_YOUR_DATABASE_ID`:

```jsonc
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "vibecoders-site",
      "database_id": "a1b2c3d4-0000-1111-2222-333344445555",
      "migrations_dir": "migrations"
    }
  ]
```

> **Is the database id a secret?** No, and it has to be committed — see
> [Secrets and configuration](#secrets-and-configuration) below for why.

---

## 3. Create the table

Migrations live in `migrations/`. Apply them to the real database:

```bash
pnpm run db:migrate
```

And to your local development database:

```bash
pnpm run db:migrate:local
```

Check it worked:

```bash
pnpm exec wrangler d1 execute vibecoders-site --remote \
  --command "SELECT name FROM sqlite_master WHERE type='table'"
```

### The schema

`migrations/0001_create_subscribers.sql`:

| Column | Notes |
| --- | --- |
| `id` | auto-increment primary key |
| `email` | **UNIQUE**. Stored trimmed and lower-cased, so `A@b.com` and `a@b.com ` are the same person. |
| `city` | `tokyo` \| `singapore` \| `else` \| `NULL`. Anything else is discarded rather than stored. |
| `source` | Where the signup came from. `website` for the form. |
| `unsubscribed_at` | Set when someone opts out. Rows are kept so the opt-out is honoured. |
| `created_at` / `updated_at` | UTC timestamps. |

Signing up twice is not an error: the Worker upserts, updating the city and
clearing any previous opt-out, so a returning visitor always sees the
confirmation.

### Adding a migration later

Create a new numbered file in `migrations/` and apply it:

```bash
pnpm exec wrangler d1 migrations create vibecoders-site add_something
# edit the generated file, then:
pnpm run db:migrate:local   # try it locally first
pnpm run db:migrate         # then apply for real
```

---

## 4. Deploy

```bash
pnpm run deploy
```

That builds the site and uploads the Worker plus the static assets. Wrangler
prints the deployed URL, something like
`https://vibecoders.<your-subdomain>.workers.dev`.

---

## 5. Point your domain at it

In the Cloudflare dashboard:

1. **Workers & Pages → `vibecoders` → Settings → Domains & Routes**
2. **Add → Custom domain**, enter `vibecoders.fyi`
3. Cloudflare creates the DNS record for you (the domain must be on your
   Cloudflare account)

Then update `url:` in `src/content/site.yaml` to match, so canonical links and
`sitemap.xml` are correct, and redeploy.

---

## Secrets and configuration

**This repository is public.** Here is exactly what lives where, and why.

### Never committed — put these in `.env`

`.env` is gitignored. Copy the committed template and fill it in:

```bash
cp .env.example .env
```

| Variable | What it is |
| --- | --- |
| `ADMIN_TOKEN` | Shared secret guarding `GET /api/subscribers`. Unset ⇒ the endpoint is disabled and always returns 401. |
| `TURNSTILE_SECRET` | Only if you add Turnstile to the form. |
| `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` | Only needed to deploy without `wrangler login`. CI uses GitHub Actions secrets instead. |

`wrangler dev` reads `.env` automatically and exposes the values to the Worker
as `env.*`. You can confirm it worked — the startup banner lists the binding and
prints the value as `"(hidden)"`:

```
env.ADMIN_TOKEN ("(hidden)")    Environment Variable    local
```

> ⚠️ **Never prefix a secret with `VITE_`.** Vite inlines `VITE_*` variables
> into the browser bundle, which would publish the value to every visitor.
> Nothing in this project uses that prefix, and nothing should.

> ⚠️ **Use `.env` *or* `.dev.vars`, not both.** Cloudflare ignores `.env`
> entirely when a `.dev.vars` file exists. This project standardises on `.env`;
> `.dev.vars` is gitignored too, purely as a safety net.

### Production secrets

`.env` is for local development only — it is never uploaded. Set production
values on Cloudflare, where they are encrypted at rest:

```bash
pnpm exec wrangler secret put ADMIN_TOKEN
pnpm exec wrangler secret list
```

### Committed on purpose — not secrets

| Value | Why it's safe |
| --- | --- |
| `database_id` in `wrangler.jsonc` | A resource identifier, not a credential. Using it requires an authenticated API token scoped to your account, which is not in the repo. This is what Cloudflare's own docs and templates do. |
| `database_name`, bindings, routes | Plain configuration. |

**Why `database_id` can't move to `.env`:** Wrangler does not perform variable
substitution inside `wrangler.jsonc`. A `${VAR}` in that file is passed through
as a literal string rather than expanded, so moving it out would simply produce
a broken deploy. Non-secret config belongs in the config file; only secrets
belong in `.env`.

If you nevertheless want the id out of the repo, the only supported route is to
generate `wrangler.jsonc` at deploy time from a gitignored template — which
means CI has to rebuild it too. That is real ongoing cost to hide a value that
grants nothing on its own, so it isn't recommended.

### Rotating a leaked secret

If `ADMIN_TOKEN` is ever exposed, rotate rather than delete:

```bash
pnpm exec wrangler secret put ADMIN_TOKEN     # paste a fresh value
```

Generate one with `openssl rand -hex 32`. If a Cloudflare **API token** leaks,
revoke it in the dashboard under **My Profile → API Tokens** immediately — that
one is a real credential.

---

## Reading the newsletter list

The quickest way:

```bash
pnpm run db:subscribers
```

Or export to CSV for a mail provider:

```bash
pnpm exec wrangler d1 execute vibecoders-site --remote --json \
  --command "SELECT email, city, created_at FROM subscribers WHERE unsubscribed_at IS NULL ORDER BY created_at DESC" \
  | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const r=JSON.parse(s)[0].results;console.log('email,city,created_at');r.forEach(x=>console.log([x.email,x.city||'',x.created_at].join(',')))})" \
  > subscribers.csv
```

### Over HTTP

There's also a `GET /api/subscribers` endpoint, off by default. To enable it,
set a token in production (and in `.env` for local dev — see
[Secrets and configuration](#secrets-and-configuration)):

```bash
pnpm exec wrangler secret put ADMIN_TOKEN
```

Then:

```bash
curl https://vibecoders.fyi/api/subscribers -H "Authorization: Bearer <token>"
```

Without `ADMIN_TOKEN` set, the endpoint always returns 401.

### Unsubscribing someone

```bash
pnpm exec wrangler d1 execute vibecoders-site --remote \
  --command "UPDATE subscribers SET unsubscribed_at = datetime('now') WHERE email = 'someone@example.com'"
```

---

## Local development

Two options:

**Full stack** — static site plus the real Worker and a local D1:

```bash
pnpm run preview       # builds, then runs wrangler dev on :8787
```

**Fast frontend loop** — Vite with hot reload:

```bash
pnpm run dev           # :5173
```

`vite.config.ts` proxies `/api/*` to `http://127.0.0.1:8787`, so run
`pnpm exec wrangler dev` in a second terminal if you want the signup form to
work while using the Vite dev server.

The local database is a real SQLite file under `.wrangler/` — it is gitignored
and completely separate from production. Reset it any time:

```bash
rm -rf .wrangler && pnpm run db:migrate:local
```

---

## How requests are routed

`wrangler.jsonc` sets `run_worker_first: ["/api/*"]`. That means:

- `/api/*` → the Worker in `worker/index.ts`
- everything else → served straight from Cloudflare's asset edge, never
  touching Worker CPU time (and so never counting against your request limits)

Unknown paths get the prerendered `404.html` with a real `404` status.

---

## Spam protection

The form has a hidden honeypot field. Bots that fill it get a `200 OK` and
nothing is written, so they don't retry. Combined with email-format validation
and the `UNIQUE` constraint, that handles ordinary drive-by spam.

If you start seeing real abuse, add [Cloudflare
Turnstile](https://developers.cloudflare.com/turnstile/):

1. Create a widget in the dashboard, note the site key and secret key
2. `pnpm exec wrangler secret put TURNSTILE_SECRET`
3. Render the widget in `NewsletterBand.vue` and send the token with the POST
4. In `worker/index.ts`, verify the token against
   `https://challenges.cloudflare.com/turnstile/v0/siteverify` before the insert

You can also add a rate limit in the dashboard under **Security → WAF → Rate
limiting rules**, scoped to `/api/subscribe`, without touching any code.

---

## Do we need R2?

**No — not for the site as it stands.** See
[`docs/r2-storage.md`](./r2-storage.md) for why, and for the setup steps if that
ever changes.

---

## Costs

Everything here fits comfortably in Cloudflare's free tier:

| Service | Free allowance | This site's usage |
| --- | --- | --- |
| Workers | 100,000 requests/day | Only `/api/*` — a handful a day |
| Static assets | Unlimited, free | All page and image traffic |
| D1 | 5 GB storage, 5M row reads/day | A few thousand rows at most |

---

## Troubleshooting

**`Couldn't find a D1 DB with the name or binding 'vibecoders-site'`**
The `database_id` in `wrangler.jsonc` is still the placeholder, or you're logged
into a different Cloudflare account. Check `pnpm exec wrangler whoami`.

**`no such table: subscribers`**
Migrations haven't been applied to that database. Run `pnpm run db:migrate` for
production or `pnpm run db:migrate:local` for local dev.

**Signups work locally but not in production**
You almost certainly ran only `db:migrate:local`. The local and remote databases
are separate — run `pnpm run db:migrate` too.

**The form says "Could not reach the server"**
On the Vite dev server, `/api` is proxied to port 8787. Start
`pnpm exec wrangler dev` in another terminal, or use `pnpm run preview`.

**Deploy succeeds but the site is stale**
`wrangler deploy` uploads whatever is in `dist/client`. Use `pnpm run deploy`,
which rebuilds first, rather than calling `wrangler deploy` directly.
