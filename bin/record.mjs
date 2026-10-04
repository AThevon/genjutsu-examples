#!/usr/bin/env node
// Records a static build in headless Chrome as a looping animated WebP, with no server and no
// dependency (Node 22 or later, a Chrome binary, and ImageMagick's `magick` with WebP support).
//
// Every request to a fake origin (default http://site.test) is answered from the build folder on
// disk through the DevTools protocol (Fetch interception), the approach of shoot.mjs. No dev or
// preview server runs. Requests to any other origin go to the network as usual.
//
// Time is virtual and deterministic: the page lives exactly 1000/fps ms per frame, however long
// a capture takes, so the clip is smooth.
//   - The animation timeline is frozen through CDP (Animation.setPlaybackRate 0), and every CSS
//     animation, CSS transition and Web Animation on it is set, each frame, to the time it would
//     have reached. They still finish and fire their events. Scroll-driven animations follow the
//     scroll, which the recorder moves per frame.
//   - A clock installed before any page script (Page.addScriptToEvaluateOnNewDocument) serves
//     performance.now, Date, setTimeout, setInterval and requestAnimationFrame from virtual time:
//     each frame runs the timers that fall due in order, then one round of rAF callbacks with the
//     frame's timestamp (JS animation libraries, canvas loops, smooth scrollers).
//   - SVG SMIL animations and playing videos are seeked to the frame's time.
// Why not Emulation.setVirtualTimePolicy: in Chrome on macOS it governs timers and
// performance.now only; rAF timestamps and the animation timeline keep the wall clock, so
// animations jump between captures, and a page paused in virtual time stops answering input and
// screenshots once it sits idle. HeadlessExperimental.beginFrame, the other deterministic route,
// is not supported on macOS. If the virtual clock cannot run (it is missing, or a frame never
// settles), the recorder warns and finishes the clip in real time, which can stutter.
//
// Usage:
//   node record.mjs --take <take.json> --out <dir> [--max-kb 600] [--width <px>]
//                   [--origin http://site.test] [--chrome <path>] [--keep-frames]
//
// take.json:
//   root      the static build folder, relative to the take file (required)
//   path      the route to open (default "/")
//   w, h      the viewport in CSS pixels (required)
//   dpr       device pixel ratio of the capture (default 1)
//   theme     'dark' | 'light': emulated prefers-color-scheme (default: the browser's)
//   reduced   true: emulate prefers-reduced-motion: reduce
//   fps       frames per second (default 24)
//   width     scale the clip to this many pixels wide (default: the capture width, w * dpr);
//             --width on the command line wins
//   cursor    true (or 'arrow'): draw a pointer over the page where the recorder moves the mouse
//             (an annotation the build does not contain; off by default); 'crosshair' draws a
//             crosshair instead, for a page whose own cursor is one
//   settle    real milliseconds the page runs after load and fonts, before time is frozen
//             (default 300)
//   fromLoad  true: freeze time before navigating, so entrance animations are recorded from
//             their first frame (the load itself, fonts and images, still happen in real time)
//   probe     a JavaScript expression evaluated after every frame; the values go to probe.json
//   steps     the script of the clip, run in order:
//             (an ease is 'linear', 'in', 'out' or 'inOut', cubic, or the gentler 'outQuad' and
//             'outSine', which start fast and slow down less sharply than 'out')
//     { wait: ms }                                   hold for that long
//     { scroll: { to: y | selector, duration: ms, ease?: 'linear'|'inOut'|'in'|'out',
//                 offset?: px, via?: 'script'|'wheel' } }
//                                                    scroll the window there over the duration
//                                                    (a selector: its top, minus offset); via
//                                                    'wheel' sends wheel events instead of
//                                                    scrollTo, for smooth-scroll libraries
//     { pointer: { path: [[x,y], ...], duration: ms, ease? } }
//                                                    move the mouse along the polyline
//     { drag: { path: [[x,y], ...], duration: ms, ease? } }
//                                                    press the left button at the first point
//                                                    (the mouse jumps there), move along the
//                                                    polyline with the button held, release at
//                                                    the last point
//     { hover: selector, nth?: n, duration?: ms }    glide the mouse onto the element's center
//                                                    (default 400 ms, eased)
//     { click: selector, nth?: n, hold?: ms }        press, hold (default 90 ms), release on the
//                                                    element's center; the mouse jumps there if
//                                                    it is elsewhere (hover first to show it)
//     { eval: 'js expression' }                      run an expression in the page (no frame)
//     { still: 'name' }                              save the current frame as <out>/<name>.png
//
// Writes <out>/frames/NNNN.png (removed after an encode under budget unless --keep-frames),
// <out>/<name>.png for every still, and <out>/clip.webp, a looping animated WebP encoded under
// --max-kb: the quality is lowered first, then the frame rate, then the size; the final settings
// are printed on stderr. Prints a JSON summary on stdout: frames, duration, time mode, clip size
// and settings, stills, console errors, uncaught exceptions, failed requests, warnings.
// Exit code 1 when the take fails or the clip stays over budget.

