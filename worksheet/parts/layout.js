// ============================================================
//  LAYOUT & HELPER HALAMAN — worksheet A4 print-ready
// ============================================================

// Pola geometris islami (data-uri) untuk latar halaman
const PATTERN = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><g fill="none" stroke="#d4a537" stroke-width="1" opacity="0.14"><path d="M30 6l6 6-6 6-6-6z"/><path d="M30 42l6 6-6 6-6-6z"/><path d="M6 30l6-6 6 6-6 6z"/><path d="M42 30l6-6 6 6-6 6z"/><circle cx="30" cy="30" r="4"/></g></svg>`
)}`;

const CSS = `
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html, body { margin: 0; padding: 0; }
body { font-family: 'Nunito', 'Segoe UI', Arial, sans-serif; color: #2b3a3a; -webkit-font-smoothing: antialiased; }

.page { width: 210mm; height: 297mm; position: relative; overflow: hidden; page-break-after: always;
  background:
    radial-gradient(620px 420px at 88% -6%, rgba(15,118,110,0.08), transparent 62%),
    radial-gradient(760px 520px at -8% 112%, rgba(212,165,55,0.12), transparent 56%),
    radial-gradient(300px 300px at 50% 120%, rgba(15,118,110,0.05), transparent 70%),
    #fdf9ef;
  padding: 12mm 14mm 11mm; }
.page::before { content: ""; position: absolute; inset: 0; pointer-events: none; }
.page > * { position: relative; z-index: 1; }

/* ---------- header halaman aktivitas ---------- */
.act-head { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
.act-ico { width: 52px; height: 52px; border-radius: 16px; background: #e6f4f1; display: grid; place-items: center; color: #0f766e; flex: none; }
.act-ico svg { width: 34px; height: 34px; }
.act-title { font-family: 'Baloo 2', 'Segoe UI', Arial, sans-serif; font-weight: 800; font-size: 21pt; line-height: 1.05; color: #0f766e; margin: 0; }
.act-sub { font-size: 10pt; color: #6b7d7d; margin: 2px 0 0; font-weight: 700; }

/* ---------- baris nama & tanggal ---------- */
.name-line { display: flex; gap: 26px; margin: 8px 0 12px; font-size: 10pt; font-weight: 800; color: #4a5d5d; }
.name-line .slot { flex: 1; border-bottom: 2px dashed #b9c8c4; padding-bottom: 3px; }

/* ---------- badge instruksi ---------- */
.badges { display: flex; flex-wrap: wrap; gap: 7px; margin: 2px 0 12px; }
.badge { display: inline-flex; align-items: center; gap: 6px; background: #fff; border: 1.6px solid #cfe3dd; border-radius: 999px;
  padding: 4px 12px; font-size: 9.5pt; font-weight: 800; color: #3d5a55; }
.badge svg { width: 15px; height: 15px; color: #0f766e; }
.badge.act { border-color: #f2d9a4; color: #8a6d2f; background: #fdf6e3; }
.badge.act svg { color: #c9a24a; }

/* ---------- kotak aktivitas ---------- */
.box { background: #fff; border: 2px solid #e3ede8; border-radius: 18px; padding: 14px 16px; margin-bottom: 12px; }
.box.soft { background: #e6f4f1; border-color: #cfe3dd; }
.box.gold { background: #fdf6e3; border-color: #f2d9a4; }
.box h5 { margin: 0 0 8px; font-family: 'Baloo 2', 'Segoe UI', Arial, sans-serif; font-weight: 700; font-size: 12.5pt; color: #115e59; }
.box.gold h5 { color: #8a6d2f; }
.q { font-weight: 800; color: #2b3a3a; font-size: 11pt; margin: 0 0 8px; }
.q .n { display: inline-grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #0f766e; color: #fff; font-size: 10pt; margin-right: 8px; }

/* ---------- tracing ---------- */
.trace-line { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.trace-guide { position: relative; flex: 1; height: 46px; }
.trace-guide::before { content: ""; position: absolute; left: 0; right: 0; top: 14px; border-top: 2px solid #8fb8ae; }
.trace-guide::after { content: ""; position: absolute; left: 0; right: 0; top: 30px; border-top: 2px solid #8fb8ae; }
.trace-guide .mid { position: absolute; left: 0; right: 0; top: 22px; border-top: 2px dashed #a9c9c1; }
.trace-word { position: absolute; left: 6px; right: 6px; top: 0; line-height: 46px; font-size: 20pt; font-weight: 800;
  color: #b9c8c4; letter-spacing: 2px; white-space: nowrap; }
.trace-emoji { font-size: 20pt; }
.trace-ar { font-family: 'Scheherazade New', 'Traditional Arabic', Arial; font-size: 26pt; color: #b9c8c4; line-height: 46px; }

/* ---------- matching ---------- */
.match-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px 10px; align-items: center; }
.match-item { background: #fff; border: 2px solid #e3ede8; border-radius: 14px; padding: 8px 10px; text-align: center; font-weight: 800; font-size: 11pt; color: #2b3a3a; }
.match-item.pic { font-size: 24pt; line-height: 1.2; }
.match-item.big { font-size: 12.5pt; padding: 12px 8px; }
.match-mid { color: #9db8b1; font-size: 16pt; font-weight: 800; }

/* ---------- poster / info ---------- */
.poster-title { text-align: center; margin: 4px 0 12px; }
.poster-title h3 { font-family: 'Baloo 2', 'Segoe UI', Arial, sans-serif; font-weight: 800; font-size: 26pt; color: #0f766e; margin: 0 0 4px; }
.poster-title p { margin: 0; font-weight: 800; color: #8a6d2f; font-size: 11pt; }
.pillar-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.pillar { background: #fff; border: 2px solid #e3ede8; border-radius: 16px; text-align: center; padding: 10px 4px; }
.pillar .num { display: inline-grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: #c9a24a; color: #fff; font-weight: 800; font-size: 11pt; margin-bottom: 6px; }
.pillar .pic { font-size: 26pt; line-height: 1.2; }
.pillar .lbl { font-weight: 800; font-size: 9.5pt; color: #2b3a3a; line-height: 1.25; margin-top: 4px; }
.info-row { display: flex; gap: 10px; align-items: center; background: #fff; border: 2px solid #e3ede8; border-radius: 14px; padding: 9px 12px; margin-bottom: 8px; }
.info-row .ic2 { font-size: 22pt; flex: none; width: 34px; text-align: center; }
.info-row .tx { font-size: 10.5pt; font-weight: 700; color: #2b3a3a; }
.info-row .tx b { color: #0f766e; }

/* ---------- arab ---------- */
.ar { font-family: 'Scheherazade New', 'Traditional Arabic', 'Simplified Arabic', Arial; direction: rtl; }
.ar-big { font-family: 'Scheherazade New', 'Traditional Arabic', Arial; font-size: 24pt; line-height: 1.6; color: #115e59; text-align: center; display: block; }
.ar-mid { font-family: 'Scheherazade New', 'Traditional Arabic', Arial; font-size: 17pt; color: #115e59; line-height: 1.5; }

/* ---------- numbering (urutan) ---------- */
.order-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.order-card { display: flex; align-items: center; gap: 10px; background: #fff; border: 2px solid #e3ede8; border-radius: 14px; padding: 8px 10px; }
.order-card .pic { font-size: 22pt; }
.order-card .lbl { font-weight: 800; font-size: 10pt; color: #2b3a3a; flex: 1; }
.order-num { width: 30px; height: 30px; border: 2px dashed #9db8b1; border-radius: 9px; display: grid; place-items: center; font-weight: 800; color: #9db8b1; font-size: 11pt; flex: none; }
.order-num.filled { border-style: solid; border-color: #0f766e; background: #e6f4f1; color: #0f766e; }

/* ---------- gunting-tempel ---------- */
.cut-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.cut-piece { border: 2px dashed #e07a5f; border-radius: 12px; padding: 8px 3px; text-align: center; background: #fffdf7; }
.cut-piece .pic { font-size: 24pt; }
.cut-piece .lbl { font-size: 8.5pt; font-weight: 800; color: #8a5a5a; margin-top: 3px; line-height: 1.15; }
.target-zone { border: 2px dashed #c9a24a; border-radius: 16px; padding: 12px; background: #fdf6e3; text-align: center; }
.target-zone .step { display: flex; align-items: center; gap: 10px; margin: 7px 0; }
.target-zone .step .pic { font-size: 20pt; width: 40px; text-align: center; }
.target-zone .step .lbl { font-weight: 800; font-size: 10.5pt; color: #6b4d1f; text-align: left; }
.target-zone .step .boxi { flex: 1; border: 1.6px dashed #c9a24a; border-radius: 10px; height: 30px; }

/* ---------- counting ---------- */
.count-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.count-pics { font-size: 17pt; letter-spacing: 2px; flex: 1; line-height: 1.4; }
.count-ans { width: 46px; height: 46px; border: 2px dashed #9db8b1; border-radius: 12px; display: grid; place-items: center; font-weight: 800; font-size: 14pt; color: #9db8b1; flex: none; }

/* ---------- divider section ---------- */
.divider { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; }
.divider .dnum { font-family: 'Baloo 2', 'Segoe UI', Arial, sans-serif; font-weight: 800; font-size: 15pt; color: #c9a24a; letter-spacing: 6px; margin-bottom: 8px; }
.divider h2 { font-family: 'Baloo 2', 'Segoe UI', Arial, sans-serif; font-weight: 800; font-size: 34pt; color: #0f766e; margin: 8px 0 6px; }
.divider p { font-size: 12pt; font-weight: 700; color: #6b7d7d; margin: 0; max-width: 420px; line-height: 1.5; }
.divider .dbig { width: 150px; height: 150px; margin: 18px 0; }
.divider .dline { width: 130px; height: 3px; border-radius: 99px; background: linear-gradient(90deg, transparent, #c9a24a, transparent); margin-top: 10px; }
.divider .dstar { color: #c9a24a; font-size: 16pt; letter-spacing: 14px; margin-top: 12px; }

/* ---------- cover ---------- */
.cover { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; }
.cover .top { position: absolute; top: 16mm; left: 0; right: 0; display: flex; justify-content: space-between; padding: 0 18mm; color: #c9a24a; font-size: 15pt; }
.cover h1 { font-family: 'Baloo 2', 'Segoe UI', Arial, sans-serif; font-weight: 800; font-size: 40pt; line-height: 1.08; color: #0f766e; margin: 10px 0 2px; }
.cover .sub { font-size: 14pt; font-weight: 800; color: #8a6d2f; margin: 0 0 6px; }
.cover .who { display: inline-block; margin-top: 14px; background: #fff; border: 2px solid #e3ede8; border-radius: 999px; padding: 8px 26px; font-weight: 800; font-size: 12pt; color: #4a5d5d; }
.cover .age { display: flex; gap: 10px; justify-content: center; margin-top: 16px; }
.cover .age span { background: #e6f4f1; border-radius: 999px; padding: 6px 18px; font-weight: 800; font-size: 10pt; color: #0f766e; }
.cover .brand { position: absolute; bottom: 16mm; left: 0; right: 0; font-size: 10pt; font-weight: 800; color: #9db8b1; letter-spacing: 2px; }

/* ---------- sertifikat ---------- */
.cert-frame { border: 3px solid #c9a24a; border-radius: 22px; height: 100%; padding: 10mm; background: #fff; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; }
.cert-frame::before { content: ""; position: absolute; inset: 6mm; border: 1.6px dashed #d9b96a; border-radius: 16px; pointer-events: none; }
.cert-frame h2 { font-family: 'Baloo 2', 'Segoe UI', Arial, sans-serif; font-weight: 800; font-size: 27pt; color: #0f766e; margin: 8mm 0 2mm; }
.cert-frame .certs { font-size: 12pt; font-weight: 800; color: #8a6d2f; letter-spacing: 4px; }
.cert-name { font-family: 'Baloo 2', 'Segoe UI', Arial, sans-serif; font-weight: 800; font-size: 30pt; color: #115e59; border-bottom: 2.5px solid #c9a24a; padding: 2mm 20mm; margin: 8mm 0 4mm; }
.cert-tx { font-size: 11.5pt; font-weight: 700; color: #4a5d5d; max-width: 420px; line-height: 1.6; }
.cert-sign { display: flex; justify-content: space-between; width: 100%; max-width: 460px; margin-top: 14mm; }
.cert-sign div { font-size: 10.5pt; font-weight: 800; color: #4a5d5d; }
.cert-sign .ln { width: 150px; border-top: 2px solid #9db8b1; margin-bottom: 4px; }
.cert-star { color: #c9a24a; font-size: 18pt; letter-spacing: 12px; margin-top: 6mm; }

/* ---------- misc ---------- */
.footer { position: absolute; bottom: 5mm; left: 14mm; right: 14mm; display: flex; justify-content: space-between; align-items: center; font-size: 8.5pt; font-weight: 800; color: #a9c0ba; }
.footer .pno { font-family: 'Baloo 2', 'Segoe UI', Arial, sans-serif; }
.big { width: 100%; height: auto; }
.scene { width: 100%; height: auto; }
.maze { width: 100%; height: auto; }
.hint { font-size: 9pt; font-weight: 700; color: #8aa39d; font-style: italic; }
.divider-star-row { display: flex; justify-content: center; gap: 18px; margin: 14px 0; color: #c9a24a; font-size: 15pt; }
.chip-green { background:#0f766e; color:#fff; border-radius:999px; padding:4px 14px; font-weight:800; font-size:9.5pt; }
.sec-label { font-family: 'Baloo 2', 'Segoe UI', Arial, sans-serif; font-weight: 800; font-size: 11pt; color: #c9a24a; letter-spacing: 3px; margin-bottom: 2px; }
`;

