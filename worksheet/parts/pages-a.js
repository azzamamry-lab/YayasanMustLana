// ============================================================
//  HALAMAN 1-13: cover, panduan, daftar isi, rukun islam, syahadat
// ============================================================
const { H } = require('./layout');

function smallSvg(svg, w) {
  return svg.replace('class="big"', `style="width:${w}px;height:auto"`);
}

module.exports = function pagesA(S) {
  const p = [];

  // ---------- 1. COVER ----------
  p.push(`
  <div class="page">
    <div class="cover">
      <div class="top"><span>☪</span><span>✦</span><span>☪</span></div>
      <div style="width:170px">${S.bigMosque()}</div>
      <div class="sec-label">PAKET WORKSHEET ANAK MUSLIM</div>
      <h1>Aku Cinta Islam</h1>
      <p class="sub">Rukun Islam &amp; Ibadah</p>
      <div class="who">📖 ${S.bigBook() ? '' : ''}Siap Pakai • Print &amp; Main</div>
      <div class="age">
        <span>🧒 Usia 2–4</span><span>🧒 Usia 4–6</span><span>🧒 Usia 6–8</span>
      </div>
      <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
        <span class="chip-green">40 halaman aktivitas seru</span>
        <span class="badge act">🎁 + Sertifikat Penghargaan</span>
      </div>
      <div style="margin-top:22px;font-size:10.5pt;font-weight:800;color:#4a5d5d">
        Nama: ________________________<br>
        <span style="font-size:9pt;color:#8aa39d;font-weight:700">Boleh diwarnai, dicetak ulang untuk dipakai di rumah &amp; kelas.</span>
      </div>
      <div class="brand">B I N S E F A L K H O I R I Y A H</div>
    </div>
    ${H.footer(1, 'Cover')}
  </div>`);

  // ---------- 2. PANDUAN ORANG TUA & GURU ----------
  p.push(H.activity({
    no: 2, sec: 'Panduan', icon: S.ico.star, title: 'Panduan Orang Tua & Guru',
    sub: 'Cara mendampingi anak belajar dengan gembira',
    body: `
      ${H.box('soft', `
        <h5>💡 Tips belajar yang menyenangkan</h5>
        <div class="info-row"><span class="ic2">🤲</span><div class="tx">Mulailah dengan <b>bismillah</b> dan akhiri dengan <b>alhamdulillah</b> — biasakan sejak dini.</div></div>
        <div class="info-row"><span class="ic2">⏰</span><div class="tx">Belajar <b>10–15 menit</b> saja setiap hari. Otak anak menyerap paling baik dalam sesi pendek dan gembira.</div></div>
        <div class="info-row"><span class="ic2">🌟</span><div class="tx">Berikan <b>pujian spesifik</b>, misalnya "Masya Allah, rapi sekali!" — bukan sekadar "bagus".</div></div>
        <div class="info-row"><span class="ic2">🖍️</span><div class="tx">Cetak lalu <b>laminasi</b> atau masukkan ke clear holder + spidol whiteboard agar bisa dipakai berulang kali (wipe &amp; clean).</div></div>
        <div class="info-row"><span class="ic2">🎵</span><div class="tx">Hafalkan doa &amp; rukun dengan <b>nyanyian</b> dan gerakan — anak usia dini belajar lewat asosiasi visual dan irama.</div></div>
        <div class="info-row"><span class="ic2">👶</span><div class="tx"><b>Sesuaikan usia:</b> 2–4 tahun fokus mewarnai &amp; menebalkan; 5–8 tahun fokus mencocokkan, berhitung, dan menulis.</div></div>
      `)}
      ${H.box('gold', `
        <h5>🎯 Manfaat untuk tumbuh kembang anak</h5>
        <div class="info-row"><span class="ic2">✋</span><div class="tx"><b>Motorik halus:</b> menebalkan, menggunting, dan menempel melatih koordinasi tangan-mata.</div></div>
        <div class="info-row"><span class="ic2">🧠</span><div class="tx"><b>Kognitif:</b> mencocokkan dan berhitung melatih logika dan fokus anak.</div></div>
        <div class="info-row"><span class="ic2">❤️</span><div class="tx"><b>Karakter:</b> mengenal rukun Islam, doa, dan adab menumbuhkan cinta kepada Allah sejak dini.</div></div>
      `)}
    `
  }));

  // ---------- 3. DAFTAR ISI ----------
  const tocRows = [
    ['1', 'Rukun Islam', '4', S.ico.star],
    ['2', 'Syahadat', '9', S.ico.star],
    ['3', 'Sholat &amp; Wudhu', '13', S.ico.star],
    ['4', 'Zakat &amp; Sedekah', '22', S.ico.star],
    ['5', 'Puasa', '27', S.ico.star],
    ['6', 'Haji', '32', S.ico.star],
    ['7', 'Rukun Iman', '36', S.ico.star],
    ['8', 'Doa Harian', '38', S.ico.star],
    ['🎁', 'Sertifikat Penghargaan', '40', S.ico.star]
  ];
  p.push(H.activity({
    no: 3, sec: 'Daftar Isi', icon: S.ico.find, title: 'Apa Saja Isinya?',
    sub: '40 halaman petualangan mengenal Rukun Islam & Ibadah',
    body: `
      <div style="display:flex;gap:12px;margin-bottom:10px">
        ${S.bigMosque().replace('class="big"', 'style="width:96px;height:auto"')}
        ${S.bigBook().replace('class="big"', 'style="width:96px;height:auto"')}
        ${S.bigSyahadat().replace('class="big"', 'style="width:96px;height:auto"')}
      </div>
      ${tocRows.map((r, i) => `
        <div class="info-row" style="display:flex;align-items:center">
          <span class="ic2" style="width:44px;color:#0f766e;font-weight:800">${r[0] === '🎁' ? '🎁' : `<span class="pillar" style="border:none;padding:0"><span class="num">${r[0]}</span></span>`}</span>
          <div class="tx" style="flex:1">${r[1]}</div>
          <span style="font-family:'Baloo 2','Segoe UI',Arial;font-weight:800;color:#c9a24a;font-size:12pt">hal. ${r[2]}</span>
        </div>
      `).join('')}
      <p class="hint">Gunting halaman, tempel, warnai — setiap halaman adalah petualangan baru! 🚀</p>
    `
  }));

  // ---------- 4. POSTER RUKUN ISLAM ----------
  const pillars = [
    ['1', '🗣️', 'Syahadat', 'Mengucap dua kalimat syahadat'],
    ['2', '🕌', 'Sholat', 'Sholat lima waktu'],
    ['3', '💰', 'Zakat', 'Membayar zakat'],
    ['4', '🌙', 'Puasa', 'Puasa di bulan Ramadhan'],
    ['5', '🕋', 'Haji', 'Haji bagi yang mampu']
  ];
  p.push(`
  <div class="page">
    ${H.actHead(S.ico.star, 'Rukun Islam', 'Lima tiang agama Islam — ayo kita kenali!')}
    <div style="text-align:center;margin:2px 0 12px">
      <span class="ar ar-big" style="font-size:20pt">بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ</span>
    </div>
    <div class="pillar-grid">
      ${pillars.map(([n, ic, lbl, sub]) => `
        <div class="pillar">
          <div class="num">${n}</div>
          <div class="pic">${ic}</div>
          <div class="lbl">${lbl}</div>
          <div class="lbl" style="color:#8aa39d;font-size:8pt;font-weight:700">${sub}</div>
        </div>
      `).join('')}
    </div>
    ${H.box('gold', `
      <h5>🗝️ Kunci Hafalan</h5>
      <div class="info-row"><span class="ic2">🎵</span><div class="tx">Nyanyikan bersama: <b>"Syahadat, sholat, zakat, puasa, haji — lima rukun Islam, insya Allah kujalani!"</b></div></div>
      <div class="info-row"><span class="ic2">🗣️</span><div class="tx">Tanyakan setiap hari: <b>"Rukun Islam ada berapa?"</b> — anak menjawab sambil menghitung jari.</div></div>
    `)}
    ${H.box('soft', `
      <h5>💬 Cerita singkat</h5>
      <div class="tx" style="font-size:10.5pt;font-weight:700;color:#3d5a55">Rasulullah ﷺ bersabda: <span class="ar" style="font-size:14pt">"الإسلامُ بُنِيَ على خمسٍ"</span> — "Islam dibangun di atas lima perkara." Kelima tiang ini menjaga iman kita tetap kokoh, seperti tiang menjaga bangunan tetap berdiri.</div>
    `)}
    ${H.footer(4, 'Rukun Islam')}
  </div>`);

  // ---------- 5. TRACING NAMA RUKUN ISLAM ----------
  p.push(H.activity({
    no: 5, sec: 'Rukun Islam', icon: S.ico.write, title: 'Menebalkan Nama Rukun Islam',
    sub: 'Ajak jari tanganmu berjalan pelan-pelan di atas huruf',
    badges: [{ icon: S.ico.write, txt: 'Menebalkan' }, { icon: S.ico.color, txt: 'Boleh diwarnai' }],
    body: `
      ${['🗣️ SYAHADAT', '🕌 SHOLAT', '💰 ZAKAT', '🌙 PUASA', '🕋 HAJI'].map((w) => {
        const [ic, ...rest] = w.split(' ');
        return H.traceWord(ic, rest.join(' '));
      }).join('')}
      ${H.box('gold', `
        <h5>⭐ Tantangan Hafalan</h5>
        <div class="q">Coba sebutkan 5 rukun Islam tanpa melihat halaman ini!</div>
        <p class="hint">Tips: tutup mata, minta orang tua membacakan satu per satu, lalu ulangi bersama.</p>
      `)}
    `
  }));

  // ---------- 6. MENCOCOKKAN RUKUN ISLAM ----------
  p.push(H.activity({
    no: 6, sec: 'Rukun Islam', icon: S.ico.match, title: 'Mencocokkan Rukun Islam',
    sub: 'Tarik garis dari nama ke gambarnya',
    badges: [{ icon: S.ico.write, txt: 'Tarik garis' }],
    body: `
      <div class="match-grid">
        <div class="match-item big">SYAHADAT</div><div class="match-mid">✏️</div><div class="match-item pic">🕌</div>
        <div class="match-item big">SHOLAT</div><div class="match-mid">✏️</div><div class="match-item pic">💰</div>
        <div class="match-item big">ZAKAT</div><div class="match-mid">✏️</div><div class="match-item pic">🗣️</div>
        <div class="match-item big">PUASA</div><div class="match-mid">✏️</div><div class="match-item pic">🕋</div>
        <div class="match-item big">HAJI</div><div class="match-mid">✏️</div><div class="match-item pic">🌙</div>
      </div>
      ${H.box('soft', `
        <h5>🔍 Cek jawaban</h5>
        <div class="tx" style="font-size:10.5pt;font-weight:700;color:#3d5a55">
          🗣️ Syahadat • 🕌 Sholat • 💰 Zakat • 🌙 Puasa • 🕋 Haji
        </div>
      `)}
    `
  }));

  // ---------- 7. BERHITUNG RUKUN ISLAM ----------
  p.push(H.activity({
    no: 7, sec: 'Rukun Islam', icon: S.ico.count, title: 'Ayo Berhitung!',
    sub: 'Hitung dengan teliti, tulis jawabannya di kotak',
    badges: [{ icon: S.ico.count, txt: 'Berhitung' }, { icon: S.ico.write, txt: 'Tulis angka' }],
    body: `
      ${H.q(1, 'Berapa jumlah rukun Islam?')}
      <div class="count-row"><div class="count-pics">🗣️ 🕌 💰 🌙 🕋</div><div class="count-ans"></div></div>
      ${H.q(2, 'Berapa kali sholat wajib dalam sehari semalam?')}
      <div class="count-row"><div class="count-pics">🕌 🕌 🕌 🕌 🕌</div><div class="count-ans"></div></div>
      ${H.q(3, 'Berapa jumlah rukun Iman?')}
      <div class="count-row"><div class="count-pics">✨ 👼 📖 🕊️ ⏳ ⚖️</div><div class="count-ans"></div></div>
      ${H.q(4, 'Bulan apa kita berpuasa sebulan penuh? (hitung bulannya)')}
      <div class="count-row"><div class="count-pics">🌙</div><div class="count-ans"></div></div>
      ${H.q(5, 'Hitung koin zakat yang dikeluarkan!')}
      <div class="count-row"><div class="count-pics">💰 💰 💰 💰 💰</div><div class="count-ans"></div></div>
      ${H.q(6, 'Hitung bintang di langit malam ini!')}
      <div class="count-row"><div class="count-pics">🌟 🌟 🌟</div><div class="count-ans"></div></div>
    `
  }));

  // ---------- 8. GUNTING & TEMPEL URUTAN RUKUN ISLAM ----------
  p.push(H.activity({
    no: 8, sec: 'Rukun Islam', icon: S.ico.cut, title: 'Gunting & Tempel: Urutan Rukun Islam',
    sub: 'Gunting kotak di bawah, lalu tempel sesuai urutan yang benar',
    badges: [{ icon: S.ico.cut, txt: 'Gunting' }, { icon: S.ico.glue, txt: 'Tempel' }],
    body: `
      <div class="cut-grid">
        <div class="cut-piece"><div class="pic">🕋</div><div class="lbl">HAJI</div></div>
        <div class="cut-piece"><div class="pic">🗣️</div><div class="lbl">SYAHADAT</div></div>
        <div class="cut-piece"><div class="pic">💰</div><div class="lbl">ZAKAT</div></div>
        <div class="cut-piece"><div class="pic">🌙</div><div class="lbl">PUASA</div></div>
        <div class="cut-piece"><div class="pic">🕌</div><div class="lbl">SHOLAT</div></div>
      </div>
      <div class="target-zone" style="margin-top:12px">
        <h5 style="color:#8a6d2f;font-family:'Baloo 2','Segoe UI',Arial">Tempel di sini sesuai urutan 1–5:</h5>
        ${[1, 2, 3, 4, 5].map((n) => `
          <div class="step"><span class="pic">${n}</span><div class="boxi"></div></div>
        `).join('')}
      </div>
      <p class="hint">Urutan yang benar: 1) Syahadat → 2) Sholat → 3) Zakat → 4) Puasa → 5) Haji</p>
    `
  }));

  // ---------- 9. DIVIDER SYAHADAT ----------
  p.push(`
  <div class="page">
    <div class="divider">
      <div class="dnum">BAGIAN 2</div>
      ${S.bigSyahadat().replace('class="big"', 'class="dbig"')}
      <h2>Syahadat</h2>
      <p>Kalimat yang pertama kali diucapkan saat masuk Islam — tanda cinta kita kepada Allah dan Rasul-Nya ﷺ.</p>
      <div class="dline"></div>
      <div class="dstar">✦ ✦ ✦</div>
    </div>
    ${H.footer(9, 'Syahadat')}
  </div>`);

  // ---------- 10. POSTER SYAHADAT ----------
  p.push(`
  <div class="page">
    ${H.actHead(S.ico.star, 'Dua Kalimat Syahadat', 'Kalimat paling agung yang diucapkan seorang muslim')}
    ${H.box('gold', `
      <h5 style="text-align:center">📜 Kalimat Syahadat</h5>
      <span class="ar ar-big">أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ</span>
      <span class="ar ar-big">وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ</span>
      <div style="text-align:center;font-weight:800;color:#4a5d5d;margin-top:6px;font-size:11pt">
        "Asyhadu an laa ilaaha illallaah, wa asyhadu anna Muhammadar rasuulullaah"
      </div>
    `)}
    ${H.box('soft', `
      <h5>💬 Artinya</h5>
      <div class="tx" style="font-size:11pt">"Aku bersaksi bahwa tiada Tuhan selain Allah, dan aku bersaksi bahwa Nabi Muhammad adalah utusan Allah."</div>
    `)}
    ${H.box('', `
      <div class="info-row"><span class="ic2">🕐</span><div class="tx"><b>Kapan diucapkan?</b> Saat azan berkumandang, dalam sholat, dan setiap kali kita mengingat Allah.</div></div>
      <div class="info-row"><span class="ic2">🔑</span><div class="tx"><b>Kenapa penting?</b> Syahadat adalah pintu masuk menjadi muslim — kunci dari segala amal ibadah.</div></div>
    `)}
    ${H.footer(10, 'Syahadat')}
  </div>`);

  // ---------- 11. TRACING KALIMAT SYAHADAT ----------
  p.push(H.activity({
    no: 11, sec: 'Syahadat', icon: S.ico.write, title: 'Menebalkan Kalimat Syahadat',
    sub: 'Tebalkan tulisan latinnya, lalu baca bersama-sama',
    badges: [{ icon: S.ico.write, txt: 'Menebalkan' }, { icon: S.ico.star, txt: 'Menghafal' }],
    body: `
      <div style="text-align:center;margin-bottom:8px"><span class="ar ar-big">أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ</span></div>
      ${H.traceWord('🗣️', 'ASYHADU AN LAA ILAAHA ILLALLAH')}
      <div style="text-align:center;margin:10px 0 8px"><span class="ar ar-big">وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ</span></div>
      ${H.traceWord('🌟', "WA ASYHADU ANNA MUHAMMADAR RASULULLAH")}
      ${H.box('gold', `
        <h5>🎤 Ayo uji hafalan!</h5>
        <div class="q">Tutup halaman ini dan coba ucapkan syahadat dari awal sampai akhir!</div>
        <p class="hint">Bacakan untuk orang tua atau gurumu. Setiap kali berhasil, warnai satu bintang di bawah:</p>
        <div style="font-size:22pt;letter-spacing:8px">⭐ ⭐ ⭐ ⭐ ⭐</div>
      `)}
    `
  }));

  // ---------- 12. MEWARNAI KALIGRAFI & MASJID ----------
  p.push(H.activity({
    no: 12, sec: 'Syahadat', icon: S.ico.color, title: 'Mewarnai Kaligrafi & Masjid',
    sub: 'Warnai seindah mungkin, jangan lupa baca bismillah dulu',
    badges: [{ icon: S.ico.color, txt: 'Mewarnai' }],
    body: `
      <div style="text-align:center;margin:2px 0 6px">
        <span class="ar ar-big" style="font-size:22pt">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
      </div>
      ${S.sceneMasjid()}
      ${H.traceWord('🕌', 'BISMILLAHIRRAHMANIRRAHIM')}
      <p class="hint" style="text-align:center">"Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang."</p>
    `
  }));

  // ---------- 13. DIVIDER SHOLAT ----------
  p.push(`
  <div class="page">
    <div class="divider">
      <div class="dnum">BAGIAN 3</div>
      ${S.bigPrayer().replace('class="big"', 'class="dbig"')}
      <h2>Sholat &amp; Wudhu</h2>
      <p>Sholat adalah tiang agama. Sebelum sholat, kita bersuci dengan wudhu. Ayo pelajari keduanya!</p>
      <div class="dline"></div>
      <div class="dstar">✦ ✦ ✦</div>
    </div>
    ${H.footer(13, 'Sholat & Wudhu')}
  </div>`);

  return p;
};
