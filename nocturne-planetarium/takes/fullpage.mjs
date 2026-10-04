// Full-page still of a static build, served from disk over CDP (no server), like bin/record.mjs.
// Usage: node fullpage.mjs <dist dir> <out.png> <width> <height> [scrollTo: 'top'|'bottom']
// Opens the page in a <width>x<height> viewport, scrolls to the top or the bottom, waits, then
// takes Page.captureScreenshot with captureBeyondViewport over the whole document. Prints a probe.
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { extname, join, resolve } from 'node:path'

const [root, out, W, H, where = 'top'] = process.argv.slice(2)
const base = resolve(root)
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' }
const sleep = ms => new Promise(r => setTimeout(r, ms))
const profile = mkdtempSync(join(tmpdir(), 'fullpage-'))
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--hide-scrollbars', '--no-first-run', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] })
const wsUrl = await new Promise(r => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) r(m[1]) }) })
const ws = new WebSocket(wsUrl); await new Promise(r => ws.addEventListener('open', r))
let id = 0; const pend = new Map(); const ls = new Set()
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result) } else for (const l of ls) l(m) })
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })) })
const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
const S = (m, p) => send(m, p, sessionId)
ls.add(async m => {
  if (m.sessionId !== sessionId || m.method !== 'Fetch.requestPaused') return
  const u = new URL(m.params.request.url); let f = join(base, decodeURIComponent(u.pathname)); if (f.endsWith('/')) f += 'index.html'
  if (existsSync(f) && statSync(f).isFile()) await S('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: TYPES[extname(f)] || 'application/octet-stream' }], body: readFileSync(f).toString('base64') })
  else await S('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 404, responseHeaders: [], body: '' })
})
await S('Fetch.enable', { patterns: [{ urlPattern: 'http://site.test/*' }] })
await S('Page.enable')
await S('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: 1, mobile: false })
await S('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
await S('Page.navigate', { url: 'http://site.test/' })
await sleep(1500)
const ev = async e => (await S('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.value
await ev(`window.scrollTo(0, ${where === 'bottom' ? 'document.documentElement.scrollHeight' : 0})`)
await sleep(800)
const probe = `({y: Math.round(scrollY), innerH: innerHeight, docH: document.documentElement.scrollHeight, skyP: document.documentElement.style.getPropertyValue('--sky-p')})`
const before = await ev(probe)
const docH = before.docH
const r = await S('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: +W, height: docH, scale: 1 } })
writeFileSync(out, Buffer.from(r.data, 'base64'))
console.log(JSON.stringify({ before, after: await ev(probe) }))
chrome.kill('SIGKILL'); await sleep(300); rmSync(profile, { recursive: true, force: true }); process.exit(0)
