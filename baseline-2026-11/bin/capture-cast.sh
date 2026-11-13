#!/usr/bin/env bash
# Build an invoice-mark-paid workspace and capture one click: capture-cast.sh <workspace> <out dir> <genjutsu checkout>
#
# The workspace is copied to /private/tmp/gj-baseline/build/cast-<name of out dir>/, installed
# from its lockfile and built unchanged. genjutsu's shoot.mjs then writes, at 1440x900:
#
#   rest.png            before any click
#   click-120ms.png     120 ms after a click on "Mark as paid" of FOL-2026-032 (Overdue, 4,200.00 EUR)
#   click-350ms.png     350 ms after it
#   click-800ms.png     800 ms after it
#   click-3000ms.png    3 s after it
#   strip.png           the four after-click stills, cropped to the cards and first rows, stacked
#
# and mobile.png (390x844 at 2x, before any click). Each still is its own page load and its own
# click, in real time; the same script captures both arms.
set -euo pipefail

if [ $# -ne 3 ]; then
  echo "usage: capture-cast.sh <workspace> <out dir> <genjutsu checkout>" >&2
  exit 64
fi
WORKSPACE="$(cd "$1" && pwd)"
mkdir -p "$2"
OUT="$(cd "$2" && pwd)"
PLUGIN="$(cd "$3" && pwd)"
BUILD=/private/tmp/gj-baseline/build/cast-$(basename "$(dirname "$OUT")")-$(basename "$OUT")

rm -rf "$BUILD"
mkdir -p "$BUILD"
rsync -a --exclude node_modules --exclude dist "$WORKSPACE"/ "$BUILD"/
(cd "$BUILD" && npm ci --no-audit --no-fund >/dev/null && npm run build) > "$OUT/build.log" 2>&1
sed -i '' "s|$BUILD|<build>|g" "$OUT/build.log"

CLICK="(()=>{[...document.querySelectorAll('tbody tr')].find(r=>r.textContent.includes('FOL-2026-032')).querySelector('button').click();return 1})()"
SHOTS="$(mktemp /private/tmp/gj-baseline-shots.XXXXXX)"
cat > "$SHOTS" <<JSON
[
  { "path": "/", "w": 1440, "h": 900, "wait": 800, "out": "$OUT/rest.png" },
  { "path": "/", "w": 390, "h": 844, "dpr": 2, "wait": 800, "out": "$OUT/mobile.png" },
  { "path": "/", "w": 1440, "h": 900, "prep": false, "before": "$CLICK", "wait": 120, "out": "$OUT/click-120ms.png" },
  { "path": "/", "w": 1440, "h": 900, "prep": false, "before": "$CLICK", "wait": 350, "out": "$OUT/click-350ms.png" },
  { "path": "/", "w": 1440, "h": 900, "prep": false, "before": "$CLICK", "wait": 800, "out": "$OUT/click-800ms.png" },
  { "path": "/", "w": 1440, "h": 900, "prep": false, "before": "$CLICK", "wait": 3000, "out": "$OUT/click-3000ms.png" }
]
JSON
node "$PLUGIN/skills/_jutsu/orchestration/scripts/shoot.mjs" --root "$BUILD/dist" --shots "$SHOTS" \
  | sed "s|$OUT/||g" > "$OUT/shots.json"
rm -f "$SHOTS"
magick "$OUT/click-120ms.png" "$OUT/click-350ms.png" "$OUT/click-800ms.png" "$OUT/click-3000ms.png" \
  -crop 1200x520+120+50 +repage -append "$OUT/strip.png"
