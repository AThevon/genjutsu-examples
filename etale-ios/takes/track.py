# Tracks the blue tide curve (the tint colour) in each frame: python3 track.py <frames dir> <fps>
# Prints, per frame, the bounding box of the pixels close to the system blue, then counts direction reversals.
import sys, os
import numpy as np
from PIL import Image
d, fps = sys.argv[1], float(sys.argv[2])
fs = sorted(f for f in os.listdir(d) if f.endswith('.png'))
rows = []
for i, f in enumerate(fs):
    a = np.asarray(Image.open(os.path.join(d, f)).convert('RGB'), dtype=np.int16)
    m = (a[:, :, 2] > 200) & (a[:, :, 0] < 90) & (a[:, :, 1] > 90) & (a[:, :, 1] < 170)
    ys, xs = np.nonzero(m)
    if len(xs) < 50:
        rows.append((i, None))
        continue
    rows.append((i, (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max()))))
prev = None
for i, b in rows:
    print(f'{i:4d} {i / fps:6.3f}', b)
for axis, name in ((0, 'left x'), (1, 'top y')):
    vals = [b[axis] for _, b in rows if b]
    dirs = [np.sign(vals[k + 1] - vals[k]) for k in range(len(vals) - 1) if abs(vals[k + 1] - vals[k]) > 2]
    rev = sum(1 for k in range(len(dirs) - 1) if dirs[k] != dirs[k + 1])
    print(f'{name}: {len(vals)} samples, {len(dirs)} moves over 2 px, {rev} reversals, range {min(vals)}-{max(vals)}')
