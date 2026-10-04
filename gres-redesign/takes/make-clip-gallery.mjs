// Writes clip-gallery.json: the gallery take, a scroll from the middle of bisque (y 2300) to the
// footer (y 5214, the bottom of the page), slower where the grounds fade into each other.
// One scroll step per frame, so the position of every frame comes from the speed profile below.
// Measured layout at 1440x900 (takes/probe-layout.json): seam bisque->kiln 3059-3419, glaze
// spy-hole rises from y 2519 to 3239, seam kiln->celadon enters the screen at y 4589 (the slow zone starts once it fills the lower third) and reaches
// mid-screen at the bottom of the page (5214).
import { writeFileSync } from 'node:fs'
const fps = 12, from = 2300, to = 5214
const vFast = 850, vSlow = 280 // px/s
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
// 1 inside a slow zone, 0 outside, smooth ramps of `r` px on each side
const zone = (y, a, b, r) => smooth(a - r, a, y) * (1 - smooth(b, b + r, y))
const slow = y => Math.max(zone(y, 2480, 3200, 220), zone(y, 4820, 5300, 220))
const v = y => {
  let s = vFast - (vFast - vSlow) * slow(y)
  s *= 0.3 + 0.7 * smooth(from, from + 120, y)          // start from rest
  s *= Math.max(0.35, Math.min(1, (to - y) / 120))         // come to rest at the footer
  return s
}
// integrate t(y), then sample y at every frame
const pts = [[0, from]]
for (let y = from, t = 0; y < to; ) { const dy = 0.5; t += dy / v(y + dy / 2); y += dy; pts.push([t, Math.min(y, to)]) }
const T = pts.at(-1)[0], frames = Math.ceil(T * fps)
const ys = []
for (let k = 1, j = 0; k <= frames; k++) {
  const t = Math.min(T, k / fps)
  while (j < pts.length - 1 && pts[j + 1][0] < t) j++
  const [t0, y0] = pts[j], [t1, y1] = pts[Math.min(j + 1, pts.length - 1)]
  ys.push(+(y0 + (y1 - y0) * ((t - t0) / ((t1 - t0) || 1))).toFixed(1))
}
const take = {
  root: '../build/dist', w: 1440, h: 900, settle: 800, fps, width: 1200,
  probe: "({y:Math.round(scrollY),rev:[...document.querySelectorAll('.reveal')].filter(e=>{const b=e.getBoundingClientRect();return b.bottom>0&&b.top<innerHeight}).map(e=>(+getComputedStyle(e).opacity).toFixed(2)).join(',')})",
  steps: [
    { wait: 300 },
    { scroll: { to: from, duration: 1000 / fps } },
    { wait: 3000 }, // reveals of the jumped-over blocks finish here; trimmed at encode
    ...ys.map(y => ({ scroll: { to: y, duration: 1000 / fps } })),
    { wait: 700 },
  ],
}
writeFileSync(new URL('./clip-gallery.json', import.meta.url), JSON.stringify(take, null, 1))
console.log({ seconds: +T.toFixed(2), frames })
