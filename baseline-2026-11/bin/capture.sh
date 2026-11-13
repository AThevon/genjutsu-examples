#!/usr/bin/env bash
# Build one run's workspace and capture it: baseline-2026-11/bin/capture.sh <run folder> <genjutsu checkout>
#
# <run folder> is baseline-2026-11/<case>-<arm>-<n>. Its workspace (runs/<stamp>/workspace-1) is
# copied to /private/tmp/gj-baseline/build/<run folder name>/, installed from its lockfile and
# built there, unchanged. Then genjutsu's shoot.mjs (no server: the build is answered from disk)
# writes five stills to <run folder>/media/, and genjutsu's static audit, tells group, is run on
# the committed workspace and saved as <run folder>/tells.md and tells.json.
#
#   desktop.png        1440x900, first screen
#   desktop-full.png   1440x900 viewport, whole page
#   mobile.png         390x844 at 2x, first screen
#   mobile-full.png    390x844 at 2x viewport, whole page
#
#   desktop-full-at-load.png   the whole page 300 ms after load, without shoot.mjs's preparation
#
# The first four wait 4 seconds after shoot.mjs's preparation (the page scrolled through, fonts
# and images awaited), so that anything a page plays on load has ended. The fifth shows the page
# before that, and is deleted when it is the same file as desktop-full.png (the page plays
# nothing on load). shots.json in the run folder keeps what shoot.mjs reported for each still:
# page height, sideways overflow, console errors, exceptions, failed requests.
set -euo pipefail

if [ $# -ne 2 ]; then
  echo "usage: capture.sh <run folder> <genjutsu checkout>" >&2
  exit 64
fi
RUN="$(cd "$1" && pwd)"
PLUGIN="$(cd "$2" && pwd)"
NAME="$(basename "$RUN")"
WORKSPACE="$(ls -d "$RUN"/runs/*/workspace-1 | head -1)"
BUILD=/private/tmp/gj-baseline/build/$NAME

rm -rf "$BUILD"
mkdir -p "$BUILD"
rsync -a "$WORKSPACE"/ "$BUILD"/
(cd "$BUILD" && npm ci --no-audit --no-fund >/dev/null && npm run build) > "$RUN/build.log" 2>&1 || {
  echo "capture.sh: the build of $NAME failed, see $RUN/build.log" >&2
  exit 1
}
sed -i '' "s|$BUILD|<build>|g" "$RUN/build.log"

mkdir -p "$RUN/media"
SHOTS="$(mktemp /private/tmp/gj-baseline-shots.XXXXXX)"
cat > "$SHOTS" <<JSON
[
  { "path": "/", "w": 1440, "h": 900, "wait": 4000, "out": "$RUN/media/desktop.png" },
  { "path": "/", "w": 1440, "h": 900, "wait": 4000, "full": true, "out": "$RUN/media/desktop-full.png" },
  { "path": "/", "w": 390, "h": 844, "dpr": 2, "wait": 4000, "out": "$RUN/media/mobile.png" },
  { "path": "/", "w": 390, "h": 844, "dpr": 2, "wait": 4000, "full": true, "out": "$RUN/media/mobile-full.png" },
  { "path": "/", "w": 1440, "h": 900, "prep": false, "wait": 300, "full": true, "out": "$RUN/media/desktop-full-at-load.png" }
]
JSON
node "$PLUGIN/skills/_jutsu/orchestration/scripts/shoot.mjs" --root "$BUILD/dist" --shots "$SHOTS" \
  | sed "s|$RUN/||g" > "$RUN/shots.json"
rm -f "$SHOTS"
if cmp -s "$RUN/media/desktop-full.png" "$RUN/media/desktop-full-at-load.png"; then
  rm "$RUN/media/desktop-full-at-load.png"
fi

python3 "$PLUGIN/skills/_jutsu/design-audit/scripts/audit.py" "$WORKSPACE" --group tells > "$RUN/tells.md"
python3 "$PLUGIN/skills/_jutsu/design-audit/scripts/audit.py" "$WORKSPACE" --group tells --json \
  | sed "s|$(dirname "$(dirname "$RUN")")/||g" > "$RUN/tells.json"
grep -m1 'checked' "$RUN/tells.md"
