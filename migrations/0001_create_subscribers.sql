-- Newsletter subscribers for the Vibe Coders Community site.
--
-- Apply with:
--   pnpm run db:migrate:local   (local dev database used by `wrangler dev`)
--   pnpm run db:migrate         (the real database on Cloudflare)

CREATE TABLE IF NOT EXISTS subscribers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Stored lower-cased and trimmed so the UNIQUE index actually de-duplicates.
  email       TEXT    NOT NULL UNIQUE,
  -- 'tokyo' | 'singapore' | 'columbus' | 'else' | NULL — matches site.yaml's newsletter.cities.
  city        TEXT,
  -- Where the signup came from, so a second form later stays distinguishable.
  source      TEXT    NOT NULL DEFAULT 'website',
  -- Set when someone unsubscribes; rows are kept so we honour the opt-out.
  unsubscribed_at TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers (created_at);
CREATE INDEX IF NOT EXISTS idx_subscribers_city ON subscribers (city);
