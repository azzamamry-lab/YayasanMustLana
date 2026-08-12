// ============================================================
//  UJI MINIMAL #2: apakah @font-face data-URI bertahan di
//  Page.printToPDF? Uji juga pengaruh font-display: swap.
// ============================================================
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME = process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe';
const html = fs.readFileSync(path.join(__dirname, 'aku-cinta-islam.html'), 'utf8');

// Ambil blok @font-face Baloo 2 latin (unicode-range U+0000-00FF)
const blocks = html.split('@font-face').slice(1);
let latinBlock = null;
for (const b of blocks) {
  if (b.includes("'Baloo 2'") && b.includes('U+0000-00FF')) { latinBlock = b; break; }
}
if (!latinBlock) { console.log('blok Baloo latin tidak ditemukan'); process.exit(1); }
const srcMatch = latinBlock.match(/src: url\(([^)]+)\)/);
const dataUri = srcMatch[1];
console.log('Baloo latin data URI:', dataUri.length, 'karakter; display:', (latinBlock.match(/font-display: ?(\w+)/) || [])[1]);

const PORT = 9335;
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function run(display, label) {
  const testHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Baloo 2'; font-style: normal; font-weight: 700; font-display: ${display}; src: url(${dataUri}) format('woff2'); }
@page { size: A4; margin: 0; }
body { margin: 0; font-family: 'Baloo 2', 'Segoe UI', Arial, sans-serif; }
h1 { font-size: 48pt; margin: 0; }
</style></head><body><h1>Baloo 2 Test ABC 123</h1><p style="font-size:16pt">Teks Indonesia untuk menguji rendering font</p></body></html>`;
  fs.writeFileSync(path.join(__dirname, 'font-test2.html'), testHtml);

  const chrome = spawn(CHROME, ['--headless', '--disable-gpu', `--remote-debugging-port=${PORT}`, '--user-data-dir=' + path.join(require('os').tmpdir(), 'cdp-ft2-' + display), 'about:blank'], { stdio: 'ignore' });
  let targets;
  for (let i = 0; i < 40; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); if (targets.length) break; } catch (e) {}
    await sleep(300);
  }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0; const pending = new Map(); const evWait = new Map();
  function send(method, params) { return new Promise((resolve, reject) => { const mid = ++id; pending.set(mid, { resolve, reject }); ws.send(JSON.stringify({ id: mid, method, params: params || {} })); }); }
  function waitEvent(n) { return new Promise((r) => evWait.set(n, r)); }
  ws.onmessage = (ev) => { const msg = JSON.parse(ev.data); if (msg.id && pending.has(msg.id)) { const p = pending.get(msg.id); pending.delete(msg.id); msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result); } else if (msg.method && evWait.has(msg.method)) { const r = evWait.get(msg.method); evWait.delete(msg.method); r(msg.params); } };
  await new Promise((r) => (ws.onopen = r));
  await send('Page.enable');
  const loaded = waitEvent('Page.loadEventFired');
  await send('Page.navigate', { url: 'file:///' + path.join(__dirname, 'font-test2.html').replace(/\\/g, '/') });
  await loaded;
  await sleep(2500);
  const fc = await send('Runtime.evaluate', { expression: `document.fonts.check('16px "Baloo 2"')`, returnByValue: true });
  const res = await Promise.race([send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false, transferMode: 'ReturnAsStream' }), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 60000))]);
  const chunks = []; let eof = false;
  while (!eof) { const rd = await send('IO.read', { handle: res.stream, size: 1024 * 1024 }); if (rd.data) chunks.push(Buffer.from(rd.data, 'base64')); eof = rd.eof; }
  await send('IO.close', { handle: res.stream });
  const pdf = Buffer.concat(chunks);
  const hasBaloo = pdf.toString('latin1').toLowerCase().includes('baloo');
  const fonts = [...new Set([...pdf.toString('latin1').matchAll(/\/FontName \/([A-Za-z0-9+]+)/g)].map((m) => m[1]))];
  console.log(`[${label}] font.check=${fc.result.value} | PDF ${(pdf.length/1024).toFixed(0)}KB | mengandungBaloo=${hasBaloo} | fonts=${fonts.join(',')}`);
  ws.close(); chrome.kill();
}

(async () => {
  await run('swap', 'swap');
  await sleep(500);
  await run('block', 'block');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
