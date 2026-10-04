# Re-encodes the frames of takes/home-clip.json (record.mjs --keep-frames, 1440x900 at 24 fps) as one looping WebP.
# Usage: python3 encode-clip.py <framesDir> <out.webp> <sourceFps> <fps> <quality> [width]
# Steps: pick every (sourceFps/fps)th frame, resize to <width> (Lanczos), merge consecutive frames that differ by fewer
# than 200 pixels (3% fuzz, max channel difference) into one longer frame, then encode with libwebp through Pillow with
# every frame a keyframe (kmin 0, kmax 1): each stored frame is a full lossy image, no sub-rectangles blended over the
# previous one, so no residue of an earlier frame can stay on screen. Used for media/clip.webp: 24 -> 8 fps, quality 15, 1200 px (the site's grain makes every frame heavy).
import sys, os
import numpy as np
from PIL import Image

src, out, src_fps, fps, q = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), int(sys.argv[5])
width = int(sys.argv[6]) if len(sys.argv) > 6 else 1200
files = sorted(os.path.join(src, f) for f in os.listdir(src) if f.endswith('.png'))
n = round(len(files) * fps / src_fps)
picked = [files[min(len(files) - 1, round(k * src_fps / fps))] for k in range(n)]

def load(f):
    im = Image.open(f).convert('RGB')
    h = round(im.height * width / im.width)
    return im.resize((width, h), Image.LANCZOS)

kept = []  # [image, array, frames]
for f in picked:
    im = load(f)
    a = np.asarray(im, dtype=np.int16)
    if kept and int((np.abs(a - kept[-1][1]).max(axis=2) > 0.03 * 255).sum()) < 200:
        kept[-1][2] += 1
    else:
        kept.append([im, a, 1])

durations, t = [], 0
for k in kept:
    durations.append(round((t + k[2]) * 1000 / fps) - round(t * 1000 / fps))
    t += k[2]

kept[0][0].save(out, 'WEBP', save_all=True, append_images=[k[0] for k in kept[1:]], duration=durations, loop=0,
                quality=q, method=6, lossless=False, kmin=0, kmax=1, allow_mixed=False, minimize_size=False)
print(f'{fps:g}fps q{q} {width}px picked {len(picked)} kept {len(kept)} -> {os.path.getsize(out)} bytes '
      f'({os.path.getsize(out) / 1024:.0f} KB), {t / fps:g}s')
