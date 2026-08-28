#!/usr/bin/env python3
"""Fetch a lu.ma event and emit its details as JSON (and optionally its poster).

Usage:
    luma_fetch.py <luma-url-or-slug> [--poster <dest-dir>]

Prints a JSON object to stdout:
    {"name", "date", "time", "timezone", "venue", "calendar",
     "cover_url", "poster_file", "url", "body"}

`body` is the event description converted from lu.ma's ProseMirror document
into clean Markdown. Requires only the Python 3 standard library.
"""

import argparse
import json
import os
import re
import sys
import shutil
import subprocess
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")

# lu.ma pastes carry zero-width spaces that survive into the Markdown otherwise.
ZERO_WIDTH = dict.fromkeys(map(ord, "​‌﻿"), None)


def get(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read()
    except urllib.error.HTTPError as e:
        raise SystemExit(f"error: lu.ma returned HTTP {e.code} for {url} — "
                         "check the link is right and the event is public")
    except urllib.error.URLError as e:
        raise SystemExit(f"error: could not reach {url} ({e.reason})")
    return raw if binary else raw.decode("utf-8", "replace")


def next_data(html):
    m = re.search(
        r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',
        html, re.S)
    if not m:
        raise SystemExit("error: no __NEXT_DATA__ on the page — is the URL a "
                         "public lu.ma event?")
    return json.loads(m.group(1))


# --- ProseMirror -> Markdown ------------------------------------------------

KEEP_IMAGES = False


def clean_url(href):
    """Drop lu.ma's tracking params so a bare-URL label matches its href."""
    base, _, query = href.partition("?")
    kept = [p for p in query.split("&")
            if p and not p.split("=")[0].startswith(("utm_", "ref"))]
    return f"{base}?{'&'.join(kept)}" if kept else base


def esc(text):
    """Escape Markdown control characters that would otherwise be syntax."""
    return re.sub(r'(?<!\\)([*_`\[\]])', r'\\\1', text)


def inline(nodes):
    out = []
    for n in nodes or []:
        t = n.get("type")
        if t == "hard_break":
            out.append("  \n")
            continue
        if t != "text":
            out.append(inline(n.get("content")))
            continue

        text = n.get("text", "").translate(ZERO_WIDTH)
        marks = {m["type"]: m.get("attrs", {}) for m in n.get("marks", [])}

        # Split trailing/leading spaces out of the emphasis — "**bold **" is not
        # valid Markdown and renders literally.
        lead = text[:len(text) - len(text.lstrip())]
        trail = text[len(text.rstrip()):]
        core = text.strip()

        if not core:
            out.append(text)
            continue

        # lu.ma authors often leave a stray "**,**" — emphasis on punctuation
        # alone is noise, so drop the marks and keep the character.
        if "link" not in marks and not re.search(r'\w', core):
            out.append(f"{lead}{esc(core)}{trail}")
            continue

        if "link" in marks:
            href = clean_url(marks["link"].get("href", ""))
            # A bare URL as its own label reads better unwrapped; markdown-it
            # linkifies it and the site opens external links in a new tab.
            core = core if core == href else f"[{esc(core)}]({href})"
        else:
            core = esc(core)
            if "code" in marks:
                core = f"`{core}`"
            if "bold" in marks:
                core = f"**{core}**"
            if "italic" in marks:
                core = f"_{core}_"

        out.append(f"{lead}{core}{trail}")
    return "".join(out)


def block(node, depth=0, index=None):
    t = node.get("type")
    kids = node.get("content", [])

    if t in ("paragraph", "heading"):
        text = inline(kids).strip()
        if not text:
            return []
        if re.fullmatch(r'[-\u2014\u2013_*\s]{2,}', text):
            return ["---"]
        if t == "heading":
            # lu.ma starts headings at h1; the event page already renders the
            # title as the h1, so shift everything down to ## and below.
            level = min(node.get("attrs", {}).get("level", 1) + 1, 4)
            # A heading that is wholly bold is styled, not emphasised.
            text = re.sub(r'^\*\*(.*)\*\*$', r'\1', text)
            return [f"{'#' * level} {text}"]
        return [text]

    if t in ("bullet_list", "ordered_list"):
        out = []
        start = node.get("attrs", {}).get("order", 1) if t == "ordered_list" else None
        for i, item in enumerate(kids):
            marker = f"{start + i}." if start else "-"
            pad = " " * len(f"{marker} ")
            lines = []
            for j, child in enumerate(item.get("content", [])):
                lines += block(child, depth + 1)
            if not lines:
                continue
            body = "\n\n".join(lines).split("\n")
            out.append(f"{'  ' * depth}{marker} {body[0]}")
            out += [f"{'  ' * depth}{pad}{l}" if l else "" for l in body[1:]]
        return ["\n".join(out)] if out else []

    if t == "blockquote":
        inner = []
        for child in kids:
            inner += block(child, depth)
        quoted = "\n\n".join(inner).split("\n")
        return ["\n".join(f"> {l}".rstrip() for l in quoted)]

    if t in ("code_block", "codeBlock"):
        lang = node.get("attrs", {}).get("language") or ""
        return [f"```{lang}\n{inline(kids)}\n```"]

    if t in ("horizontal_rule", "divider"):
        return ["---"]

    if t == "image":
        # lu.ma descriptions are padded with sponsor logos and venue photos on
        # their CDN. Hotlinking them from the site is wrong, and body images
        # here are local files, so drop them unless asked to keep.
        if not KEEP_IMAGES:
            return []
        attrs = node.get("attrs", {})
        return [f"![{attrs.get('alt') or ''}]({attrs.get('src') or ''})"]

    # Unknown wrapper (embeds, tables, etc.) — descend so text is not lost.
    out = []
    for child in kids:
        out += block(child, depth)
    return out


def to_markdown(doc):
    if not isinstance(doc, dict):
        return ""
    blocks = []
    for node in doc.get("content", []):
        blocks += block(node)
    md = "\n\n".join(b for b in blocks if b.strip())
    return re.sub(r'\n{3,}', '\n\n', md).strip()


# --- main -------------------------------------------------------------------

def optimise(path, max_px=1080, quality=70):
    """Shrink the lu.ma cover to a web-sized AVIF, as the repo's posters are.

    Covers come down at ~1250px and 2MB; the card renders far smaller. Uses
    macOS `sips`, and leaves the original in place anywhere else.
    """
    if not shutil.which("sips"):
        return path, "sips not available — poster left as downloaded"
    dest = os.path.splitext(path)[0] + ".avif"
    r = subprocess.run(
        ["sips", "-s", "format", "avif", "-s", "formatOptions", str(quality),
         "-Z", str(max_px), path, "--out", dest],
        capture_output=True)
    if r.returncode != 0 or not os.path.exists(dest):
        return path, "sips conversion failed — poster left as downloaded"
    if path != dest:
        os.remove(path)
    return dest, None


def local_dt(iso, tzname, offset_minutes):
    """lu.ma stores UTC; the event date is the one in the venue's timezone."""
    dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
    try:
        from zoneinfo import ZoneInfo
        return dt.astimezone(ZoneInfo(tzname))
    except Exception:
        return dt.astimezone(timezone(timedelta(minutes=offset_minutes or 0)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("--poster", metavar="DEST_DIR",
                    help="download the cover image into DEST_DIR as poster.<ext>")
    ap.add_argument("--no-optimize", action="store_true",
                    help="keep the full-size cover instead of a 1080px AVIF")
    ap.add_argument("--keep-images", action="store_true",
                    help="keep inline description images (dropped by default)")
    args = ap.parse_args()

    global KEEP_IMAGES
    KEEP_IMAGES = args.keep_images

    url = args.url if args.url.startswith("http") else f"https://luma.com/{args.url}"
    try:
        data = next_data(get(url))["props"]["pageProps"]["initialData"]["data"]
        event = data["event"]
    except (KeyError, TypeError):
        raise SystemExit("error: unexpected page shape — lu.ma may have "
                         "changed its markup, or this is not an event page")

    tzname = event.get("timezone") or "UTC"
    start = local_dt(event["start_at"], tzname, event.get("tz_offset_minutes"))
    end = None
    if event.get("end_at"):
        end = local_dt(event["end_at"], tzname, event.get("tz_offset_minutes"))

    def hhmm(d):
        return d.strftime("%-I:%M%p").replace(":00", "").upper()

    geo = event.get("geo_address_info") or {}
    venue = geo.get("city_state") or geo.get("address") or geo.get("full_address") or ""

    # The site's `meta` line: "FRI, SEP 11 · 6:30-8:30PM · SHIBUYA"
    span = hhmm(start)
    if end:
        a, b = hhmm(start), hhmm(end)
        # "7PM-9PM" reads better as "7-9PM"
        span = f"{a[:-2]}-{b}" if a[-2:] == b[-2:] else f"{a}-{b}"
    where = (geo.get("city") or venue.split(",")[0]).strip().upper()
    meta = " · ".join(x for x in (
        start.strftime("%a, %b %-d").upper(), span, where) if x)

    out = {
        "meta": meta,
        "name": (event.get("name") or "").translate(ZERO_WIDTH).strip(),
        "date": start.strftime("%Y-%m-%d"),
        "time": f"{hhmm(start)}-{hhmm(end)}" if end else hhmm(start),
        "timezone": tzname,
        "venue": geo.get("name") or venue,
        "calendar": (data.get("calendar") or {}).get("name", ""),
        "cover_url": event.get("cover_url", ""),
        "url": url,
        "body": to_markdown(data.get("description_mirror")),
    }

    if args.poster and out["cover_url"]:
        ext = os.path.splitext(out["cover_url"].split("?")[0])[1].lower() or ".png"
        if ext not in (".png", ".jpg", ".jpeg", ".webp", ".avif"):
            ext = ".png"
        os.makedirs(args.poster, exist_ok=True)
        dest = os.path.join(args.poster, f"poster{ext}")
        with open(dest, "wb") as fh:
            fh.write(get(out["cover_url"], binary=True))
        if not args.no_optimize:
            dest, warning = optimise(dest)
            if warning:
                out["poster_warning"] = warning
        out["poster_file"] = dest
        out["poster_bytes"] = os.path.getsize(dest)

    json.dump(out, sys.stdout, ensure_ascii=False, indent=2)
    print()


if __name__ == "__main__":
    main()