import { execFileSync, spawn } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain', '.xml': 'application/xml',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json', '.wasm': 'application/wasm', '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
}
const SIGNALS = ['SIGINT', 'SIGTERM', 'SIGHUP']
const sleep = ms => new Promise(r => setTimeout(r, ms))
const EASE = {
  linear: t => t,
  in: t => t * t * t,
  out: t => 1 - (1 - t) ** 3,
  inOut: t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  outQuad: t => 1 - (1 - t) ** 2,
  outSine: t => Math.sin((t * Math.PI) / 2),
}

function option(argv, name) {
  const i = argv.indexOf(name)
  return i >= 0 ? argv[i + 1] : undefined
}

function findChrome(explicit) {
  const candidates = [
    explicit,
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
  ].filter(Boolean)
  for (const c of candidates) if (existsSync(c)) return c
  for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome']) {
    try {
      const p = execFileSync('which', [name], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
      if (p) return p
    } catch {}
  }
  return null
}

// The file of the build that answers a URL path: the file itself, then <path>/index.html, then
// <path>.html. Nothing outside the root is served.
function resolveFile(root, pathname) {
  let p
  try { p = decodeURIComponent(pathname) } catch { return null }
  const tries = p.endsWith('/') ? [`${p}index.html`] : extname(p) ? [p] : [`${p}/index.html`, `${p}.html`]
  for (const t of tries) {
    const f = join(root, t)
    const rel = relative(root, f)
    if (rel.startsWith('..') || isAbsolute(rel)) continue
    if (existsSync(f) && statSync(f).isFile()) return f
  }
  return null
}

function write(file, data) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, data)
}

function frameCount(ms, fps) {
  return Math.max(1, Math.round((Number(ms) || 0) * fps / 1000))
}

// A point along a polyline, at fraction t of its length.
function along(path, t) {
  if (path.length === 1) return path[0]
  const seg = []
  let total = 0
  for (let i = 1; i < path.length; i++) {
    const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1])
    seg.push(d)
    total += d
  }
  if (total === 0) return path[0]
  let target = t * total
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i] || i === seg.length - 1) {
      const k = seg[i] ? Math.min(1, target / seg[i]) : 1
      return [path[i][0] + (path[i + 1][0] - path[i][0]) * k, path[i][1] + (path[i + 1][1] - path[i][1]) * k]
    }
    target -= seg[i]
  }
  return path[path.length - 1]
}

