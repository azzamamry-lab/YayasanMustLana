// ============================================================
//  HALAMAN 14-27: sholat, wudhu, maze masjid, zakat & sedekah
// ============================================================
const { H } = require('./layout');

module.exports = function pagesB(S) {
  const p = [];

  // ---------- 14. POSTER GERAKAN SHOLAT ----------
  const gerakan = [
    ['🙌', 'Takbiratul Ihram', 'Mengangkat kedua tangan sambil membaca takbir'],
    ['🙇', 'Rukuk', 'Membungkuk dengan punggung lurus, membaca tasbih'],
    ['🙋', "I'tidal", 'Berdiri tegak kembali setelah rukuk'],
    ['🛐', 'Sujud', 'Bersujud dengan khusyuk, dahi menyentuh lantai'],
    ['🙏', 'Duduk Tasyahud', 'Duduk tenang sambil membaca tasyahud'],
    ['👋', 'Salam', 'Menoleh ke kanan dan ke kiri sambil mengucap salam']
  ];
  p.push(`
  <div class="page">
    ${H.actHead(S.ico.star, 'Gerakan Sholat', 'Tiang agama — hafalkan gerakannya agar sholat kita sempurna')}
    <div style="text-align:center;margin:2px 0 12px">
      <span class="ar ar-big" style="font-size:20pt">الصَّلَاةُ عِمَادُ الدِّينِ</span>
    </div>
    ${gerakan.map(([ic, lbl, sub], i) => `
      <div class="info-row">
        <span class="ic2" style="font-size:15pt;width:26px;background:#e6f4f1;border-radius:50%;padding:4px 0;color:#0f766e;font-weight:800">${i + 1}</span>
        <span class="ic2">${ic}</span>
        <div class="tx"><b>${lbl}</b> — ${sub}</div>
      </div>
    `).join('')}
    ${H.box('gold', `
      <h5>🎵 Lagu gerakan sholat</h5>
      <div class="tx" style="font-size:10.5pt;font-weight:800;color:#6b4d1f">"Takbir angkat tangan, rukuk bungkukkan badan, i'tidal berdiri, sujud bersujud, duduk lalu salam — sholatku indah!"</div>
    `)}
    ${H.footer(14, 'Sholat & Wudhu')}
  </div>`);

  // ---------- 15. TRACING NAMA GERAKAN ----------
  p.push(H.activity({
    no: 15, sec: 'Sholat & Wudhu', icon: S.ico.write, title: 'Menebalkan Nama Gerakan Sholat',
    sub: 'Tebalkan sambil mempraktikkan gerakannya, ya!',
    badges: [{ icon: S.ico.write, txt: 'Menebalkan' }, { icon: S.ico.star, txt: 'Sambil bergerak' }],
    body: `
      ${H.traceWord('🙌', 'TAKBIRATUL IHRAM')}
      ${H.traceWord('🙇', 'RUKUK')}
      ${H.traceWord('🙋', "I'TIDAL")}
      ${H.traceWord('🛐', 'SUJUD')}
      ${H.traceWord('🙏', 'DUDUK TASYAHUD')}
      ${H.traceWord('👋', 'SALAM')}
      ${H.box('soft', `
        <h5>🤸 Tantangan bergerak</h5>
        <div class="tx" style="font-size:10.5pt;font-weight:700;color:#3d5a55">Baca satu nama gerakan, lalu praktekan gerakannya selama 5 hitungan. Ulangi sampai semua gerakan hafal!</div>
      `)}
    `
  }));

  // ---------- 16. URUTKAN GERAKAN SHOLAT ----------
  p.push(H.activity({
    no: 16, sec: 'Sholat & Wudhu', icon: S.ico.order, title: 'Urutkan Gerakan Sholat',
    sub: 'Tulis nomor 1 sampai 6 sesuai urutan gerakan sholat',
    badges: [{ icon: S.ico.order, txt: 'Mengurutkan' }, { icon: S.ico.write, txt: 'Tulis angka' }],
    body: `
      <div class="order-grid">
        <div class="order-card"><span class="pic">🙌</span><span class="lbl">Takbiratul Ihram</span><div class="order-num"></div></div>
        <div class="order-card"><span class="pic">🛐</span><span class="lbl">Sujud</span><div class="order-num"></div></div>
        <div class="order-card"><span class="pic">🙇</span><span class="lbl">Rukuk</span><div class="order-num"></div></div>
        <div class="order-card"><span class="pic">🙏</span><span class="lbl">Duduk Tasyahud</span><div class="order-num"></div></div>
        <div class="order-card"><span class="pic">🙋</span><span class="lbl">I'tidal</span><div class="order-num"></div></div>
        <div class="order-card"><span class="pic">👋</span><span class="lbl">Salam</span><div class="order-num"></div></div>
      </div>
      ${H.box('gold', `
        <h5>🗝️ Cek jawaban</h5>
        <div class="tx" style="font-size:10pt;font-weight:700;color:#6b4d1f">1) Takbiratul Ihram → 2) Rukuk → 3) I'tidal → 4) Sujud → 5) Duduk Tasyahud → 6) Salam</div>
      `)}
    `
  }));

  // ---------- 17. MENCOCOKKAN GERAKAN SHOLAT ----------
  p.push(H.activity({
    no: 17, sec: 'Sholat & Wudhu', icon: S.ico.match, title: 'Mencocokkan Gerakan Sholat',
    sub: 'Tarik garis dari nama ke gambar gerakannya',
    badges: [{ icon: S.ico.write, txt: 'Tarik garis' }],
    body: `
      <div class="match-grid">
        <div class="match-item big">TAKBIRATUL IHRAM</div><div class="match-mid">✏️</div><div class="match-item pic">👋</div>
        <div class="match-item big">RUKUK</div><div class="match-mid">✏️</div><div class="match-item pic">🙌</div>
        <div class="match-item big">I'TIDAL</div><div class="match-mid">✏️</div><div class="match-item pic">🧍</div>
        <div class="match-item big">SUJUD</div><div class="match-mid">✏️</div><div class="match-item pic">🙇</div>
        <div class="match-item big">DUDUK TASYAHUD</div><div class="match-mid">✏️</div><div class="match-item pic">🛐</div>
        <div class="match-item big">SALAM</div><div class="match-mid">✏️</div><div class="match-item pic">🙏</div>
      </div>
      <p class="hint">Petunjuk: 🙌 takbir mengangkat tangan • 🙇 membungkuk • 🧍 berdiri tegak • 🛐 bersujud • 🙏 duduk • 👋 salam</p>
    `
  }));

  // ---------- 18. POSTER WUDHU ----------
  const wudhu = [
    ['🤲', 'Basuh telapak tangan', 'Basuh kedua telapak tangan tiga kali'],
    ['💧', 'Berkumur & bersihkan hidung', 'Berkumur dan hirup air ke hidung perlahan'],
    ['🙂', 'Basuh wajah', 'Basuh seluruh wajah tiga kali'],
    ['💪', 'Basuh lengan sampai siku', 'Basuh tangan kanan lalu kiri sampai siku'],
    ['🙆', 'Usap kepala & telinga', 'Usap sebagian kepala, lalu bersihkan telinga'],
    ['👣', 'Basuh kaki', 'Basuh kaki kanan lalu kiri sampai mata kaki']
  ];
  p.push(`
  <div class="page">
    ${H.actHead(S.ico.drop, 'Urutan Wudhu', 'Bersuci sebelum sholat — wudhu membuat badan dan hati bersih')}
    <div style="text-align:center;margin:2px 0 12px">
      <span class="ar ar-big" style="font-size:20pt">لَا صَلَاةَ إِلَّا بِطُهُورٍ</span>
    </div>
    ${wudhu.map(([ic, lbl, sub], i) => `
      <div class="info-row">
        <span class="ic2" style="font-size:15pt;width:26px;background:#e6f4f1;border-radius:50%;padding:4px 0;color:#0f766e;font-weight:800">${i + 1}</span>
        <span class="ic2">${ic}</span>
        <div class="tx"><b>${lbl}</b> — ${sub}</div>
      </div>
    `).join('')}
    ${H.box('gold', `
      <h5>🚿 Setelah wudhu</h5>
      <div class="tx" style="font-size:10.5pt;font-weight:700;color:#6b4d1f">Ucapkan doa setelah wudhu: <span class="ar" style="font-size:14pt">أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ</span> — "Aku bersaksi tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya."</div>
    `)}
    ${H.footer(18, 'Sholat & Wudhu')}
  </div>`);

  // ---------- 19. URUTKAN LANGKAH WUDHU ----------
  p.push(H.activity({
    no: 19, sec: 'Sholat & Wudhu', icon: S.ico.order, title: 'Urutkan Langkah Wudhu',
    sub: 'Tulis nomor 1 sampai 6 sesuai urutan wudhu yang benar',
    badges: [{ icon: S.ico.order, txt: 'Mengurutkan' }, { icon: S.ico.write, txt: 'Tulis angka' }],
    body: `
      <div class="order-grid">
        <div class="order-card"><span class="pic">🙂</span><span class="lbl">Basuh wajah</span><div class="order-num"></div></div>
        <div class="order-card"><span class="pic">🤲</span><span class="lbl">Basuh telapak tangan</span><div class="order-num"></div></div>
        <div class="order-card"><span class="pic">👣</span><span class="lbl">Basuh kaki</span><div class="order-num"></div></div>
        <div class="order-card"><span class="pic">💧</span><span class="lbl">Berkumur & bersihkan hidung</span><div class="order-num"></div></div>
        <div class="order-card"><span class="pic">🙆</span><span class="lbl">Usap kepala & telinga</span><div class="order-num"></div></div>
        <div class="order-card"><span class="pic">💪</span><span class="lbl">Basuh lengan sampai siku</span><div class="order-num"></div></div>
      </div>
      <p class="hint">Urutan: 1) Telapak tangan → 2) Berkumur → 3) Wajah → 4) Lengan → 5) Kepala → 6) Kaki</p>
    `
  }));

  // ---------- 20. MENCOCOKKAN WUDHU ----------
  p.push(H.activity({
    no: 20, sec: 'Sholat & Wudhu', icon: S.ico.match, title: 'Mencocokkan Wudhu',
    sub: 'Tarik garis dari gambar ke nama langkah wudhu',
    badges: [{ icon: S.ico.write, txt: 'Tarik garis' }],
    body: `
      <div class="match-grid">
        <div class="match-item pic">🤲</div><div class="match-mid">✏️</div><div class="match-item big">Basuh wajah</div>
        <div class="match-item pic">💧</div><div class="match-mid">✏️</div><div class="match-item big">Usap kepala & telinga</div>
        <div class="match-item pic">🙂</div><div class="match-mid">✏️</div><div class="match-item big">Basuh telapak tangan</div>
        <div class="match-item pic">💪</div><div class="match-mid">✏️</div><div class="match-item big">Basuh kaki</div>
        <div class="match-item pic">🙆</div><div class="match-mid">✏️</div><div class="match-item big">Berkumur & hidung</div>
        <div class="match-item pic">👣</div><div class="match-mid">✏️</div><div class="match-item big">Basuh lengan sampai siku</div>
      </div>
      ${H.box('soft', `
        <h5>🚿 Praktik nyata</h5>
        <div class="tx" style="font-size:10.5pt;font-weight:700;color:#3d5a55">Besok saat wudhu, urutkan langkahnya sambil menyebutkan satu per satu. Orang tua boleh membantu!</div>
      `)}
    `
  }));

  // ---------- 21. MAZE KE MASJID ----------
  p.push(H.activity({
    no: 21, sec: 'Sholat & Wudhu', icon: S.ico.find, title: 'Ayo ke Masjid!',
    sub: 'Bantu anak muslim menemukan jalan menuju masjid',
    badges: [{ icon: S.ico.find, txt: 'Telusuri jalan' }, { icon: S.ico.color, txt: 'Warnai jalannya' }],
    body: `
      ${S.mazeSvg({ cols: 8, rows: 9, seed: 11, cell: 36, ox: 22, oy: 18 })}
      <p class="hint">Mulai dari bintang ⭐, ikuti jalan sampai ke masjid 🕌. Setelah sampai, ucapkan: "Aku datang ke rumah Allah!"</p>
    `
  }));

  // ---------- 22. DIVIDER ZAKAT & SEDEKAH ----------
  p.push(`
  <div class="page">
    <div class="divider">
      <div class="dnum">BAGIAN 4</div>
      ${S.bigCoins().replace('class="big"', 'class="dbig"')}
      <h2>Zakat &amp; Sedekah</h2>
      <p>Berbagi membuat hati bersih dan harta semakin berkah. Ayo belajar memberi dengan ikhlas!</p>
      <div class="dline"></div>
      <div class="dstar">✦ ✦ ✦</div>
    </div>
    ${H.footer(22, 'Zakat & Sedekah')}
  </div>`);

  // ---------- 23. POSTER ZAKAT & SEDEKAH ----------
  p.push(`
  <div class="page">
    ${H.actHead(S.ico.star, 'Zakat & Sedekah', 'Indahnya berbagi — sedikit yang kita beri, banyak berkah yang kembali')}
    <div style="text-align:center;margin:2px 0 12px">
      <span class="ar ar-big" style="font-size:20pt">وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ</span>
    </div>
    ${H.box('soft', `
      <div class="info-row"><span class="ic2">💰</span><div class="tx"><b>Zakat</b> — harta yang dikeluarkan setiap tahun oleh muslim yang mampu, untuk membersihkan harta dan membantu sesama.</div></div>
      <div class="info-row"><span class="ic2">🤲</span><div class="tx"><b>Sedekah</b> — memberi dengan ikhlas kapan saja, tidak harus menunggu kaya. Senyum pun bisa menjadi sedekah!</div></div>
    `)}
    ${H.box('', `
      <h5>⭐ Mengapa kita berbagi?</h5>
      <div class="info-row"><span class="ic2">🧼</span><div class="tx">Zakat <b>membersihkan harta</b> kita.</div></div>
      <div class="info-row"><span class="ic2">🌱</span><div class="tx">Sedekah <b>tidak mengurangi harta</b> — justru menambah keberkahan.</div></div>
      <div class="info-row"><span class="ic2">😊</span><div class="tx">Berbagi membuat <b>hati senang</b> dan menumbuhkan rasa syukur.</div></div>
    `)}
    ${H.box('gold', `
      <h5>🎯 Tantangan kebaikan hari ini</h5>
      <div class="tx" style="font-size:10.5pt;font-weight:700;color:#6b4d1f">Ayo lakukan satu sedekah sederhana hari ini: berbagi makanan, menyisihkan uang saku, atau sekadar tersenyum pada teman!</div>
    `)}
    ${H.footer(23, 'Zakat & Sedekah')}
  </div>`);

  // ---------- 24. TRACING KATA ZAKAT & SEDEKAH ----------
  p.push(H.activity({
    no: 24, sec: 'Zakat & Sedekah', icon: S.ico.write, title: 'Menebalkan Kata Kebaikan',
    sub: 'Tebalkan kata-kata indah tentang berbagi',
    badges: [{ icon: S.ico.write, txt: 'Menebalkan' }],
    body: `
      ${H.traceWord('💰', 'ZAKAT')}
      ${H.traceWord('🤲', 'SEDEKAH')}
      ${H.traceWord('❤️', 'IKHLAS')}
      ${H.traceWord('🎁', 'BERBAGI')}
      ${H.traceWord('🌱', 'BERKAH')}
      ${H.box('soft', `
        <h5>💬 Tahukah kamu?</h5>
        <div class="tx" style="font-size:10.5pt;font-weight:700;color:#3d5a55">Rasulullah ﷺ bersabda: "Senyummu kepada saudaramu adalah sedekah." (HR. Tirmidzi) — jadi tersenyum juga ibadah, lho!</div>
      `)}
    `
  }));

  // ---------- 25. MEWARNAI SEDEKAH ----------
  p.push(H.activity({
    no: 25, sec: 'Zakat & Sedekah', icon: S.ico.color, title: 'Mewarnai: Tangan yang Suka Memberi',
    sub: 'Warnai gambarnya, lalu ceritakan kembali',
    badges: [{ icon: S.ico.color, txt: 'Mewarnai' }, { icon: S.ico.star, txt: 'Bercerita' }],
    body: `
      ${S.sceneSedekah()}
      ${H.traceWord('🤲', 'SEDEKAH')}
      <p class="hint" style="text-align:center">"Tangan yang suka memberi adalah tangan yang diberkahi Allah."</p>
    `
  }));

  // ---------- 26. BERHITUNG KOIN SEDEKAH ----------
  p.push(H.activity({
    no: 26, sec: 'Zakat & Sedekah', icon: S.ico.count, title: 'Berhitung Koin Sedekah',
    sub: 'Hitung koinnya, lalu tulis jawabannya',
    badges: [{ icon: S.ico.count, txt: 'Berhitung' }, { icon: S.ico.write, txt: 'Tulis angka' }],
    body: `
      ${H.q(1, 'Berapa koin yang dimasukkan ke kotak sedekah?')}
      <div class="count-row"><div class="count-pics">💰 💰 💰</div><div class="count-ans"></div></div>
      ${H.q(2, 'Hitung koin di tangan temanmu!')}
      <div class="count-row"><div class="count-pics">💰 💰 💰 💰 💰</div><div class="count-ans"></div></div>
      ${H.q(3, 'Berapa koin untuk anak yatim?')}
      <div class="count-row"><div class="count-pics">💰 💰 💰 💰</div><div class="count-ans"></div></div>
      ${H.q(4, 'Berapa koin yang tersisa di celengan?')}
      <div class="count-row"><div class="count-pics">💰 💰</div><div class="count-ans"></div></div>
      ${H.q(5, 'Koin mana yang lebih banyak: 3 koin atau 5 koin?')}
      <div class="count-row"><div class="count-pics">💰💰💰  <b style="font-size:20pt">atau</b>  💰💰💰💰💰</div><div class="count-ans"></div></div>
      ${H.box('gold', `
        <h5>⭐ Matematika kebaikan</h5>
        <div class="tx" style="font-size:10.5pt;font-weight:700;color:#6b4d1f">Jika kamu punya 5 koin dan menyedekahkan 2 koin, berapa koin yang tersisa? <span style="color:#0f766e">Tulis jawabanmu:</span> <span class="count-ans" style="display:inline-grid;vertical-align:middle"></span></div>
      `)}
    `
  }));

  // ---------- 27. DIVIDER PUASA ----------
  p.push(`
  <div class="page">
    <div class="divider">
      <div class="dnum">BAGIAN 5</div>
      ${S.bigMoonDates().replace('class="big"', 'class="dbig"')}
      <h2>Puasa Ramadhan</h2>
      <p>Bulan yang penuh berkah — belajar menahan lapar dan dahaga, melatih sabar dan bersyukur.</p>
      <div class="dline"></div>
      <div class="dstar">✦ ✦ ✦</div>
    </div>
    ${H.footer(27, 'Puasa')}
  </div>`);

  return p;
};
