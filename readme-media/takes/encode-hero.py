#!/usr/bin/env python3
# Encodes the frames of takes/hero-site.json (record.mjs --keep-frames, 24 fps) as one looping WebP.
#
# Used for readme-media/hero-site.webp, filmed on 2026-11-06 (1280x720 at dpr 1.5, 1200x675, quality 70, 15.45 s, 711,558 bytes).
# The command is in this repository's README, under "Rebuild and re-record".
#
# Usage: python3 encode-hero.py <framesDir> <out.webp> <quality> <width> <section> [<section> ...]
#   A section is a comma-separated list of stretches, encoded on its own, so it opens on a full image:
#     <start>:<end>:<fps>   source frames start to end (0-based, end excluded), picked at that rate
#     <frame>=<ms>          one source frame, held
#
# Why sections: libwebp's inter-frame mode is what makes a moving lens on still paper cheap (at quality
# 60, 183 KB for 5 s, against 2 MB with every frame a keyframe), but it leaves faint blocks of earlier frames
# on screen. Each cut and each long hold therefore starts a section: nothing is carried across it,
# and the images the eye rests on are clean. Pillow cannot place a keyframe on a chosen frame, so
# each section is its own file and their ANMF chunks are joined under one RIFF header.
import os
import struct
import sys
import tempfile

import numpy as np
from PIL import Image

src, out, quality, width = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
sections = sys.argv[5:]
files = sorted(os.path.join(src, f) for f in os.listdir(src) if f.endswith('.png'))


def load(index):
    im = Image.open(files[index]).convert('RGB')
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)


def encode(section, path):
    kept = []  # [image, array, ms]; frames differing by fewer than 40 pixels (3% fuzz) are merged

    def add(index, ms):
        im = load(index)
        arr = np.asarray(im, dtype=np.int16)
        if kept and int((np.abs(arr - kept[-1][1]).max(axis=2) > 8).sum()) < 40:
            kept[-1][2] += ms
        else:
            kept.append([im, arr, ms])

    for stretch in section.split(','):
        if '=' in stretch:
            frame, ms = map(int, stretch.split('='))
            add(frame, ms)
            continue
        start, end, fps = map(int, stretch.split(':'))
        end = min(end, len(files))
        for k in range(max(1, round((end - start) * fps / 24))):
            add(min(end - 1, start + round(k * 24 / fps)), round((k + 1) * 1000 / fps) - round(k * 1000 / fps))
    kept[0][0].save(path, 'WEBP', save_all=True, append_images=[k[0] for k in kept[1:]],
                    duration=[k[2] for k in kept], loop=0, quality=quality, method=6, lossless=False,
                    kmin=29, kmax=30, allow_mixed=False, minimize_size=True)
    return len(kept), sum(k[2] for k in kept)


def chunks(path):
    data = open(path, 'rb').read()
    at = 12
    while at < len(data):
        size = struct.unpack('<I', data[at + 4:at + 8])[0]
        yield data[at:at + 4], data[at:at + 8 + size + (size & 1)]
        at += 8 + size + (size & 1)


frames, total, header, body = 0, 0, b'', b''
with tempfile.TemporaryDirectory() as tmp:
    for n, section in enumerate(sections):
        part = os.path.join(tmp, f'{n}.webp')
        count, ms = encode(section, part)
        frames += count
        total += ms
        found = dict()
        for fourcc, chunk in chunks(part):
            found.setdefault(fourcc, b'')
            found[fourcc] += chunk
        if b'ANMF' in found:
            body += found[b'ANMF']
            if n == 0:
                header = found[b'VP8X'] + found[b'ANIM']
        else:
            # Pillow writes a single frame as a still image: wrap its bitstream as one animation frame
            w, h = Image.open(part).size
            image = found.get(b'ALPH', b'') + found.get(b'VP8 ', b'') + found.get(b'VP8L', b'')
            u24 = lambda v: struct.pack('<I', v)[:3]
            frame = u24(0) + u24(0) + u24(w - 1) + u24(h - 1) + u24(ms) + b'\x00' + image
            body += b'ANMF' + struct.pack('<I', len(frame)) + frame + (b'\x00' if len(frame) & 1 else b'')
        print(f'section {n}: {count} frames, {ms} ms, {os.path.getsize(part) / 1024:.0f} KB')
if not header:
    sys.exit('the first section must hold more than one frame')
payload = b'WEBP' + header + body
with open(out, 'wb') as f:
    f.write(b'RIFF' + struct.pack('<I', len(payload)) + payload)
print(f'q{quality} {width}px {frames} frames {total / 1000:.2f} s -> {os.path.getsize(out)} bytes ({os.path.getsize(out) / 1024:.0f} KB)')