// The virtual clock, installed in every document before its own scripts. It runs on the real
// clock until freeze(); from then on time moves only through advance(ms).
const CLOCK_JS = `(() => {
  if (window.__rec) return;
  const W = window, P = W.performance;
  const realNow = P.now.bind(P), RealDate = W.Date, realDateNow = RealDate.now;
  const rST = W.setTimeout.bind(W), rCT = W.clearTimeout.bind(W);
  const rRAF = W.requestAnimationFrame.bind(W), rCAF = W.cancelAnimationFrame.bind(W);
  const epoch = realDateNow() - realNow();
  const st = { frozen: false, now: 0 };
  const now = () => (st.frozen ? st.now : realNow());
  const report = e => rST(() => { throw e; }, 0);

  P.now = function now_() { return now(); };
  const dateNow = () => Math.floor(epoch + now());
  function Date_(...a) {
    if (!new.target) return new RealDate(dateNow()).toString();
    return a.length ? new RealDate(...a) : new RealDate(dateNow());
  }
  Date_.prototype = RealDate.prototype;
  Date_.now = dateNow;
  Date_.parse = RealDate.parse;
  Date_.UTC = RealDate.UTC;
  W.Date = Date_;

  // Timers: always tracked, so the ones set before the freeze move to virtual time with it.
  let seq = 1e6;
  const timers = new Map();
  const fire = t => {
    t.real = null;
    if (t.every == null) timers.delete(t.id);
    else arm(t, t.due + Math.max(1, t.every));
    try { t.fn.apply(W, t.args); } catch (e) { report(e); }
  };
  const arm = (t, due) => {
    t.due = due;
    if (!st.frozen) t.real = rST(() => fire(t), Math.max(0, due - realNow()));
    else if (due <= st.now) t.real = rST(() => fire(t), 0);
    else t.real = null;
  };
  const add = (fn, ms, args, every) => {
    if (typeof fn !== 'function') { const code = String(fn); fn = () => (0, eval)(code); }
    const d = Math.max(0, Number(ms) || 0);
    const t = { id: ++seq, fn, args, every: every ? d : null, real: null };
    timers.set(t.id, t);
    arm(t, now() + d);
    return t.id;
  };
  const clear = id => {
    const t = timers.get(id);
    if (t) { if (t.real != null) rCT(t.real); timers.delete(id); } else rCT(id);
  };
  W.setTimeout = function setTimeout(fn, ms, ...args) { return add(fn, ms, args, false); };
  W.setInterval = function setInterval(fn, ms, ...args) { return add(fn, ms, args, true); };
  W.clearTimeout = function clearTimeout(id) { clear(id); };
  W.clearInterval = function clearInterval(id) { clear(id); };

  // requestAnimationFrame: one round of callbacks per virtual frame, with its timestamp.
  let rafs = new Map();
  W.requestAnimationFrame = function requestAnimationFrame(cb) {
    const id = ++seq;
    const r = { cb, real: null };
    if (!st.frozen) r.real = rRAF(ts => { rafs.delete(id); cb(ts); });
    rafs.set(id, r);
    return id;
  };
  W.cancelAnimationFrame = function cancelAnimationFrame(id) {
    const r = rafs.get(id);
    if (r) { if (r.real != null) rCAF(r.real); rafs.delete(id); } else rCAF(id);
  };

  // The document timeline is frozen by the recorder while virtual time moves on. Its clock and
  // the start times on it are translated, so a library that starts an animation at
  // performance.now() (motion does) or reads document.timeline.currentTime stays in step.
  const isDoc = a => a.timeline === document.timeline;
  const tlDesc = Object.getOwnPropertyDescriptor(AnimationTimeline.prototype, 'currentTime');
  const frozenTimeline = () => Number(tlDesc.get.call(document.timeline));
  Object.defineProperty(AnimationTimeline.prototype, 'currentTime', {
    configurable: true, enumerable: tlDesc.enumerable,
    get() { return st.frozen && this === document.timeline ? st.now : tlDesc.get.call(this); },
  });
  const startDesc = Object.getOwnPropertyDescriptor(Animation.prototype, 'startTime');
  Object.defineProperty(Animation.prototype, 'startTime', {
    configurable: true, enumerable: startDesc.enumerable,
    get() {
      const s = startDesc.get.call(this);
      if (!st.frozen || s == null || !isDoc(this)) return s;
      return Number(s) + (st.now - frozenTimeline());
    },
    set(s) {
      if (!st.frozen || s == null || !isDoc(this)) return startDesc.set.call(this, s);
      startDesc.set.call(this, Number(s) - (st.now - frozenTimeline()));
    },
  });

  // Animations on the document timeline are set, each frame, to their virtual time.
  const bases = new WeakMap();
  const svgBases = new WeakMap();
  const videoBases = new Map();
  const pin = () => {
    let n = 0;
    for (const a of document.getAnimations()) {
      if (!isDoc(a)) continue;
      if (a.playState !== 'running') { bases.delete(a); continue; }
      const ct = a.currentTime == null ? 0 : Number(a.currentTime);
      let b = bases.get(a);
      // Re-based when first seen, or when the page itself moved the animation.
      if (!b || Math.abs(ct - b.set) > 0.5) { b = { vt: st.now, ct, set: ct }; bases.set(a, b); }
      const v = b.ct + (st.now - b.vt) * a.playbackRate;
      if (v !== ct) { a.currentTime = v; n++; }
      b.set = a.currentTime == null ? v : Number(a.currentTime);
    }
    for (const svg of document.querySelectorAll('svg')) {
      if (svg.ownerSVGElement || !svg.querySelector('animate, animateTransform, animateMotion, set')) continue;
      let b = svgBases.get(svg);
      if (!b) { b = { vt: st.now, ct: svg.getCurrentTime() }; svgBases.set(svg, b); svg.pauseAnimations(); }
      svg.setCurrentTime(b.ct + (st.now - b.vt) / 1000);
    }
    return n;
  };
  const seekVideos = async () => {
    for (const v of document.querySelectorAll('video')) {
      if (!videoBases.has(v)) {
        if (v.paused) continue;
        videoBases.set(v, { vt: st.now, ct: v.currentTime });
        v.pause();
      }
      const b = videoBases.get(v);
      let t = b.ct + (st.now - b.vt) / 1000;
      if (v.duration) t = v.loop ? t % v.duration : Math.min(t, v.duration);
      if (Math.abs(v.currentTime - t) < 1e-3) continue;
      await new Promise(r => { const done = () => { v.removeEventListener('seeked', done); r(); }; v.addEventListener('seeked', done); v.currentTime = t; rST(done, 1000); });
    }
  };
  const realFrame = () => new Promise(r => rRAF(() => r()));
  const task = () => new Promise(r => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });
  const settle = async () => { for (let i = 0; i < 3; i++) { await task(); await new Promise(r => rST(r, 0)); } };

  W.__rec = {
    freeze() {
      if (st.frozen) return st.now;
      st.now = realNow();
      st.frozen = true;
      for (const t of timers.values()) { if (t.real != null) { rCT(t.real); t.real = null; } arm(t, t.due); }
      for (const r of rafs.values()) if (r.real != null) { rCAF(r.real); r.real = null; }
      pin();
      return st.now;
    },
    thaw() {
      if (!st.frozen) return;
      st.frozen = false;
      for (const t of timers.values()) { if (t.real != null) rCT(t.real); arm(t, t.due); }
      const pending = rafs; rafs = new Map();
      for (const [, r] of pending) W.requestAnimationFrame(r.cb);
    },
    get frozen() { return st.frozen; },
    get now() { return now(); },
    // One frame: let the page react to the last input or scroll (events, observers), run the
    // timers that fall due in order, one round of rAF, let the page commit, then pin animations.
    async advance(ms) {
      await realFrame();
      await settle();
      const target = st.now + ms;
      let timersRun = 0;
      for (;;) {
        let next = null;
        for (const t of timers.values()) if (t.real == null && t.due <= target && (!next || t.due < next.due || (t.due === next.due && t.id < next.id))) next = t;
        if (!next) break;
        st.now = Math.max(st.now, next.due);
        fire(next);
        timersRun++;
        if (timersRun > 10000) throw new Error('more than 10000 timers in one frame');
      }
      st.now = target;
      const round = rafs; rafs = new Map();
      for (const [, r] of round) { try { r.cb(st.now); } catch (e) { report(e); } }
      await settle();
      const pinned = pin();
      await seekVideos();
      await realFrame();
      return { now: st.now, timers: timersRun, rafs: round.size, pinned };
    },
  };
  if (W.__recStartFrozen && W === W.top) W.__rec.freeze();
})()`

