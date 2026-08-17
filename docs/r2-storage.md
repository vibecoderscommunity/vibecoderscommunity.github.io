# R2 object storage

**Short answer: the site does not need R2, and it is not set up.**

This document explains why, and what to do if that changes.

---

## Why it isn't needed

Event photos and posters live in the repo under `src/content/events/*/`, and
Vite processes them at build time: hashing the filenames, fingerprinting them
for cache-busting, and emitting them into `dist/client/assets/`. Cloudflare then
serves them as static assets.

That gives us, for free:

- **Immutable caching.** Hashed filenames mean assets can be cached forever.
- **No egress cost.** Static asset requests on Workers are free and unmetered.
- **Atomic deploys.** Photos ship with the commit that references them, so a
  rollback rolls back the images too.
- **No credentials.** Nothing to configure, rotate or leak.
- **Review in the PR.** You can see the photos in the diff before they go live.

For a meetup site with a few dozen photos per event, this is the right answer.

---

## When you would want R2

Reach for R2 if one of these becomes true:

| Signal | Why R2 helps |
| --- | --- |
| The repo passes ~1 GB of images | Git gets slow, and clones get painful. R2 keeps binaries out of history. |
| A single deploy bundle nears Cloudflare's asset limits (20,000 files / 25 MB per file) | R2 has no such limits. |
| Non-developers need to upload photos | R2 can be written to from a dashboard or an upload form; the repo can't. |
| You want originals plus derived sizes | R2 pairs with Cloudflare Images for on-the-fly resizing. |
| Photos need to change without a redeploy | Repo assets require a build; R2 objects are live immediately. |

A reasonable middle ground before going all-in: keep posters in the repo (there
are few, and they matter for social previews) and move only bulk event photo
galleries to R2.

---

## Setting it up, if you need to

### 1. Create the bucket

```bash
pnpm exec wrangler r2 bucket create vibecoders-photos
```

### 2. Bind it to the Worker

Add to `wrangler.jsonc`:

```jsonc
  "r2_buckets": [
    {
      "binding": "PHOTOS",
      "bucket_name": "vibecoders-photos"
    }
  ]
```

### 3. Decide how photos are served

**Option A — public bucket (simplest).** In the dashboard, under
**R2 → vibecoders-photos → Settings**, connect a custom domain such as
`photos.vibecoders.fyi`. Cloudflare then serves and caches objects directly, and
the Worker isn't involved at all. Reference them in frontmatter by URL:

```yaml
photos:
  - https://photos.vibecoders.fyi/2026-09-16/01.jpg
  - https://photos.vibecoders.fyi/2026-09-16/02.jpg
```

Note that `content-plugin.js` only turns *local* paths into build-time imports;
full URLs are passed through to the `<img>` untouched, so this works today with
no code changes.

**Option B — serve through the Worker.** Useful if you ever want access control
or signed URLs. Add a route to `worker/index.ts`:

```ts
if (url.pathname.startsWith('/photos/')) {
  const key = url.pathname.slice('/photos/'.length)
  const object = await env.PHOTOS.get(key)
  if (!object) return new Response('Not found', { status: 404 })

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('cache-control', 'public, max-age=31536000, immutable')
  return new Response(object.body, { headers })
}
```

and extend the `Env` interface:

```ts
interface Env {
  DB: D1Database
  ASSETS: Fetcher
  PHOTOS: R2Bucket
}
```

Then add `/photos/*` to `run_worker_first` in `wrangler.jsonc`, alongside
`/api/*`.

> Option B puts every image request through Worker CPU time. Prefer Option A
> unless you specifically need the control.

### 4. Upload photos

```bash
# one file
pnpm exec wrangler r2 object put vibecoders-photos/2026-09-16/01.jpg \
  --file ./01.jpg --content-type image/jpeg

# a whole folder
for f in ./photos/*.jpg; do
  pnpm exec wrangler r2 object put \
    "vibecoders-photos/2026-09-16/$(basename "$f")" \
    --file "$f" --content-type image/jpeg
done
```

---

## Costs

R2's free tier is 10 GB of storage, 1M Class A (write) operations and 10M
Class B (read) operations per month. Crucially, **R2 has no egress charges** —
which is the reason to choose it over S3 for public images.

For context: the current site's images total well under 1 MB.
