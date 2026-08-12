// ============================================================
//  HALAMAN 28-40: puasa, haji, rukun iman, doa harian, sertifikat
// ============================================================
const { H } = require('./layout');

module.exports = function pagesC(S) {
  const p = [];

  // ---------- 28. POSTER PUASA RAMADHAN ----------
  p.push(`
  <div class="page">
    ${H.actHead(S.ico.star, 'Puasa Ramadhan', 'Bulan penuh berkah — mari kenali indahnya Ramadhan')}
    <div style="text-align:center;margin:2px 0 12px">
      <span class="ar ar-big" style="font-size:20pt">شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ</span>
    </div>
    ${H.box('soft', `
      <div class="info-row"><span class="ic2">🌙</span><div class="tx"><b>Ramadhan</b> — bulan kesembilan dalam kalender Islam, bulan penuh ampunan dan berkah.</div></div>
      <div class="info-row"><span class="ic2">🥣</span><div class="tx"><b>Sahur</b> — makan sebelum terbit fajar untuk memberi tenaga berpuasa.</div></div>
      <div class="info-row"><span class="ic2">🌅</span><div class="tx"><b>Berbuka</b> — menyegerakan berbuka saat azan maghrib berkumandang.</div></div>
      <div class="info-row"><span class="ic2">🕌</span><div class="tx"><b>Tarawih</b> — sholat malam berjamaah yang hanya ada di bulan Ramadhan.</div></div>
      <div class="info-row"><span class="ic2">🤲</span><div class="tx"><b>Doa berbuka:</b> <span class="ar" style="font-size:14pt">اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ</span> — "Ya Allah, untuk-Mu aku berpuasa dan dengan rezeki-Mu aku berbuka."</div></div>
    `)}
    ${H.box('gold', `
      <h5>⭐ Anak kecil juga bisa berpuasa!</h5>
      <div class="tx" style="font-size:10.5pt;font-weight:700;color:#6b4d1f">Coba berpuasa setengah hari dulu, lalu tambah sedikit demi sedikit. Puasa melatih sabar dan bersyukur!</div>
    `)}
    ${H.footer(28, 'Puasa')}
  </div>`);

  // ---------- 29. MENGHITUNG BINTANG 30 HARI ----------
  p.push(H.activity({
    no: 29, sec: 'Puasa', icon: S.ico.count, title: 'Menghitung Bintang Ramadhan',
    sub: 'Satu bintang mewakili satu hari berpuasa',
    badges: [{ icon: S.ico.count, txt: 'Berhitung' }, { icon: S.ico.write, txt: 'Tulis angka' }],
    body: `
      ${H.q(1, 'Berapa hari bintang ini?')}
      <div class="count-row"><div class="count-pics">🌟 🌟 🌟 🌟 🌟</div><div class="count-ans"></div></div>
      ${H.q(2, 'Hitung bintang di langit!')}
      <div class="count-row"><div class="count-pics">🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟</div><div class="count-ans"></div></div>
      ${H.q(3, 'Berapa hari dalam 1 bulan Ramadhan?')}
      <div class="count-row"><div class="count-pics">🌟 🌟 🌟 🌟 🌟<br>🌟 🌟 🌟 🌟 🌟<br>🌟 🌟 🌟 🌟 🌟</div><div class="count-ans"></div></div>
      ${H.q(4, 'Hitung jumlah kurma untuk berbuka!')}
      <div class="count-row"><div class="count-pics">🌴 🌴 🌴</div><div class="count-ans"></div></div>
      ${H.box('gold', `
        <h5>🎨 Tantangan mewarnai</h5>
        <div class="tx" style="font-size:10.5pt;font-weight:700;color:#6b4d1f">Warnai satu bintang setiap kali kamu berhasil menyelesaikan satu halaman worksheet ini. Kumpulkan 30 bintang seperti 30 hari Ramadhan!</div>
        <div style="font-size:17pt;letter-spacing:4px;margin-top:6px">🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟</div>
      `)}
    `
  }));

  // ---------- 30. TRACING KATA PUASA ----------
  p.push(H.activity({
    no: 30, sec: 'Puasa', icon: S.ico.write, title: 'Menebalkan Kata Ramadhan',
    sub: 'Tebalkan sambil mengingat kegiatan seru di bulan Ramadhan',
    badges: [{ icon: S.ico.write, txt: 'Menebalkan' }],
    body: `
      ${H.traceWord('🥣', 'SAHUR')}
      ${H.traceWord('🌙', 'PUASA')}
      ${H.traceWord('🌅', 'BERBUKA')}
      ${H.traceWord('🕌', 'TARAWIH')}
      ${H.traceWord('🎉', 'LEBARAN')}
      ${H.box('soft', `
        <h5>💬 Tahukah kamu?</h5>
        <div class="tx" style="font-size:10.5pt;font-weight:700;color:#3d5a55">Di bulan Ramadhan, Al-Qur'an pertama kali diturunkan. Pahala kebaikan dilipatgandakan, lho!</div>
      `)}
    `
  }));

  // ---------- 31. MEWARNAI SAHUR & BERBUKA ----------
  p.push(H.activity({
    no: 31, sec: 'Puasa', icon: S.ico.color, title: 'Mewarnai: Sajian Berbuka',
    sub: 'Warnai meja berbuka yang penuh berkah',
    badges: [{ icon: S.ico.color, txt: 'Mewarnai' }],
    body: `
      ${S.sceneIftar()}
      ${H.traceWord('🌅', 'BERBUKA PUASA')}
      <p class="hint" style="text-align:center">Warnai kurma dengan cokelat, teko dengan biru, dan bulan dengan kuning keemasan. 🌙</p>
    `
  }));

  // ---------- 32. DIVIDER HAJI ----------
  p.push(`
  <div class="page">
    <div class="divider">
      <div class="dnum">BAGIAN 6</div>
      ${S.bigKaaba().replace('class="big"', 'class="dbig"')}
      <h2>Haji &amp; Ka'bah</h2>
      <p>Perjalanan suci ke rumah Allah di Mekah — rukun Islam kelima bagi yang mampu.</p>
      <div class="dline"></div>
      <div class="dstar">✦ ✦ ✦</div>
    </div>
    ${H.footer(32, 'Haji')}
  </div>`);

  // ---------- 33. POSTER HAJI & KA'BAH ----------
  p.push(`
  <div class="page">
    ${H.actHead(S.ico.star, 'Haji & Ka\'bah', 'Rumah Allah di Mekah — kiblat umat muslim seluruh dunia')}
    <div style="text-align:center;margin:2px 0 12px">
      <span class="ar ar-big" style="font-size:20pt">لَبَّيْكَ اللَّهُمَّ لَبَّيْك</span>
    </div>
    ${H.box('soft', `
      <div class="info-row"><span class="ic2">🕋</span><div class="tx"><b>Ka'bah</b> — bangunan suci di Masjidil Haram, tempat semua umat muslim menghadap saat sholat.</div></div>
      <div class="info-row"><span class="ic2">🚶</span><div class="tx"><b>Ihram</b> — niat haji dengan mengenakan pakaian ihram yang sederhana.</div></div>
      <div class="info-row"><span class="ic2">🏜️</span><div class="tx"><b>Arafah</b> — berdiam di Padang Arafah pada tanggal 9 Dzulhijjah, puncak ibadah haji.</div></div>
      <div class="info-row"><span class="ic2">🎯</span><div class="tx"><b>Melempar jumrah</b> — melempar batu kecil di Mina sebagai simbol menolak godaan.</div></div>
      <div class="info-row"><span class="ic2">🌀</span><div class="tx"><b>Tawaf</b> — mengelilingi Ka'bah sebanyak tujuh kali.</div></div>
    `)}
    ${H.box('gold', `
      <h5>⭐ Cita-cita mulia</h5>
      <div class="tx" style="font-size:10.5pt;font-weight:700;color:#6b4d1f">Semoga suatu hari nanti kita bisa menunaikan ibadah haji ke Baitullah, aamiin! 🤲</div>
    `)}
    ${H.footer(33, 'Haji')}
  </div>`);

  // ---------- 34. MAZE KE KA'BAH ----------
  p.push(H.activity({
    no: 34, sec: 'Haji', icon: S.ico.find, title: 'Jalan Menuju Ka\'bah',
    sub: 'Bantu jamaah haji menemukan jalan ke Ka\'bah',
    badges: [{ icon: S.ico.find, txt: 'Telusuri jalan' }, { icon: S.ico.color, txt: 'Warnai jalannya' }],
    body: `
      ${S.mazeSvg({ cols: 8, rows: 9, seed: 27, cell: 36, ox: 22, oy: 18, goalIcon: 'kaaba' })}
      <p class="hint">Mulai dari bintang ⭐, telusuri jalan sampai tiba di Ka'bah 🕋. Sesampainya, ucapkan: "Labbaik Allahumma labbaik!"</p>
    `
  }));

  // ---------- 35. BERHITUNG JAMAAH HAJI ----------
  p.push(H.activity({
    no: 35, sec: 'Haji', icon: S.ico.count, title: 'Berhitung Jamaah Haji',
    sub: 'Hitung dengan teliti, lalu tulis jawabannya',
    badges: [{ icon: S.ico.count, txt: 'Berhitung' }, { icon: S.ico.write, txt: 'Tulis angka' }],
    body: `
      ${H.q(1, 'Berapa jamaah yang sedang tawaf?')}
      <div class="count-row"><div class="count-pics">🧕 🧕 🧕</div><div class="count-ans"></div></div>
      ${H.q(2, 'Berapa kali tawaf mengelilingi Ka\'bah?')}
      <div class="count-row"><div class="count-pics">🕋 🕋 🕋 🕋 🕋 🕋 🕋</div><div class="count-ans"></div></div>
      ${H.q(3, 'Berapa butir batu untuk melempar jumrah?')}
      <div class="count-row"><div class="count-pics">⚪ ⚪ ⚪ ⚪ ⚪ ⚪ ⚪</div><div class="count-ans"></div></div>
      ${H.q(4, 'Hitung tenda di Mina!')}
      <div class="count-row"><div class="count-pics">⛺ ⛺ ⛺ ⛺ ⛺</div><div class="count-ans"></div></div>
      ${H.q(5, 'Berapa unta yang membawa jamaah?')}
      <div class="count-row"><div class="count-pics">🐪 🐪</div><div class="count-ans"></div></div>
      ${H.box('gold', `
        <h5>🗝️ Ingat!</h5>
        <div class="tx" style="font-size:10.5pt;font-weight:700;color:#6b4d1f">Tawaf dilakukan <b>7 kali</b> mengelilingi Ka'bah — sama seperti jumlah batu yang dilempar saat jumrah.</div>
      `)}
    `
  }));

  // ---------- 36. POSTER RUKUN IMAN ----------
  const iman = [
    ['1', '✨', 'Iman kepada Allah'],
    ['2', '👼', 'Iman kepada Malaikat'],
    ['3', '📖', 'Iman kepada Kitab-kitab Allah'],
    ['4', '🕊️', 'Iman kepada Rasul'],
    ['5', '⏳', 'Iman kepada Hari Akhir'],
    ['6', '⚖️', 'Iman kepada Qada & Qadar']
  ];
  p.push(`
  <div class="page">
    ${H.actHead(S.ico.star, 'Rukun Iman', 'Enam perkara yang wajib kita yakini dengan sepenuh hati')}
    <div style="text-align:center;margin:2px 0 12px">
      <span class="ar ar-big" style="font-size:20pt">آمَنْتُ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الْآخِرِ وَالْقَدَرِ خَيْرِهِ وَشَرِّهِ</span>
    </div>
    <div class="pillar-grid" style="grid-template-columns:repeat(6,1fr)">
      ${iman.map(([n, ic, lbl]) => `
        <div class="pillar">
          <div class="num">${n}</div>
          <div class="pic">${ic}</div>
          <div class="lbl">${lbl}</div>
        </div>
      `).join('')}
    </div>
    ${H.box('soft', `
      <h5>💬 Arti rukun iman</h5>
      <div class="tx" style="font-size:10.5pt;font-weight:700;color:#3d5a55">"Aku beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, hari akhir, dan takdir baik maupun buruk dari Allah."</div>
    `)}
    ${H.box('gold', `
      <h5>🎵 Lagu rukun iman</h5>
      <div class="tx" style="font-size:10.5pt;font-weight:800;color:#6b4d1f">"Allah, malaikat, kitab, rasul, hari akhir, qada qadar — enam rukun iman, kupegang erat!"</div>
    `)}
    ${H.footer(36, 'Rukun Iman')}
  </div>`);

  // ---------- 37. MENCOCOKKAN RUKUN IMAN ----------
  p.push(H.activity({
    no: 37, sec: 'Rukun Iman', icon: S.ico.match, title: 'Mencocokkan Rukun Iman',
    sub: 'Tarik garis dari gambar ke nama rukun iman',
    badges: [{ icon: S.ico.write, txt: 'Tarik garis' }],
    body: `
      <div class="match-grid">
        <div class="match-item pic">✨</div><div class="match-mid">✏️</div><div class="match-item big">Iman kepada Rasul</div>
        <div class="match-item pic">👼</div><div class="match-mid">✏️</div><div class="match-item big">Iman kepada Allah</div>
        <div class="match-item pic">📖</div><div class="match-mid">✏️</div><div class="match-item big">Iman kepada Malaikat</div>
        <div class="match-item pic">🕊️</div><div class="match-mid">✏️</div><div class="match-item big">Iman kepada Kitab-kitab Allah</div>
        <div class="match-item pic">⏳</div><div class="match-mid">✏️</div><div class="match-item big">Iman kepada Qada & Qadar</div>
        <div class="match-item pic">⚖️</div><div class="match-mid">✏️</div><div class="match-item big">Iman kepada Hari Akhir</div>
      </div>
      ${H.box('soft', `
        <h5>🗝️ Cek jawaban</h5>
        <div class="tx" style="font-size:10.5pt;font-weight:700;color:#3d5a55">✨ Allah • 👼 Malaikat • 📖 Kitab • 🕊️ Rasul • ⏳ Hari Akhir • ⚖️ Qada & Qadar</div>
      `)}
    `
  }));

  // ---------- 38. DOA MASUK & KELUAR MASJID ----------
  p.push(H.activity({
    no: 38, sec: 'Doa Harian', icon: S.ico.star, title: 'Doa Masuk & Keluar Masjid',
    sub: 'Hafalkan doanya, lalu tebalkan tulisan latinnya',
    badges: [{ icon: S.ico.write, txt: 'Menebalkan' }, { icon: S.ico.star, txt: 'Menghafal' }],
    body: `
      ${H.box('gold', `
        <h5>🚪 Doa masuk masjid</h5>
        <span class="ar ar-big">اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ</span>
        <div class="tx" style="font-size:10.5pt;font-weight:800;text-align:center;color:#4a5d5d;margin:4px 0">"Allahummaftah lii abwaaba rahmatik"</div>
        <div class="tx" style="font-size:9.5pt;font-weight:700;text-align:center;color:#8aa39d;margin-bottom:8px">Artinya: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu."</div>
        ${H.traceWord('🕌', 'ALLAHUMMA-FTAH LII ABWAABA RAHMATIK')}
      `)}
      ${H.box('soft', `
        <h5>🚪 Doa keluar masjid</h5>
        <span class="ar ar-big">اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ</span>
        <div class="tx" style="font-size:10.5pt;font-weight:800;text-align:center;color:#4a5d5d;margin:4px 0">"Allahumma innii as-aluka min fadhlik"</div>
        <div class="tx" style="font-size:9.5pt;font-weight:700;text-align:center;color:#8aa39d;margin-bottom:8px">Artinya: "Ya Allah, sesungguhnya aku memohon karunia-Mu."</div>
        ${H.traceWord('🕌', "ALLAHUMMA INNII AS-ALUKA MIN FADHLIK")}
      `)}
      <p class="hint">Biasakan membaca doa ini setiap masuk dan keluar masjid. Orang tua atau guru boleh membacakan sampai anak hafal sendiri.</p>
    `
  }));

  // ---------- 39. DOA SEBELUM & SESUDAH MAKAN ----------
  p.push(H.activity({
    no: 39, sec: 'Doa Harian', icon: S.ico.star, title: 'Doa Sebelum & Sesudah Makan',
    sub: 'Hafalkan doanya, lalu tebalkan tulisan latinnya',
    badges: [{ icon: S.ico.write, txt: 'Menebalkan' }, { icon: S.ico.star, txt: 'Menghafal' }],
    body: `
      ${H.box('gold', `
        <h5>🍽️ Doa sebelum makan</h5>
        <span class="ar ar-big">بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ</span>
        <div class="tx" style="font-size:10.5pt;font-weight:800;text-align:center;color:#4a5d5d;margin:4px 0">"Bismillahi wa 'ala barakatillah"</div>
        <div class="tx" style="font-size:9.5pt;font-weight:700;text-align:center;color:#8aa39d;margin-bottom:8px">Artinya: "Dengan nama Allah dan dengan berkah-Nya."</div>
        ${H.traceWord('🍚', "BISMILLAHI WA 'ALA BARAKATILLAH")}
      `)}
      ${H.box('soft', `
        <h5>🍽️ Doa sesudah makan</h5>
        <span class="ar ar-big">الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ</span>
        <div class="tx" style="font-size:10.5pt;font-weight:800;text-align:center;color:#4a5d5d;margin:4px 0">"Alhamdulillahilladzi ath'amanaa wa saqaanaa wa ja'alanaa muslimiin"</div>
        <div class="tx" style="font-size:9.5pt;font-weight:700;text-align:center;color:#8aa39d;margin-bottom:8px">Artinya: "Segala puji bagi Allah yang memberi kami makan dan minum, dan menjadikan kami muslim."</div>
        ${H.traceWord('🙏', 'ALHAMDULILLAHILLADZI ATH\'AMANAA WA SAQAANAA')}
      `)}
      <p class="hint">Ingat adab makan: cuci tangan, baca bismillah, makan dengan tangan kanan, dan jangan lupa alhamdulillah!</p>
    `
  }));

  // ---------- 40. SERTIFIKAT ----------
  p.push(`
  <div class="page">
    <div class="cert-frame">
      <div class="certs">✦ ✦ ✦</div>
      <h2>Sertifikat Penghargaan</h2>
      <div style="font-size:12pt;font-weight:800;color:#8a6d2f">dengan bangga diberikan kepada</div>
      <div class="cert-name">________________________</div>
      <div class="cert-tx">atas keberhasilan menyelesaikan dengan semangat<br>
        <b style="color:#0f766e">Paket Worksheet "Aku Cinta Islam: Rukun Islam &amp; Ibadah"</b><br>
        Semoga ilmu ini menjadi bekal kebaikan dunia dan akhirat. Aamiin.</div>
      <div class="cert-sign">
        <div style="text-align:center"><div class="ln"></div>Orang Tua / Wali</div>
        <div style="text-align:center"><div class="ln"></div>Tanggal</div>
        <div style="text-align:center"><div class="ln"></div>Guru / Ustadz</div>
      </div>
      <div class="cert-star">✦ ✦ ✦ ✦ ✦</div>
      <div style="font-size:9pt;font-weight:700;color:#8aa39d;margin-top:6mm">Masya Allah, tabarakallah! Teruslah belajar mencintai Allah dan Rasul-Nya. 🌙</div>
    </div>
  </div>`);

  return p;
};