// A visible pointer drawn over the page, for clips that show a mouse at work.
// the drawn pointer: [svg, hotspot x, hotspot y] in a 22px box
const CURSORS = {
  arrow: ['<path d="M3 2 L3 17 L7.2 13.2 L10 19.5 L12.6 18.4 L9.9 12.2 L15.6 12.2 Z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/>', 3, 2],
  crosshair: ['<path d="M11 1.5V20.5M1.5 11H20.5" stroke="#fff" stroke-width="3.2" stroke-linecap="square"/><path d="M11 2.5V19.5M2.5 11H19.5" stroke="#111" stroke-width="1.2"/>', 11, 11],
}
const cursorJs = (kind) => {
  const [svg, hx, hy] = CURSORS[kind] || CURSORS.arrow
  return `(() => {
  if (window.__recCursor) return;
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = 'position:fixed;left:0;top:0;width:22px;height:22px;z-index:2147483647;pointer-events:none;transform-origin:${hx}px ${hy}px;display:none';
  el.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22">${svg}</svg>';
  document.documentElement.appendChild(el);
  window.__recCursor = (x, y, down) => {
    el.style.display = 'block';
    el.style.transform = 'translate(' + (x - ${hx}) + 'px,' + (y - ${hy}) + 'px) scale(' + (down ? 0.86 : 1) + ')';
  };
})()`
}

