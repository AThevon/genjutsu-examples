#!/usr/bin/env bash
# Cuts and encodes media/run-2/ from the simulator recordings of the second run: make-media-run-2.sh <takes dir>
# Same tools and same helpers as make-media.sh (the first run's). The recordings (takes/driver/take.sh) are not
# committed. The cut times below are those of the takes filmed on 2026-11-13 from build-20261113T201315Z-1; a new
# recording starts at another instant, so find its cuts again with
#   swift frames.swift <take.mp4> /tmp/f 30 && python3 segments.py /tmp/f 30
set -euo pipefail
AFTER="$1"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$HERE/../media/run-2"
mkdir -p "$OUT"
W="$(mktemp -d /private/tmp/etale-ios-media.XXXXXX)"
swiftc -O "$HERE/frames.swift" -o "$W/frames" 2>/dev/null

clip() { # <take.mp4> <from s> <to s> <source fps> <out fps> <quality> <width> <out.webp>
  rm -rf "$W/f"
  "$W/frames" "$1" "$W/f" "$4" "$2" "$3"
  python3 "$HERE/encode-clip.py" "$W/f" "$8" "$4" "$5" "$6" "$7"
}
still() { # <take.mp4> <at s> <out.png>: one frame, 1206x2622 scaled to 603x1311
  rm -rf "$W/s"
  "$W/frames" "$1" "$W/s" 1 "$2" "$(echo "$2 + 0.01" | bc)" >/dev/null
  magick "$W/s/f00000.png" -resize 603x -strip "$3"
}

# testOpenAndClose: open 10:31 at 14.33 s, back at 17.83 s, open 16:17 at 21.13 s, back at 24.60 s.
clip  "$AFTER/testOpenAndClose.mp4" 13.7 26.0 30 24 62 402 "$OUT/clip.webp"
still "$AFTER/testOpenAndClose.mp4" 13.9   "$OUT/today.png"
still "$AFTER/testOpenAndClose.mp4" 14.367 "$OUT/open-early.png"
still "$AFTER/testOpenAndClose.mp4" 14.433 "$OUT/open-mid.png"
still "$AFTER/testOpenAndClose.mp4" 14.700 "$OUT/marker-mid.png"
still "$AFTER/testOpenAndClose.mp4" 17.0   "$OUT/detail.png"
still "$AFTER/testOpenAndClose.mp4" 18.0   "$OUT/close-mid.png"
still "$AFTER/testOpenAndClose.mp4" 18.433 "$OUT/defect-source-box.png"
# testEdgeSwipeBack: the finger goes down on the leading edge at 15.03 s and lets go at about 16.25 s.
clip  "$AFTER/testEdgeSwipeBack.mp4" 14.8 17.2 30 24 62 402 "$OUT/edge-swipe.webp"
still "$AFTER/testEdgeSwipeBack.mp4" 15.4 "$OUT/edge-swipe-mid.png"
# testDragClose: the same downward drag as the first run's defect take, from 18.87 s; released at about 20.1 s.
clip  "$AFTER/testDragClose.mp4" 18.7 21.1 30 24 62 402 "$OUT/drag-down.webp"
still "$AFTER/testDragClose.mp4" 19.4 "$OUT/drag-down-mid.png"
# testAlert: open at 13.83 s, the switch at 17.07 s, back at 19.87 s.
clip  "$AFTER/testAlert.mp4" 16.6 21.6 30 24 66 402 "$OUT/alert.webp"
still "$AFTER/testAlert.mp4" 21.4 "$OUT/alert-row.png"
# Reduce Motion on. testOpenAndClose: open at 13.23 s, back at 16.13 s.
clip  "$AFTER/reduced/testOpenAndClose.mp4" 12.7 17.2 30 24 66 402 "$OUT/reduced.webp"
still "$AFTER/reduced/testOpenAndClose.mp4" 13.4 "$OUT/reduced-mid.png"
# Dark appearance. testOpenAndClose: open at 10.43 s.
still "$AFTER/dark/testOpenAndClose.mp4" 10.533 "$OUT/dark-mid.png"
still "$AFTER/dark/testOpenAndClose.mp4" 13.0   "$OUT/dark-detail.png"
# Text size accessibility-large. testOpenAndClose: open at 10.37 s.
still "$AFTER/xxxl/testOpenAndClose.mp4" 10.2   "$OUT/large-type-today.png"
still "$AFTER/xxxl/testOpenAndClose.mp4" 10.467 "$OUT/large-type-mid.png"
still "$AFTER/xxxl/testOpenAndClose.mp4" 12.667 "$OUT/large-type-detail.png"
rm -rf "$W"
