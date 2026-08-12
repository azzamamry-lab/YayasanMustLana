// ============================================================
//  SCREENSHOT + ANALISIS PIKsel untuk halaman kunci.
//  Pemakaian: node cdp-shot.js  (menghasilkan shot-N.png + statistik)
// ============================================================
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

const CHROME = process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe';
const HTML = path.join(__dirname, 'aku-cinta-islam.html');
const PORT = 9336;
const W = 794, H = 1123; // A4 @96dpi

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// ---- Decoder PNG minimal ----
function decodePNG(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('bukan PNG');
  let pos = 8, idat = [];
  let width, height, bitDepth, colorType;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.slice(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      bitDepth = data[8]; colorType = data[9];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') break;
    pos += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = colorType === 6 ? 4 : 3;
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.slice(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let i = 0; i < stride; i++) {
      // a = tetangga kiri yang SUDAH direkonstruksi (bukan byte mentah!)
      const a = i >= bpp ? out[y * stride + i - bpp] : 0;
      const b = prev[i];
      const c = i >= bpp ? prev[i - bpp] : 0;
      let v = line[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        // Paeth predictor yang benar
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[y * stride + i] = v & 0xff;
    }
    prev = out.slice(y * stride, (y + 1) * stride);
  }
  return { width, height, bpp, data: out };
}

function analyze(pngPath) {
  const { width, height, bpp, data } = decodePNG(fs.readFileSync(pngPath));
  let teal = 0, gold = 0, dark = 0, cream = 0, colored = 0;
  const total = width * height;
  const step = 4; // sampling
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * bpp;
      const r = data[i], g = data[i + 1], bl = data[i + 2];
      // cream bg #fdf9ef (253,249,239)
      if (Math.abs(r - 253) < 12 && Math.abs(g - 249) < 12 && Math.abs(bl - 239) < 12) cream++;
      // teal #0f766e
      if (bl > r && g > r + 20 && g > 90 && g < 160 && bl > 70 && bl < 150) teal++;
      // gold #c9a24a / #d4a537
      if (r > 170 && r < 235 && g > 130 && g < 195 && bl < 120 && bl > 40) gold++;
      // dark text
      if (r < 90 && g < 90 && bl < 90) dark++;
      if (Math.max(r, g, bl) - Math.min(r, g, bl) > 40) colored++;
    }
  }
  const pct = (n) => (n / (total / (step * step)) * 100).toFixed(1);
  return { teal: pct(teal), gold: pct(gold), dark: pct(dark), cream: pct(cream), colored: pct(colored) };
}

async function main() {
  if (process.argv[2] === '--analyze') {
    for (const f of fs.readdirSync(__dirname).filter((n) => /^shot-\d{2}\.png$/.test(n)).sort()) {
      const s = analyze(path.join(__dirname, f));
      console.log(`${f}: teal=${s.teal}% gold=${s.gold}% teks=${s.dark}% cream=${s.cream}% warna=${s.colored}%`);
    }
    return;
  }
  const chrome = spawn(CHROME, ['--headless', '--disable-gpu', `--remote-debugging-port=${PORT}`, '--user-data-dir=' + path.join(require('os').tmpdir(), 'cdp-shot'), 'about:blank'], { stdio: 'ignore' });
  let targets;
  for (let i = 0; i < 40; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); if (targets.length) break; } catch (e) {} await sleep(300); }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0; const pending = new Map(); const evWait = new Map();
  function send(method, params) { return new Promise((resolve, reject) => { const mid = ++id; pending.set(mid, { resolve, reject }); ws.send(JSON.stringify({ id: mid, method, params: params || {} })); }); }
  function waitEvent(n) { return new Promise((r) => evWait.set(n, r)); }
  ws.onmessage = (ev) => { const msg = JSON.parse(ev.data); if (msg.id && pending.has(msg.id)) { const p = pending.get(msg.id); pending.delete(msg.id); msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result); } else if (msg.method && evWait.has(msg.method)) { const r = evWait.get(msg.method); evWait.delete(msg.method); r(msg.params); } };
  await new Promise((r) => (ws.onopen = r));
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  const loaded = waitEvent('Page.loadEventFired');
  await send('Page.navigate', { url: 'file:///' + HTML.replace(/\\/g, '/') });
  await loaded;
  await sleep(3000);

  const pagesToCheck = [1, 4, 8, 21, 38, 40];
  for (const n of pagesToCheck) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${(n - 1) * H});` });
    await sleep(400);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const file = path.join(__dirname, `shot-${String(n).padStart(2, '0')}.png`);
    fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
    const s = analyze(file);
    console.log(`hal ${n}: teal=${s.teal}% gold=${s.gold}% teks=${s.dark}% cream=${s.cream}% warna=${s.colored}%`);
  }
  ws.close(); chrome.kill();
}

main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