export async function record({ take, takeDir = process.cwd(), out, maxKb = 600, width, origin = 'http://site.test', chrome, keepFrames = false }) {
  if (typeof WebSocket === 'undefined') throw new Error('record.mjs needs Node 22 or later (built-in WebSocket)')
  if (!take || !take.root || !take.w || !take.h) throw new Error('a take needs root, w and h')
  if (!Array.isArray(take.steps)) throw new Error('a take needs a steps array')
  const path = take.path || '/'
  if (!path.startsWith('/')) throw new Error(`the take path must start with "/": ${JSON.stringify(path)}`)
  const fps = Number(take.fps) || 24
  const frameMs = 1000 / fps
  const dpr = Number(take.dpr) || 1
  const base = resolve(takeDir, take.root)
  if (!existsSync(base)) throw new Error(`no build folder at ${base}`)
  if (!resolveFile(base, path)) throw new Error(`the build at ${base} has no page for ${path}`)
  const bin = findChrome(chrome)
  if (!bin) throw new Error('no Chrome or Chromium found: pass --chrome <path> or set CHROME_PATH')
  try { execFileSync('magick', ['-version'], { stdio: 'ignore' }) } catch { throw new Error('ImageMagick (magick) is not on the PATH') }

  const outDir = resolve(out)
  const framesDir = join(outDir, 'frames')
  rmSync(framesDir, { recursive: true, force: true })
  mkdirSync(framesDir, { recursive: true })

  const summary = {
    take: { path, viewport: `${take.w}x${take.h}`, dpr, fps, theme: take.theme || null, reduced: !!take.reduced },
    timeMode: 'virtual', frames: 0, duration: 0, stills: [], clip: null,
    consoleErrors: [], exceptions: [], failedRequests: [], warnings: [],
  }
  const warn = m => { summary.warnings.push(m); console.error(`record.mjs: warning: ${m}`) }

  const profile = mkdtempSync(join(tmpdir(), 'genjutsu-record-'))
  const flags = [
    '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run',
    '--no-default-browser-check', '--hide-scrollbars', '--disable-extensions', '--mute-audio',
    '--disable-threaded-animation', '--disable-checker-imaging',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
  ]
  if (process.platform === 'linux') flags.push('--disable-dev-shm-usage')
  if ((typeof process.getuid === 'function' && process.getuid() === 0) || (process.env.CI && process.platform === 'linux')) flags.push('--no-sandbox')
  flags.push('about:blank')
  const browser = spawn(bin, flags, { stdio: ['ignore', 'ignore', 'pipe'] })
  const killBrowser = () => { try { browser.kill('SIGKILL') } catch {} }
  const onSignal = () => {
    killBrowser()
    try { rmSync(profile, { recursive: true, force: true }) } catch {}
    process.exit(130)
  }
  process.on('exit', killBrowser)
  for (const s of SIGNALS) process.once(s, onSignal)

  try {
    const wsUrl = await new Promise((res, rej) => {
      let buf = ''
      const timer = setTimeout(() => rej(new Error(`the browser did not start within 20 s: ${buf.slice(-400).trim()}`)), 20000)
      browser.stderr.on('data', d => {
        buf += d
        const m = buf.match(/DevTools listening on (ws:\/\/\S+)/)
        if (m) { clearTimeout(timer); res(m[1]) }
      })
      browser.on('error', e => { clearTimeout(timer); rej(new Error(`cannot start ${bin}: ${e.message}`)) })
      browser.on('exit', code => { clearTimeout(timer); rej(new Error(`the browser exited (${code}) before it listened: ${buf.slice(-400).trim()}`)) })
    })
    const ws = new WebSocket(wsUrl)
    await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej) })
    let id = 0
    const pending = new Map()
    const listeners = new Set()
    ws.addEventListener('message', ev => {
      const msg = JSON.parse(ev.data)
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id)
        pending.delete(msg.id)
        if (msg.error) rej(new Error(JSON.stringify(msg.error)))
        else res(msg.result)
      } else if (msg.method) {
        for (const l of listeners) Promise.resolve().then(() => l(msg)).catch(e => console.error(`record.mjs: ${e.message}`))
      }
    })
    const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
      const i = ++id
      pending.set(i, { res, rej })
      ws.send(JSON.stringify({ id: i, method, params, sessionId }))
    })
    const within = (p, ms, what) => Promise.race([p, sleep(ms).then(() => { throw new Error(`${what} did not settle within ${ms} ms`) })])

    const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
    const S = (m, p) => send(m, p, sessionId)
    const waitFor = (method, ms) => new Promise(r => {
      const timer = setTimeout(() => { listeners.delete(l); r(false) }, ms)
      const l = msg => { if (msg.sessionId === sessionId && msg.method === method) { clearTimeout(timer); listeners.delete(l); r(true) } }
      listeners.add(l)
    })

    const requestUrls = new Map()
    listeners.add(async msg => {
      if (msg.sessionId !== sessionId) return
      if (msg.method === 'Fetch.requestPaused') {
        const { requestId, request } = msg.params
        const url = new URL(request.url)
        const f = resolveFile(base, url.pathname)
        if (f) {
          await S('Fetch.fulfillRequest', {
            requestId, responseCode: 200,
            responseHeaders: [{ name: 'Content-Type', value: TYPES[extname(f).toLowerCase()] || 'application/octet-stream' }],
            body: readFileSync(f).toString('base64'),
          }).catch(() => {})
        } else {
          // Browsers ask for /favicon.ico on their own; a build without one is not a failure.
          if (url.pathname !== '/favicon.ico') summary.failedRequests.push(`404 ${url.pathname}`)
          await S('Fetch.fulfillRequest', { requestId, responseCode: 404, responseHeaders: [], body: '' }).catch(() => {})
        }
      } else if (msg.method === 'Network.requestWillBeSent') {
        requestUrls.set(msg.params.requestId, msg.params.request.url)
      } else if (msg.method === 'Network.loadingFailed' && !msg.params.canceled) {
        summary.failedRequests.push(`${msg.params.errorText} ${(requestUrls.get(msg.params.requestId) || '').slice(0, 200)}`)
      } else if (msg.method === 'Network.responseReceived' && msg.params.response.status >= 400 && !msg.params.response.url.startsWith(origin)) {
        summary.failedRequests.push(`${msg.params.response.status} ${msg.params.response.url.slice(0, 200)}`)
      } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        summary.consoleErrors.push(msg.params.args.map(a => a.value ?? a.description ?? '').join(' ').slice(0, 300))
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const d = msg.params.exceptionDetails
        summary.exceptions.push(((d.exception && d.exception.description) || d.text || '').slice(0, 300))
      }
    })

    await S('Fetch.enable', { patterns: [{ urlPattern: `${origin}/*` }] })
    await S('Network.enable')
    await S('Page.enable')
    await S('Runtime.enable')
    await S('Animation.enable')
    await S('Emulation.setDeviceMetricsOverride', { width: take.w, height: take.h, deviceScaleFactor: dpr, mobile: take.w < 600 })
    const media = [{ name: 'prefers-reduced-motion', value: take.reduced ? 'reduce' : 'no-preference' }]
    if (take.theme) media.push({ name: 'prefers-color-scheme', value: take.theme })
    await S('Emulation.setEmulatedMedia', { features: media })
    await S('Page.addScriptToEvaluateOnNewDocument', { source: (take.fromLoad ? 'window.__recStartFrozen = true;\n' : '') + CLOCK_JS })

    const ev = async (expr, ms = 15000) => {
      const r = await within(S('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }), ms, 'a page expression')
      if (r.exceptionDetails) throw new Error(`in the page: ${(r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text}`)
      return r.result.value
    }

    // ---- time --------------------------------------------------------------------------
    let virtual = true
    let realClock = 0
    const goReal = async why => {
      if (!virtual) return
      virtual = false
      summary.timeMode = 'real'
      warn(`the virtual clock stopped (${String(why).split("\n")[0]}); the rest of the clip is recorded in real time and can stutter`)
      await S('Animation.setPlaybackRate', { playbackRate: 1 }).catch(() => {})
      await ev('window.__rec && window.__rec.thaw()', 3000).catch(() => {})
      realClock = Date.now()
    }
    const freeze = async () => {
      await S('Animation.setPlaybackRate', { playbackRate: 0 })
      const ok = await ev('!!window.__rec && (window.__rec.freeze(), true)').catch(() => false)
      if (!ok) await goReal('the clock is missing from the page')
    }
    // Lets the page live exactly one frame of time.
    const advance = async ms => {
      if (virtual) {
        try {
          await ev(`window.__rec.advance(${ms})`, 15000)
          return
        } catch (e) {
          await goReal(e.message)
        }
      }
      const due = realClock + ms
      const left = due - Date.now()
      if (left > 0) await sleep(left)
      realClock = Math.max(due, Date.now() - ms)
    }

    // ---- load --------------------------------------------------------------------------
    if (take.fromLoad) await S('Animation.setPlaybackRate', { playbackRate: 0 })
    const loaded = waitFor('Page.loadEventFired', 20000)
    await S('Page.navigate', { url: origin + path })
    if (!(await loaded)) warn('the load event did not fire within 20 s')
    await ev(`(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
      await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 4000); })));
      await document.fonts.ready;
    })()`, 20000).catch(e => warn(`prep: ${e.message}`))
    if (!take.fromLoad) await sleep(Number(take.settle ?? 300))
    await ev(`document.documentElement.style.scrollBehavior = 'auto'`).catch(() => {})
    await freeze()
    if (take.cursor) await ev(cursorJs(take.cursor))

    // ---- frames ------------------------------------------------------------------------
    const mouse = { x: Math.round(take.w * 0.62), y: Math.round(take.h * 0.72), down: false }
    const probes = []
    const capture = async () => {
      const r = await within(S('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true }), 15000, 'a screenshot')
      return Buffer.from(r.data, 'base64')
    }
    let frame = 0
    let lastPng = null
    const shoot = async () => {
      lastPng = await capture()
      frame++
      write(join(framesDir, `${String(frame).padStart(4, '0')}.png`), lastPng)
      if (take.probe) probes.push({ frame, t: Math.round(frame * frameMs), value: await ev(take.probe).catch(e => `error: ${e.message}`) })
    }
    // One frame: the step's change for this frame, one frame of time, then the capture.
    const tick = async change => {
      if (change) await change()
      await advance(frameMs)
      await shoot()
    }
    const input = params => within(S('Input.dispatchMouseEvent', params), 5000, `the ${params.type} event`)
    const moveMouse = async (x, y) => {
      mouse.x = x
      mouse.y = y
      await input({ type: 'mouseMoved', x, y, button: mouse.down ? 'left' : 'none', buttons: mouse.down ? 1 : 0 })
      if (take.cursor) await ev(`window.__recCursor(${x}, ${y}, ${mouse.down})`)
    }
    const center = async (selector, nth = 0) => {
      const r = await ev(`(() => {
        const el = document.querySelectorAll(${JSON.stringify(selector)})[${Number(nth) || 0}];
        if (!el) return { error: 'no element matches' };
        const b = el.getBoundingClientRect();
        return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
      })()`)
      if (r.error) throw new Error(`${JSON.stringify(selector)}${nth ? ` [${nth}]` : ''}: ${r.error}`)
      if (r.x < 0 || r.y < 0 || r.x > take.w || r.y > take.h) throw new Error(`${JSON.stringify(selector)} is outside the viewport (${Math.round(r.x)}, ${Math.round(r.y)}): scroll to it first`)
      return [Math.round(r.x), Math.round(r.y)]
    }
    const scrollTarget = async (to, offset = 0) => {
      if (typeof to === 'number') return to
      const y = await ev(`(() => {
        const el = document.querySelector(${JSON.stringify(to)});
        if (!el) return null;
        return el.getBoundingClientRect().top + window.scrollY - ${Number(offset) || 0};
      })()`)
      if (y === null) throw new Error(`no element matches ${JSON.stringify(to)}`)
      return y
    }
    const glide = async (from, to, n, ease) => {
      for (let k = 1; k <= n; k++) {
        const t = ease(k / n)
        await tick(() => moveMouse(Math.round((from[0] + (to[0] - from[0]) * t) * 10) / 10, Math.round((from[1] + (to[1] - from[1]) * t) * 10) / 10))
      }
    }

    for (const [i, step] of take.steps.entries()) {
      const where = `step ${i + 1} ${JSON.stringify(step).slice(0, 120)}`
      try {
        if ('wait' in step) {
          for (let k = 0, n = frameCount(step.wait, fps); k < n; k++) await tick()
        } else if (step.scroll) {
          const sc = step.scroll
          const ease = EASE[sc.ease || 'linear'] || EASE.linear
          const max = await ev('document.documentElement.scrollHeight - window.innerHeight')
          const from = await ev('window.scrollY')
          const to = Math.max(0, Math.min(max, await scrollTarget(sc.to, sc.offset)))
          const n = frameCount(sc.duration ?? 1000, fps)
          let at = from
          for (let k = 1; k <= n; k++) {
            const y = from + (to - from) * ease(k / n)
            await tick(async () => {
              if (sc.via === 'wheel') {
                const dy = Math.round(y - at)
                at += dy
                if (dy) await input({ type: 'mouseWheel', x: mouse.x, y: mouse.y, deltaX: 0, deltaY: dy })
              } else {
                await ev(`window.scrollTo({ top: ${y.toFixed(2)}, behavior: 'instant' })`)
              }
            })
          }
        } else if (step.pointer) {
          const pts = step.pointer.path
          if (!Array.isArray(pts) || !pts.length) throw new Error('pointer needs a path of [x, y] points')
          const ease = EASE[step.pointer.ease || 'linear'] || EASE.linear
          const n = frameCount(step.pointer.duration ?? 800, fps)
          for (let k = 1; k <= n; k++) {
            const [x, y] = along(pts, ease(k / n))
            await tick(() => moveMouse(Math.round(x * 10) / 10, Math.round(y * 10) / 10))
          }
        } else if (step.drag) {
          const pts = step.drag.path
          if (!Array.isArray(pts) || pts.length < 2) throw new Error('drag needs a path of at least two [x, y] points')
          const ease = EASE[step.drag.ease || 'linear'] || EASE.linear
          const n = frameCount(step.drag.duration ?? 800, fps)
          const [x0, y0] = pts[0]
          if (x0 !== mouse.x || y0 !== mouse.y) await moveMouse(x0, y0)
          mouse.down = true
          await input({ type: 'mousePressed', x: x0, y: y0, button: 'left', buttons: 1, clickCount: 1 })
          if (take.cursor) await ev(`window.__recCursor(${x0}, ${y0}, true)`)
          for (let k = 1; k <= n; k++) {
            const [x, y] = along(pts, ease(k / n))
            await tick(() => moveMouse(Math.round(x * 10) / 10, Math.round(y * 10) / 10))
          }
          mouse.down = false
          await input({ type: 'mouseReleased', x: mouse.x, y: mouse.y, button: 'left', buttons: 0, clickCount: 1 })
          if (take.cursor) await ev(`window.__recCursor(${mouse.x}, ${mouse.y}, false)`)
        } else if ('hover' in step) {
          const target = await center(step.hover, step.nth)
          await glide([mouse.x, mouse.y], target, frameCount(step.duration ?? 400, fps), EASE.inOut)
        } else if ('click' in step) {
          const [x, y] = await center(step.click, step.nth)
          if (x !== mouse.x || y !== mouse.y) await moveMouse(x, y)
          mouse.down = true
          await tick(async () => {
            await input({ type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 })
            if (take.cursor) await ev(`window.__recCursor(${x}, ${y}, true)`)
          })
          for (let k = 1, n = frameCount(step.hold ?? 90, fps); k < n; k++) await tick()
          mouse.down = false
          await tick(async () => {
            await input({ type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount: 1 })
            if (take.cursor) await ev(`window.__recCursor(${x}, ${y}, false)`)
          })
        } else if ('eval' in step) {
          await ev(step.eval)
        } else if ('still' in step) {
          const name = String(step.still).replace(/[^\w.-]+/g, '-')
          const png = lastPng || await capture()
          const file = join(outDir, `${name}.png`)
          write(file, png)
          summary.stills.push(file)
        } else {
          throw new Error('unknown step')
        }
      } catch (e) {
        throw new Error(`${where}: ${e.message}`)
      }
    }
    summary.frames = frame
    summary.duration = Math.round(frame * frameMs) / 1000
    if (take.probe) write(join(outDir, 'probe.json'), JSON.stringify(probes, null, 1))
    await send('Target.closeTarget', { targetId }).catch(() => {})
    ws.close()
  } finally {
    process.off('exit', killBrowser)
    for (const s of SIGNALS) process.off(s, onSignal)
    const exited = browser.exitCode !== null ? Promise.resolve() : new Promise(r => browser.once('exit', r))
    killBrowser()
    await Promise.race([exited, sleep(5000)])
    try { rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }) } catch {}
  }

  if (!summary.frames) throw new Error('the take recorded no frame (add a wait, scroll, pointer, drag, hover or click step)')
  summary.clip = encode({ framesDir, outDir, fps, maxKb, width: Number(width || take.width) || 0, captureWidth: Math.round(take.w * dpr), captureHeight: Math.round(take.h * dpr), warn })
  if (!keepFrames && summary.clip.underBudget) rmSync(framesDir, { recursive: true, force: true })
  return summary
}

