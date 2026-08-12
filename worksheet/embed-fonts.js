// ============================================================
//  EMBED FONT: unduh woff2 dari Google Fonts, sematkan base64
//  ke dalam HTML agar render & print selalu konsisten (offline-safe).
// ============================================================
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const CSS_URL =
  'https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;700;800&family=Scheherazade+New:wght@400;700&display=swap';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

function get(url, headers) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers }, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
      })
      .on('error', reject);
  });
}

async function main() {
  const cssRes = await get(CSS_URL, { 'User-Agent': UA });
  if (cssRes.status !== 200) throw new Error('Gagal ambil CSS font: ' + cssRes.status);
  const css = cssRes.body.toString('utf8');

  // Ambil semua url(...) woff2
  const urls = [...new Set([...css.matchAll(/url\((https:[^)]+\.woff2)\)/g)].map((m) => m[1]))];
  console.log('Ditemukan ' + urls.length + ' file font...');

  let embedded = '';
  for (const u of urls) {
    const res = await get(u, { 'User-Agent': UA });
    if (res.status !== 200) {
      console.log('  SKIP ' + u + ' (HTTP ' + res.status + ')');
      continue;
    }
    const b64 = res.body.toString('base64');
    // Ganti url() di CSS dengan data URI
    embedded = (embedded || css).split(u).join(`data:font/woff2;base64,${b64}`);
    console.log('  OK ' + path.basename(new URL(u).pathname) + ' (' + (res.body.length / 1024).toFixed(0) + ' KB)');
  }

  const htmlFile = path.join(__dirname, 'aku-cinta-islam.html');
  let html = fs.readFileSync(htmlFile, 'utf8');

  // Hapus blok <link ... googleapis ...> lalu sisipkan style @font-face
  html = html.replace(/<link rel="preconnect"[^>]*>\n?/g, '');
  html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/g, '');
  html = html.replace('<style>', '<style>\n' + embedded + '\n');

  fs.writeFileSync(htmlFile, html, 'utf8');
  console.log('SELESAI: font tertanam di ' + htmlFile + ' (' + (fs.statSync(htmlFile).size / 1024 / 1024).toFixed(1) + ' MB)');
}

main().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
