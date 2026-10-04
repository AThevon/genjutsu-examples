#!/bin/bash
# Encodes the frames kept by `record.mjs --take takes/clip.json --keep-frames` (24 fps:
# 1-72 the 3 s hold, 73-192 the 5 s scroll, 193-204 the end hold) as clip.webp at 1200x750.
# The hold frames are identical, so the hold is stored as one frame shown for 3000 ms;
# the scroll keeps every 3rd frame (8 fps). Usage: encode-clip.sh <frames dir> <out.webp> [quality]
set -euo pipefail
F=$1; OUT=$2; Q=${3:-30}
args=(-loop 0 -delay 3000x1000 "$F/0072.png")
k=0
for i in $(seq 75 3 192); do
  args+=(-delay "$(( ((k+1)*1000/8) - (k*1000/8) ))x1000" "$(printf '%s/%04d.png' "$F" "$i")"); k=$((k+1))
done
args+=(-delay 500x1000 "$F/0204.png")
magick "${args[@]}" -resize 1200x750! -quality "$Q" -define webp:method=6 -define webp:lossless=false "$OUT"
echo "$((k+2)) frames, $(stat -f %z "$OUT") bytes"
