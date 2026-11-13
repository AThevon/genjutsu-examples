# Lists the stretches of a frame folder where the picture changes: python3 segments.py <frames dir> <fps>
# A frame counts as changed when more than 20 pixels of its 302x656 greyscale reduction differ by more than 8/255
# from the frame before; changes less than 0.25 s apart are one stretch.
import sys, os
import numpy as np
from PIL import Image
d, fps = sys.argv[1], float(sys.argv[2])
fs = sorted(f for f in os.listdir(d) if f.endswith('.png'))
prev, changed = None, []
for i, f in enumerate(fs):
    a = np.asarray(Image.open(os.path.join(d, f)).convert('L').resize((302, 656)), dtype=np.int16)
    if prev is not None and int((abs(a - prev) > 8).sum()) > 20:
        changed.append(i)
    prev = a
seg = []
for i in changed:
    if seg and i - seg[-1][1] <= 0.25 * fps:
        seg[-1][1] = i
    else:
        seg.append([i, i])
for a, b in seg:
    print(f'frames {a}-{b}  {a / fps:.3f}-{b / fps:.3f} s  ({(b - a + 1) / fps:.3f} s)')
