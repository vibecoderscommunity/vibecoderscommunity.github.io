#!/usr/bin/env python3
"""Import event photos: renumber, downscale and re-encode into an event's photos/.

Usage:
    import_photos.py <event-dir> <source...> [--dry-run]
    import_photos.py <event-dir> --in-place [--dry-run]

<source> is any mix of folders, image files and globs. A folder contributes its
images sorted by filename; explicit files keep the order given on the command
line. Existing photos are left alone and numbering continues after them, so this
is also the way to add a second batch to an event that already has some.

Photos come off phones and cameras at 6000px and 12MB. Nothing in the build
resizes them and the event page loads the whole grid, so each one is capped at
1600px and re-encoded to AVIF (~70KB) on the way in.

--in-place does the same to photos already in the folder, keeping their numbers,
for events imported before this existed. It replaces the originals, so it
refuses to touch anything git does not already have a copy of.
"""

import argparse
import os
import re
import shutil
import subprocess
import sys

# What the content plugin will pick up out of photos/ (IMAGE_RE), plus the
# camera formats sips can read and convert on import.
READABLE = (".avif", ".webp", ".png", ".jpg", ".jpeg", ".gif", ".heic", ".heif", ".tif", ".tiff")
RENDERABLE = (".avif", ".webp", ".png", ".jpg", ".jpeg", ".gif", ".svg")

MAX_PX = 1600
QUALITY = 65


def collect(sources):
    """Expand sources into an ordered, de-duplicated list of image paths."""
    out = []
    for src in sources:
        if os.path.isdir(src):
            names = sorted(os.listdir(src))
            out += [os.path.join(src, n) for n in names
                    if n.lower().endswith(READABLE) and not n.startswith(".")]
        elif os.path.isfile(src):
            if src.lower().endswith(READABLE):
                out.append(src)
            else:
                print(f"skipping (not an image): {src}", file=sys.stderr)
        else:
            print(f"skipping (not found): {src}", file=sys.stderr)
    seen, unique = set(), []
    for p in out:
        real = os.path.realpath(p)
        if real not in seen:
            seen.add(real)
            unique.append(p)
    return unique


def existing_max(photos_dir):
    """Highest NN already used, so a second batch appends instead of clobbering."""
    if not os.path.isdir(photos_dir):
        return 0
    highest = 0
    for name in os.listdir(photos_dir):
        stem = os.path.splitext(name)[0]
        if stem.isdigit() and name.lower().endswith(RENDERABLE):
            highest = max(highest, int(stem))
    return highest


def within_cap(path):
    """True when the image is already no larger than MAX_PX on its long edge."""
    if not shutil.which("sips"):
        return False
    r = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", path],
                       capture_output=True, text=True)
    dims = [int(m) for m in re.findall(r"pixel(?:Width|Height):\s*(\d+)", r.stdout)]
    return bool(dims) and max(dims) <= MAX_PX


def convert(src, dest):
    """Downscale and re-encode. Falls back to copying where sips is absent."""
    if not shutil.which("sips"):
        shutil.copy2(src, dest)
        return "copied (sips not available)"
    r = subprocess.run(
        ["sips", "-s", "format", "avif", "-s", "formatOptions", str(QUALITY),
         "-Z", str(MAX_PX), src, "--out", dest],
        capture_output=True)
    if r.returncode != 0 or not os.path.exists(dest):
        shutil.copy2(src, dest)
        return "copied (conversion failed)"
    return None


def untracked(paths):
    """Which of these files git has no copy of — i.e. would be lost outright."""
    missing = []
    for p in paths:
        r = subprocess.run(["git", "ls-files", "--error-unmatch", p],
                           capture_output=True,
                           cwd=os.path.dirname(os.path.abspath(p)) or ".")
        if r.returncode != 0:
            missing.append(p)
    return missing


def human(n):
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:.0f}{unit}" if unit == "B" else f"{n:.1f}{unit}"
        n /= 1024


