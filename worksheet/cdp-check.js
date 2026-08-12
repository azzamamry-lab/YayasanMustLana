// ============================================================
//  CDP CHECK: ukur layout dalam emulasi media PRINT (persis
//  seperti saat generate PDF) — deteksi overflow & status font.
//  Pemakaian: node cdp-check.js
// ============================================================
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME = process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe';
const HTML = path.join(__dirname, 'aku-cinta-islam.html');
const PORT = 9333;

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  const chrome = spawn(CHROME, [
    '--headless', '--disable-gpu', `--remote-debugging-port=${PORT}`,
    '--user-data-dir=' + path.join(require('os').tmpdir(), 'cdp-chrome'),
    '--no-first-run', 'about:blank'
  ], { stdio: 'ignore' });

  // Tunggu endpoint debugging
  let targets = null;
  for (let i = 0; i < 30; i++) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      if (targets.length) break;
    } catch (e) {}
    await sleep(300);
  }
  if (!targets) throw new Error('Chrome CDP tidak merespons');
  const page = targets.find((t) => t.type === 'page');
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
  await send('Emulation.setEmulatedMedia', { media: 'print' });

  const loaded = waitEvent('Page.loadEventFired');
  await send('Page.navigate', { url: 'file:///' + HTML.replace(/\\/g, '/') });
  await loaded;
  await sleep(3500); // biarkan font selesai

  const evalRes = await send('Runtime.evaluate', {
    expression: `(function(){
      var out = [];
      document.querySelectorAll('.page').forEach(function(el,i){
        var over = Math.round(el.scrollHeight - el.clientHeight);
        var t = el.querySelector('.act-title') || el.querySelector('.divider h2') || el.querySelector('.poster-title h3') || el.querySelector('.cover h1') || el.querySelector('.cert-frame h2');
        out.push((i+1)+'|'+over+'|'+(t?t.textContent.trim().slice(0,35):''));
      });
      var fc = '';
      try { fc = document.fonts.status + ' | Baloo2:' + document.fonts.check('16px "Baloo 2"') + ' | Nunito:' + document.fonts.check('16px Nunito') + ' | Scheherazade:' + document.fonts.check('16px "Scheherazade New"'); } catch(e){ fc = 'font check err'; }
      return JSON.stringify({rows:out, fonts:fc});
    })()`,
    returnByValue: true
  });
  const data = JSON.parse(evalRes.result.value);
  console.log('FONTS:', data.fonts);
  console.log('--- overflow (hal|px|judul) ---');
  data.rows.forEach((r) => console.log(r));
  ws.close();
  chrome.kill();
}

main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
