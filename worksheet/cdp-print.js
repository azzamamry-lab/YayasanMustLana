// ============================================================
//  PRINT VIA CDP: Page.printToPDF — menunggu font & layout penuh,
//  hasilnya konsisten dengan apa yang terlihat di browser.
//  Pemakaian: node cdp-print.js [namafile.pdf]
// ============================================================
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME = process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe';
const HTML = path.join(__dirname, 'aku-cinta-islam.html');
const OUT = path.join(__dirname, process.argv[2] || 'Aku-Cinta-Islam-Rukun-Islam-Ibadah.pdf');
const PORT = 9334;

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  const chrome = spawn(CHROME, [
    '--headless', '--disable-gpu', `--remote-debugging-port=${PORT}`,
    '--user-data-dir=' + path.join(require('os').tmpdir(), 'cdp-print'),
    '--no-first-run', '--no-default-browser-check', 'about:blank'
  ], { stdio: 'ignore' });

  let targets = null;
  for (let i = 0; i < 40; i++) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      if (targets.length) break;
    } catch (e) {}
    await sleep(300);
  }
  if (!targets) throw new Error('Chrome CDP tidak merespons');
  const page = targets.find((t) => t.type === 'page');
  console.log('CDP terhubung ke target:', page.type, page.url);
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 0;
  const pending = new Map();
  const eventWaiters = new Map();
  function send(method, params) {
    return new Promise((resolve, reject) => {
      const mid = ++id;
      pending.set(mid, { resolve, reject });
      ws.send(JSON.stringify({ id: mid, method, params: params || {} }));
    });
  }
  function waitEvent(name) {
    return new Promise((r) => eventWaiters.set(name, r));
  }
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) p.reject(new Error(msg.error.message));
      else p.resolve(msg.result);
    } else if (msg.method && eventWaiters.has(msg.method)) {
      const r = eventWaiters.get(msg.method);
      eventWaiters.delete(msg.method);
      r(msg.params);
    }
  };
  await new Promise((r) => (ws.onopen = r));

  await send('Page.enable');
  await send('Runtime.enable');
  console.log('Navigating...');
  const loaded = waitEvent('Page.loadEventFired');
  await send('Page.navigate', { url: 'file:///' + HTML.replace(/\\/g, '/') });
  await loaded;
  console.log('Load selesai, tunggu font...');
  // Tunggu font benar-benar selesai
  await sleep(4000);
  const fontCheck = await send('Runtime.evaluate', {
    expression: `document.fonts.status + '|' + document.fonts.check('16px "Baloo 2"') + '|' + document.fonts.check('16px Nunito')`,
    returnByValue: true
  });
  console.log('Font status:', fontCheck.result.value);

  console.log('Memulai Page.printToPDF (stream)...');
  const res = await Promise.race([
    send('Page.printToPDF', {
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
      paperWidth: 8.2677, paperHeight: 11.6929, // A4
      transferMode: 'ReturnAsStream'
    }),
    new Promise((_, rej) => setTimeout(() => rej(new Error('printToPDF timeout 90s')), 90000))
  ]);
  const handle = res.stream;
  console.log('printToPDF selesai, membaca stream...');
  const chunks = [];
  let eof = false;
  while (!eof) {
    const rd = await send('IO.read', { handle, size: 2 * 1024 * 1024 });
    if (rd.data) chunks.push(Buffer.from(rd.data, 'base64'));
    eof = rd.eof;
  }
  await send('IO.close', { handle });
  fs.writeFileSync(OUT, Buffer.concat(chunks));
  console.log('PDF tersimpan:', OUT, '(' + (fs.statSync(OUT).size / 1024 / 1024).toFixed(2) + ' MB)');

  const pdf = fs.readFileSync(OUT, 'latin1');
  const pages = (pdf.match(/\/Type \/Page\b/g) || []).length;
  console.log('Jumlah halaman:', pages);
  const fonts = [...new Set([...pdf.matchAll(/\/BaseFont \/([A-Za-z0-9+]+)/g)].map((m) => m[1]))];
  console.log('Font di PDF:', fonts.join(', '));

  ws.close();
  chrome.kill();
}

main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
