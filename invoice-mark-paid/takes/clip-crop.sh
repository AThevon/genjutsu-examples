#!/bin/sh
# The clip is recorded at 1440x900 (takes/clip.json, --keep-frames), then every frame is cropped
# to the summary cards and the two clicked rows and re-encoded with the same quality ladder as
# record.mjs (q82 first, 24 fps). Nothing is drawn or retouched: only the crop.
# usage: sh clip-crop.sh <out dir of record.mjs --keep-frames> <media dir>
set -e
mkdir -p "$1/crop"
for f in "$1"/frames/*.png; do magick "$f" -crop 1100x460+170+134 +repage "$1/crop/$(basename "$f")"; done
args="-loop 0"; k=0
for f in "$1"/crop/*.png; do d=$(( ( (k+1)*1000 + 12 ) / 24 - ( k*1000 + 12 ) / 24 )); args="$args -delay ${d}x1000 $f"; k=$((k+1)); done
magick $args -quality 82 -define webp:method=4 -define webp:lossless=false "$2/clip.webp"