// Encodes the frames as a looping WebP under the budget: quality first, then the frame rate,
// then the size. The first attempt under budget wins.
function encode({ framesDir, outDir, fps, maxKb, width, captureWidth, captureHeight, warn }) {
  const all = readdirSync(framesDir).filter(f => f.endsWith('.png')).sort().map(f => join(framesDir, f))
  const file = join(outDir, 'clip.webp')
  const startW = width && width < captureWidth ? width : captureWidth
  const qualities = [82, 74, 66, 58, 50]
  const rates = [...new Set([fps, Math.round(fps * 2 / 3), Math.round(fps / 2)].filter(r => r >= 8 && r <= fps))]
  const scales = [1, 0.85, 0.72, 0.6, 0.5, 0.42, 0.35]
  const attempts = []
  for (const q of qualities) attempts.push({ q, rate: fps, scale: 1 })
  for (const rate of rates.slice(1)) attempts.push({ q: qualities.at(-1), rate, scale: 1 })
  for (const scale of scales.slice(1)) attempts.push({ q: qualities.at(-1), rate: rates.at(-1), scale })
  const tried = []
  let last = null
  for (const a of attempts) {
    const w = Math.round(startW * a.scale / 2) * 2
    const h = Math.round(captureHeight * (w / captureWidth) / 2) * 2
    // Frames picked on the clip's own clock, so a lower rate keeps the real duration.
    const picked = []
    const n = Math.max(1, Math.round(all.length * a.rate / fps))
    for (let k = 0; k < n; k++) picked.push(all[Math.min(all.length - 1, Math.round(k * fps / a.rate))])
    // WebP stores whole milliseconds: each frame gets its share of the rounded running total,
    // so the clip lasts exactly as long as the take instead of drifting short.
    const args = ['-loop', '0']
    picked.forEach((f, k) => args.push('-delay', `${Math.round((k + 1) * 1000 / a.rate) - Math.round(k * 1000 / a.rate)}x1000`, f))
    if (w !== captureWidth) args.push('-resize', `${w}x${h}!`)
    args.push('-quality', String(a.q), '-define', 'webp:method=4', '-define', 'webp:lossless=false', file)
    execFileSync('magick', args, { stdio: ['ignore', 'ignore', 'pipe'], maxBuffer: 1 << 26 })
    const kb = Math.round(statSync(file).size / 1024)
    last = { path: file, kb, quality: a.q, fps: a.rate, frames: picked.length, width: w, height: h, maxKb, underBudget: kb <= maxKb }
    tried.push(`q${a.q} ${a.rate}fps ${w}px: ${kb} KB`)
    console.error(`record.mjs: encode q${a.q} ${a.rate}fps ${w}x${h} -> ${kb} KB${kb <= maxKb ? ' (under budget)' : ''}`)
    if (kb <= maxKb) break
  }
  if (!last.underBudget) warn(`the clip stays over ${maxKb} KB at the smallest setting (${last.kb} KB); frames kept`)
  last.attempts = tried
  return last
}

