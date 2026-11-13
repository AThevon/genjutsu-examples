#!/usr/bin/env bash
# Copies the two files the genjutsu README gallery shows for etale-ios into readme-media/etale-ios/:
#   etale-ios/takes/make-readme-media.sh
# Both are run 2's, byte for byte as make-media-run-2.sh wrote them: nothing is cut or encoded again.
#   clip.webp      402x874, 12.3 s, 24 fps, 709158 bytes (the gallery refuses a file over 720000)
#   open-mid.png   603x1311, the cover: about 100 ms into the zoom
# The clip is a phone screen 402 px wide, so the manifest gives it "width": 402 and the gallery shows
# it at that width instead of stretching it to 720.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$HERE/../../readme-media/etale-ios"
mkdir -p "$OUT"
cp "$HERE/../media/run-2/clip.webp" "$OUT/clip.webp"
cp "$HERE/../media/run-2/open-mid.png" "$OUT/open-mid.png"
