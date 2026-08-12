// ============================================================
//  BUILD WORKSHEET "AKU CINTA ISLAM — RUKUN ISLAM & IBADAH"
//  Menghasilkan worksheet/aku-cinta-islam.html (print-ready A4)
//  Lalu konversi ke PDF dengan headless Chrome.
// ============================================================
const fs = require('fs');
const path = require('path');
const S = require('./parts/svgs');
const { CSS, H } = require('./parts/layout');
const pagesA = require('./parts/pages-a');
const pagesB = require('./parts/pages-b');
const pagesC = require('./parts/pages-c');

const pages = [
  ...pagesA(S),
  ...pagesB(S),
  ...pagesC(S)
];

const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Aku Cinta Islam — Rukun Islam &amp; Ibadah (Worksheet Anak Muslim)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Nunito:wght@400;600;700;800;900&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
${pages.join('\n')}
</body>
</html>`;

const out = path.join(__dirname, 'aku-cinta-islam.html');
fs.writeFileSync(out, html, 'utf8');
console.log(`OK: ${pages.length} halaman → ${out} (${(fs.statSync(out).size / 1024).toFixed(1)} KB)`);
