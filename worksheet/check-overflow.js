// ============================================================
//  DIAGNOSA OVERFLOW: menambah probe JS ke HTML lalu dump DOM
//  untuk mencari halaman yang kontennya melebihi tinggi A4.
// ============================================================
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'aku-cinta-islam.html');
let html = fs.readFileSync(file, 'utf8');

const probe = `
<script>
window.addEventListener('load', function () {
  var out = ['REPORT_START'];
  document.querySelectorAll('.page').forEach(function (el, i) {
    var over = Math.round(el.scrollHeight - el.clientHeight);
    var title = '';
    var t = el.querySelector('.act-title') || el.querySelector('.divider h2') || el.querySelector('.poster-title h3') || el.querySelector('.cover h1') || el.querySelector('.cert-frame h2');
    if (t) title = t.textContent.trim().slice(0, 40);
    out.push((i + 1) + '|' + over + '|' + title);
  });
  out.push('REPORT_END');
  var pre = document.createElement('pre');
  pre.id = 'report';
  pre.textContent = out.join('\\n');
  document.body.appendChild(pre);
});
</script>`;

html = html.replace('</body>', probe + '\n</body>');
fs.writeFileSync(path.join(__dirname, 'check-overflow.html'), html, 'utf8');
console.log('OK: check-overflow.html dibuat');
