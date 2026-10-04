#!/usr/bin/env python3
# Re-encodes media/clip.webp from the frames kept by
# `node bin/record.mjs --take takes/clip.json --keep-frames` (24 fps, 1440x900).
# Frames are picked at <fps> on the clip's own clock, runs of byte-identical frames are merged
# into one frame shown for their total time (the 2 s hold and the end hold), and the result is
# resized to <width> wide (default 1200, 16:10) and encoded lossy at <quality>. Nothing else is
# done to the frames.
# Usage: python3 encode-clip.py <frames dir> <fps> <quality> <out.webp> [width]
import hashlib, os, subprocess, sys

frames_dir, rate, quality, out = sys.argv[1], float(sys.argv[2]), sys.argv[3], sys.argv[4]
width = int(sys.argv[5]) if len(sys.argv) > 5 else 1200
height = round(width * 900 / 1440)
FPS_IN = 24
frames = sorted(f for f in os.listdir(frames_dir) if f.endswith('.png'))

picked = []
k = 0
while True:
    i = round(k * FPS_IN / rate)
    if i >= len(frames):
        break
    picked.append(frames[i])
    k += 1

seq = []
for idx, f in enumerate(picked):
    h = hashlib.md5(open(os.path.join(frames_dir, f), 'rb').read()).hexdigest()
    d = round((idx + 1) * 1000 / rate) - round(idx * 1000 / rate)
    if seq and seq[-1][2] == h:
        seq[-1][1] += d
    else:
        seq.append([f, d, h])

args = ['magick', '-loop', '0']
for f, d, _ in seq:
    args += ['-delay', f'{d}x1000', os.path.join(frames_dir, f)]
args += ['-resize', f'{width}x{height}!', '-quality', quality, '-define', 'webp:method=6',
         '-define', 'webp:lossless=false', out]
subprocess.run(args, check=True)
print(f'{len(seq)} frames, {sum(d for _, d, _ in seq)} ms, {os.path.getsize(out)} bytes')