const sameFile = (a, b) => { try { return realpathSync(a) === realpathSync(b) } catch { return false } }
if (process.argv[1] && sameFile(process.argv[1], fileURLToPath(import.meta.url))) {
  const argv = process.argv.slice(2)
  const takeFile = option(argv, '--take')
  const out = option(argv, '--out')
  if (!takeFile || !out) {
    console.error('usage: node record.mjs --take <take.json> --out <dir> [--max-kb 600] [--width <px>] [--origin http://site.test] [--chrome <path>] [--keep-frames]')
    process.exit(2)
  }
  try {
    const take = JSON.parse(readFileSync(takeFile, 'utf8'))
    const summary = await record({
      take, takeDir: dirname(resolve(takeFile)), out,
      maxKb: Number(option(argv, '--max-kb')) || 600,
      width: option(argv, '--width'),
      origin: option(argv, '--origin'),
      chrome: option(argv, '--chrome'),
      keepFrames: argv.includes('--keep-frames'),
    })
    const c = summary.clip
    console.error(`record.mjs: final ${c.kb} KB, quality ${c.quality}, ${c.fps} fps, ${c.width}x${c.height}, ${c.frames} frames, ${summary.duration} s, ${summary.timeMode} time`)
    console.log(JSON.stringify(summary, null, 1))
    process.exit(c.underBudget ? 0 : 1)
  } catch (e) {
    console.error(`record.mjs: ${e.message}`)
    process.exit(1)
  }
}
