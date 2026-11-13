# Encodes a folder of PNG frames (takes/frames.swift) as one looping WebP, the way bin/record.mjs encodes its clips:
# ImageMagick's magick, lossy, webp:method=4, each frame given its share of the rounded running total in whole
# milliseconds so the clip lasts as long as the frames do.
# Usage: python3 encode-clip.py <framesDir> <out.webp> <sourceFps> <fps> <quality> <width>
import os, subprocess, sys
from PIL import Image

src, out, src_fps, fps, q, width = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), sys.argv[5], int(sys.argv[6])
files = sorted(os.path.join(src, f) for f in os.listdir(src) if f.endswith('.png'))
n = max(1, round(len(files) * fps / src_fps))
picked = [files[min(len(files) - 1, round(k * src_fps / fps))] for k in range(n)]
w0, h0 = Image.open(files[0]).size
height = round(h0 * width / w0 / 2) * 2
args = ['magick', '-loop', '0']
for k, f in enumerate(picked):
    args += ['-delay', f'{round((k + 1) * 1000 / fps) - round(k * 1000 / fps)}x1000', f]
args += ['-resize', f'{width}x{height}!', '-quality', q, '-define', 'webp:method=4', '-define', 'webp:lossless=false', out]
subprocess.run(args, check=True, stderr=subprocess.DEVNULL)
print(f'{os.path.basename(out)}: {fps:g}fps q{q} {width}x{height} {n} frames {n / fps:g}s -> {os.path.getsize(out) / 1024:.0f} KB')
