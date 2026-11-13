#!/usr/bin/env bash
# Cuts and encodes media/ and before/ from the simulator recordings: make-media.sh <after takes dir> <before takes dir>
# The recordings (takes/driver/take.sh) are not committed: each is 14 to 20 MB of H.264. The cut times below are
# those of the takes filmed on 2026-11-13; a new recording starts at another instant, so find its cuts again with
#   swift frames.swift <take.mp4> /tmp/f 30 && python3 segments.py /tmp/f 30
# Needs: Xcode (swiftc, AVFoundation), ImageMagick's magick, Python 3 with Pillow (segments.py also needs numpy). No ffmpeg.
set -euo pipefail
AFTER="$1"; BEFORE="$2"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$HERE/.."
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

# The run's build. testOpenAndClose: open 10:31 at 10.93 s, close at 13.53 s, open 16:17 at 15.97 s, close at 18.67 s.
clip  "$AFTER/testOpenAndClose.mp4" 10.3 20.3 30 24 66 402 "$OUT/media/clip.webp"
still "$AFTER/testOpenAndClose.mp4" 10.5   "$OUT/media/today.png"
still "$AFTER/testOpenAndClose.mp4" 11.000 "$OUT/media/open-early.png"
still "$AFTER/testOpenAndClose.mp4" 11.100 "$OUT/media/open-mid.png"
still "$AFTER/testOpenAndClose.mp4" 13.0   "$OUT/media/detail.png"
still "$AFTER/testOpenAndClose.mp4" 13.850 "$OUT/media/close-mid.png"
# testAlert: open at 11.73 s, the switch at 14.23 s, close at 16.83 s.
clip  "$AFTER/testAlert.mp4" 13.6 18.6 30 24 66 402 "$OUT/media/alert.webp"
still "$AFTER/testAlert.mp4" 18.4 "$OUT/media/alert-row.png"
# testDragClose: the header is dragged down from 19.33 s. 60 fps, because the defect alternates every frame.
clip  "$AFTER/testDragClose.mp4" 19.25 20.75 60 60 62 320 "$OUT/media/defect-drag.webp"
still "$AFTER/testDragClose.mp4" 19.600 "$OUT/media/defect-drag-a.png"
still "$AFTER/testDragClose.mp4" 19.617 "$OUT/media/defect-drag-b.png"
# Reduce Motion on (xcrun simctl spawn <udid> defaults write com.apple.Accessibility ReduceMotionEnabled -bool YES,
# then the app relaunched by the driver). testOpenAndClose: open at 12.87 s, close at 15.5 s.
clip  "$AFTER/reduced/testOpenAndClose.mp4" 12.3 16.5 30 24 66 402 "$OUT/media/reduced.webp"
still "$AFTER/reduced/testOpenAndClose.mp4" 12.967 "$OUT/media/reduced-mid.png"
# Dark appearance (xcrun simctl ui <udid> appearance dark). testOpenOnly: open at 10.6 s.
still "$AFTER/dark/testOpenOnly.mp4" 10.767 "$OUT/media/dark-mid.png"
still "$AFTER/dark/testOpenOnly.mp4" 13.0   "$OUT/media/dark-detail.png"
# Dynamic Type at accessibility-large (xcrun simctl ui <udid> content_size accessibility-large). Open at 13.37 s.
still "$AFTER/xxxl/testOpenAndClose.mp4" 13.2   "$OUT/media/large-type-today.png"
still "$AFTER/xxxl/testOpenAndClose.mp4" 13.6   "$OUT/media/large-type-mid.png"
still "$AFTER/xxxl/testOpenAndClose.mp4" 15.0   "$OUT/media/large-type-detail.png"

# The starting app (cases/etale-ios/app), same driver test: push at 14.7 s, back at 18.37 s, push at 21.73 s, back at 25.23 s.
clip  "$BEFORE/testOpenAndClose.mp4" 14.1 26.5 30 24 66 402 "$OUT/before/push.webp"
still "$BEFORE/testOpenAndClose.mp4" 14.3 "$OUT/before/today.png"
still "$BEFORE/testOpenAndClose.mp4" 14.9 "$OUT/before/push-mid.png"
still "$BEFORE/testOpenAndClose.mp4" 17.0 "$OUT/before/detail.png"
rm -rf "$W"