// ---------- Helper untuk membangun halaman ----------
const H = {
  arab(t) { return `<span class="ar">${t}</span>`; },
  arabBig(t) { return `<span class="ar ar-big">${t}</span>`; },

  footer(no, sec) {
    return `<div class="footer"><span>AKU CINTA ISLAM • ${sec}</span><span class="pno">${no}</span></div>`;
  },

  nameDate() {
    return `<div class="name-line"><div class="slot">Nama:</div><div class="slot">Tanggal:</div></div>`;
  },

  badges(list) {
    return `<div class="badges">${list.map((b) => `<span class="badge ${b.kind === 'act' ? 'act' : ''}">${b.icon}${b.txt}</span>`).join('')}</div>`;
  },

  // Header aktivitas: ikon besar + judul + subtitle
  actHead(icon, title, sub) {
    return `<div class="act-head"><div class="act-ico">${icon}</div><div><h2 class="act-title">${title}</h2>${sub ? `<p class="act-sub">${sub}</p>` : ''}</div></div>`;
  },

  open({ no, sec }) {
    return `<div class="page">`;
  },
  close(no, sec) {
    return this.footer(no, sec) + `</div>`;
  },

  // Halaman aktivitas lengkap
  activity({ no, sec, icon, title, sub, badges, body }) {
    let h = `<div class="page">`;
    h += this.actHead(icon, title, sub || '');
    h += this.nameDate();
    h += badges ? this.badges(badges) : '';
    h += body;
    h += this.footer(no, sec);
    h += `</div>`;
    return h;
  },

  box(cls, inner) {
    return `<div class="box ${cls || ''}">${inner}</div>`;
  },

  traceWord(emoji, word) {
    return `<div class="trace-line"><span class="trace-emoji">${emoji}</span><div class="trace-guide"><div class="mid"></div><span class="trace-word">${word}</span></div></div>`;
  },

  traceArabic(emoji, arText) {
    return `<div class="trace-line"><span class="trace-emoji">${emoji}</span><div class="trace-guide"><div class="mid"></div><span class="trace-ar">${arText}</span></div></div>`;
  },

  q(n, text) {
    return `<p class="q"><span class="n">${n}</span>${text}</p>`;
  },

  posterTitle(title, sub) {
    return `<div class="poster-title"><h3>${title}</h3>${sub ? `<p>${sub}</p>` : ''}</div>`;
  }
};

module.exports = { CSS, H, PATTERN };