def recompress(photos_dir, args):
    """Shrink photos already in the folder, keeping their numbering."""
    if not os.path.isdir(photos_dir):
        raise SystemExit(f"error: no photos folder at {photos_dir}")

    todo = []
    for name in sorted(os.listdir(photos_dir)):
        path = os.path.join(photos_dir, name)
        if not os.path.isfile(path) or not name.lower().endswith(READABLE):
            continue
        # An AVIF already within the cap has nothing to gain, and re-encoding
        # it would only lose quality.
        if name.lower().endswith(".avif") and within_cap(path):
            continue
        todo.append(path)

    if not todo:
        print(f"{photos_dir}: nothing to recompress")
        return

    total = sum(os.path.getsize(p) for p in todo)
    if args.dry_run:
        for p in todo:
            print(f"{os.path.basename(p)}  ({human(os.path.getsize(p))})"
                  f"  ->  {os.path.splitext(os.path.basename(p))[0]}.avif")
        print(f"\n{len(todo)} photo(s), {human(total)} — dry run, nothing written")
        return

    lost = untracked(todo)
    if lost and not args.force:
        print("refusing to overwrite files git has no copy of:", file=sys.stderr)
        for p in lost:
            print(f"  {p}", file=sys.stderr)
        raise SystemExit(
            "\nCommit them first, or re-run with --force to accept losing the "
            "originals.")

    before = after = 0
    for path in todo:
        dest = os.path.splitext(path)[0] + ".avif"
        tmp = dest + ".tmp"
        note = convert(path, tmp)
        if note:
            os.path.exists(tmp) and os.remove(tmp)
            print(f"{os.path.basename(path)}  [skipped — {note}]")
            continue
        src_size, dest_size = os.path.getsize(path), os.path.getsize(tmp)
        # Leave it alone if the re-encode is not actually smaller.
        if dest_size >= src_size:
            os.remove(tmp)
            print(f"{os.path.basename(path)}  [kept — already smaller]")
            continue
        os.replace(tmp, dest)
        if path != dest:
            os.remove(path)
        before += src_size
        after += dest_size
        print(f"{os.path.basename(path)}  ->  {os.path.basename(dest)}  "
              f"{human(src_size)} -> {human(dest_size)}")

    if before:
        print(f"\n{human(before)} -> {human(after)}  "
              f"({100 * (before - after) / before:.0f}% smaller)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("event_dir", help="the event folder, e.g. src/content/events/<slug>")
    ap.add_argument("sources", nargs="*", help="folders, image files or globs")
    ap.add_argument("--in-place", action="store_true",
                    help="recompress the photos already in the folder, keeping "
                         "their numbers, instead of importing new ones")
    ap.add_argument("--force", action="store_true",
                    help="with --in-place, proceed even for files git has no "
                         "copy of (they cannot be recovered afterwards)")
    ap.add_argument("--dry-run", action="store_true",
                    help="print the mapping without writing anything")
    args = ap.parse_args()

    if not os.path.isdir(args.event_dir):
        raise SystemExit(f"error: no such event folder: {args.event_dir}")

    photos_dir = os.path.join(args.event_dir, "photos")

    if args.in_place:
        return recompress(photos_dir, args)
    if not args.sources:
        raise SystemExit("error: give at least one source, or --in-place")

    sources = collect(args.sources)
    if not sources:
        raise SystemExit("error: no images found in the sources given")

    start = existing_max(photos_dir)
    if start:
        print(f"{photos_dir} already has photos up to {start:02d} — appending\n")

    width = max(2, len(str(start + len(sources))))
    before = after = 0
    plan = []
    for i, src in enumerate(sources, start=start + 1):
        plan.append((src, f"{i:0{width}d}.avif"))

    if args.dry_run:
        for src, name in plan:
            print(f"{name}  <-  {src}  ({human(os.path.getsize(src))})")
        print(f"\n{len(plan)} photo(s), dry run — nothing written")
        return

    os.makedirs(photos_dir, exist_ok=True)
    for src, name in plan:
        dest = os.path.join(photos_dir, name)
        note = convert(src, dest)
        src_size, dest_size = os.path.getsize(src), os.path.getsize(dest)
        before += src_size
        after += dest_size
        print(f"{name}  <-  {os.path.basename(src)}  "
              f"{human(src_size)} -> {human(dest_size)}"
              f"{'  [' + note + ']' if note else ''}")

    print(f"\n{len(plan)} photo(s) into {photos_dir}")
    if before:
        print(f"total {human(before)} -> {human(after)}")


if __name__ == "__main__":
    main()
