/* ==========================================================================
   DASHBOARD ADMIN — konten, galeri, berita
   ========================================================================== */

(function () {
  requireSession();

  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /* ---------- Tabs ---------- */
  $$('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      $$('.tab').forEach(function (t) {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      $$('.panel').forEach(function (p) { p.classList.remove('is-active'); });
      $('#panel-' + tab.dataset.tab).classList.add('is-active');
    });
  });

  /* ---------- Logout ---------- */
  $('#btnLogout').addEventListener('click', function () {
    api('/api/logout', { method: 'POST' }).then(function () {
      window.location.href = '/admin/';
    }).catch(function () { window.location.href = '/admin/'; });
  });

  /* ============================================================
     KONTEN WEBSITE
     ============================================================ */
  var loadedContent = null;

  function collectContent() {
    var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var prevVideos = (loadedContent && loadedContent.videos) || [];
    var items = [];
    for (var i = 0; i < 3; i++) {
      items.push({
        title: v('f-prog-' + i + '-title'),
        description: v('f-prog-' + i + '-desc'),
        tags: v('f-prog-' + i + '-tags')
      });
    }
    return {
      hero: { title: v('f-hero-title'), subtitle: v('f-hero-subtitle'), image: v('f-hero-image') },
      about: {
        title: v('f-about-title'), description: v('f-about-description'),
        image: v('f-about-image'),
        heading: v('f-about-heading'), body: v('f-about-body'),
        visi: v('f-about-visi'), misi: v('f-about-misi'),
        values: v('f-about-values').split('\n').map(function (s) { return s.trim(); }).filter(Boolean)
      },
      programs: { title: v('f-programs-title'), subtitle: v('f-programs-subtitle'), items: items },
      videos: [0, 1, 2].map(function (i) {
        var prev = prevVideos[i] || {};
        return {
          youtube_id: v('f-video-' + i),
          title: prev.title || '',
          year: prev.year || '',
          featured: prev.featured != null ? !!prev.featured : (i === 0)
        };
      }),
      contact: {
        address: v('f-contact-address'), email: v('f-contact-email'),
        phone: v('f-contact-phone'), whatsapp: v('f-contact-whatsapp'),
        whatsapp_message: v('f-contact-wa-message')
      },
      stats: {
        years: parseInt(v('f-stats-years'), 10) || 0,
        santri: parseInt(v('f-stats-santri'), 10) || 0,
        relawan: parseInt(v('f-stats-relawan'), 10) || 0,
        programs: parseInt(v('f-stats-programs'), 10) || 0
      },
      donasi: { title: v('f-donasi-title'), description: v('f-donasi-description') },
      footer: { quote: v('f-footer-quote'), quote_source: v('f-footer-source') }
    };
  }

  function fillContent(c) {
    loadedContent = c;
    if (!c) return;
    var set = function (id, val) {
      var el = document.getElementById(id);
      if (el) el.value = val == null ? '' : val;
    };
    set('f-hero-title', c.hero && c.hero.title);
    set('f-hero-subtitle', c.hero && c.hero.subtitle);
    set('f-hero-image', c.hero && c.hero.image);
    set('f-about-title', c.about && c.about.title);
    set('f-about-description', c.about && c.about.description);
    set('f-about-image', c.about && c.about.image);
    set('f-about-heading', c.about && c.about.heading);
    set('f-about-body', c.about && c.about.body);
    set('f-about-visi', c.about && c.about.visi);
    set('f-about-misi', c.about && c.about.misi);
    set('f-about-values', c.about && c.about.values ? c.about.values.join('\n') : '');
    set('f-programs-title', c.programs && c.programs.title);
    set('f-programs-subtitle', c.programs && c.programs.subtitle);
    (c.programs && c.programs.items || []).forEach(function (it, i) {
      set('f-prog-' + i + '-title', it && it.title);
      set('f-prog-' + i + '-desc', it && it.description);
      set('f-prog-' + i + '-tags', it && it.tags);
    });
    (c.videos || []).forEach(function (vid, i) {
      set('f-video-' + i, vid && vid.youtube_id);
    });
    set('f-contact-address', c.contact && c.contact.address);
    set('f-contact-email', c.contact && c.contact.email);
    set('f-contact-phone', c.contact && c.contact.phone);
    set('f-contact-whatsapp', c.contact && c.contact.whatsapp);
    set('f-contact-wa-message', c.contact && c.contact.whatsapp_message);
    set('f-stats-years', c.stats && c.stats.years);
    set('f-stats-santri', c.stats && c.stats.santri);
    set('f-stats-relawan', c.stats && c.stats.relawan);
    set('f-stats-programs', c.stats && c.stats.programs);
    set('f-donasi-title', c.donasi && c.donasi.title);
    set('f-donasi-description', c.donasi && c.donasi.description);
    set('f-footer-quote', c.footer && c.footer.quote);
    set('f-footer-source', c.footer && c.footer.quote_source);
  }

  var contentStatus = $('#contentStatus');

  $('#contentForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = $('#btnSaveContent');
    btn.disabled = true;
    btn.textContent = 'Menyimpan...';
    contentStatus.className = 'status';
    contentStatus.textContent = '';

    api('/api/content', { method: 'PUT', body: JSON.stringify(collectContent()) })
      .then(function (d) {
        showToast('✅ Konten berhasil disimpan.');
        contentStatus.textContent = d.message || 'Tersimpan.';
        contentStatus.className = 'status';
      })
      .catch(function (err) {
        showToast(err.message, 'err');
        contentStatus.textContent = err.message;
        contentStatus.className = 'status err';
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = 'Simpan Konten';
      });
  });

  api('/api/content').then(fillContent).catch(function () {
    showToast('Gagal memuat konten dari server.', 'err');
  });

  /* ============================================================
     GALERI FOTO
     ============================================================ */
  var galleryList = $('#galleryList');

  function galleryCard(it) {
    return '' +
      '<div class="item-card" data-id="' + it.id + '">' +
      '  <img class="thumb" src="' + escapeHtml(it.src) + '" alt="" onerror="this.src=\'https://picsum.photos/seed/g' + it.id + '/180/120\'" />' +
      '  <div class="body">' +
      '    <div class="meta">' +
      '      <span class="album-chip ' + escapeHtml(it.album) + '">' + escapeHtml(it.album) + '</span>' +
      '      <span class="album-chip sosial">#' + it.id + '</span>' +
      '    </div>' +
      '    <div class="grid-2">' +
      '      <div class="field"><label>URL foto</label><input type="url" class="g-src" value="' + escapeHtml(it.src) + '" /></div>' +
      '      <div class="field"><label>Album</label><select class="g-album"><option value="sosial"' + (it.album === 'sosial' ? ' selected' : '') + '>Kegiatan Sosial</option><option value="santri"' + (it.album === 'santri' ? ' selected' : '') + '>Kegiatan Santri</option></select></div>' +
      '    </div>' +
      '    <div class="field"><label>Keterangan</label><input type="text" class="g-caption" value="' + escapeHtml(it.caption) + '" /></div>' +
      '    <div class="field"><label>Label</label><input type="text" class="g-tag" value="' + escapeHtml(it.tag) + '" /></div>' +
      '    <div class="actions">' +
      '      <button class="btn btn-primary btn-sm g-save">Simpan</button>' +
      '      <button class="btn btn-danger btn-sm g-del">Hapus</button>' +
      '    </div>' +
      '  </div>' +
      '</div>';
  }

  function loadGallery() {
    api('/api/gallery').then(function (items) {
      galleryList.innerHTML = items.length
        ? items.map(galleryCard).join('')
        : '<div class="empty-state">Belum ada foto. Tambahkan foto pertama di atas.</div>';
    }).catch(function () {
      galleryList.innerHTML = '<div class="empty-state">Gagal memuat galeri.</div>';
    });
  }

  $('#btnAddGallery').addEventListener('click', function () {
    var album = $('#g-album').value;
    var src = $('#g-src').value.trim();
    var caption = $('#g-caption').value.trim();
    var tag = $('#g-tag').value.trim();
    if (!src) { showToast('Isi URL foto dulu.', 'err'); return; }
    api('/api/gallery', {
      method: 'POST',
      body: JSON.stringify({ album: album, src: src, caption: caption, tag: tag })
    }).then(function () {
      showToast('✅ Foto ditambahkan.');
      $('#g-src').value = ''; $('#g-caption').value = ''; $('#g-tag').value = '';
      loadGallery();
    }).catch(function (err) { showToast(err.message, 'err'); });
  });

  galleryList.addEventListener('click', function (e) {
    var card = e.target.closest('.item-card');
    if (!card) return;
    var id = card.dataset.id;
    var get = function (cls) { return $(cls, card).value; };

    if (e.target.classList.contains('g-save')) {
      api('/api/gallery/' + id, {
        method: 'PUT',
        body: JSON.stringify({ album: get('.g-album'), src: get('.g-src'), caption: get('.g-caption'), tag: get('.g-tag') })
      }).then(function () {
        showToast('✅ Perubahan foto disimpan.');
        loadGallery();
      }).catch(function (err) { showToast(err.message, 'err'); });
    }
    if (e.target.classList.contains('g-del')) {
      if (!confirm('Hapus foto ini?')) return;
      api('/api/gallery/' + id, { method: 'DELETE' }).then(function () {
        showToast('Foto dihapus.');
        loadGallery();
      }).catch(function (err) { showToast(err.message, 'err'); });
    }
  });

  loadGallery();

  /* ============================================================
     BERITA & PENGUMUMAN
     ============================================================ */
  var beritaList = $('#beritaList');

  function beritaCard(b) {
    return '' +
      '<div class="item-card berita-card" data-id="' + b.id + '">' +
      '  <div class="body">' +
      '    <div class="meta">' +
      '      <span class="date-chip">' + (b.date ? escapeHtml(b.date) : 'Tanpa tanggal') + '</span>' +
      '      <span class="album-chip sosial">#' + b.id + '</span>' +
      '    </div>' +
      '    <div class="field"><label>Judul</label><input type="text" class="b-title" value="' + escapeHtml(b.title) + '" /></div>' +
      '    <div class="field"><label>Tanggal</label><input type="date" class="b-date" value="' + escapeHtml(b.date) + '" /></div>' +
      '    <div class="field"><label>Isi</label><textarea class="b-body" rows="3">' + escapeHtml(b.body) + '</textarea></div>' +
      '    <div class="actions">' +
      '      <button class="btn btn-primary btn-sm b-save">Simpan</button>' +
      '      <button class="btn btn-danger btn-sm b-del">Hapus</button>' +
      '    </div>' +
      '  </div>' +
      '</div>';
  }

  function loadBerita() {
    api('/api/berita').then(function (items) {
      beritaList.innerHTML = items.length
        ? items.map(beritaCard).join('')
        : '<div class="empty-state">Belum ada berita. Terbitkan berita pertama di atas.</div>';
    }).catch(function () {
      beritaList.innerHTML = '<div class="empty-state">Gagal memuat berita.</div>';
    });
  }

  $('#btnAddBerita').addEventListener('click', function () {
    var title = $('#b-title').value.trim();
    var date = $('#b-date').value;
    var body = $('#b-body').value.trim();
    if (!title) { showToast('Isi judul berita dulu.', 'err'); return; }
    api('/api/berita', { method: 'POST', body: JSON.stringify({ title: title, date: date, body: body }) })
      .then(function () {
        showToast('✅ Berita diterbitkan.');
        $('#b-title').value = ''; $('#b-date').value = ''; $('#b-body').value = '';
        loadBerita();
      })
      .catch(function (err) { showToast(err.message, 'err'); });
  });

  beritaList.addEventListener('click', function (e) {
    var card = e.target.closest('.item-card');
    if (!card) return;
    var id = card.dataset.id;
    var get = function (cls) { return $(cls, card).value; };

    if (e.target.classList.contains('b-save')) {
      api('/api/berita/' + id, {
        method: 'PUT',
        body: JSON.stringify({ title: get('.b-title'), date: get('.b-date'), body: get('.b-body') })
      }).then(function () {
        showToast('✅ Perubahan berita disimpan.');
        loadBerita();
      }).catch(function (err) { showToast(err.message, 'err'); });
    }
    if (e.target.classList.contains('b-del')) {
      if (!confirm('Hapus berita ini?')) return;
      api('/api/berita/' + id, { method: 'DELETE' }).then(function () {
        showToast('Berita dihapus.');
        loadBerita();
      }).catch(function (err) { showToast(err.message, 'err'); });
    }
  });

  loadBerita();

  /* ============================================================
     TAMPILAN WEBSITE (tema, identitas, font, bagian halaman)
     ============================================================ */
  var SETTINGS_DEFAULTS = {
    settings: {
      site_name: 'Bin Sef Al Khoiriyah',
      site_tagline: 'Yayasan Islam',
      logo_url: '',
      font: 'plus-jakarta',
      colors: { primary: '#0f766e', primary_dark: '#115e59', accent: '#c89b3c', background: '#faf9f5' },
      hero: {
        cta_text: 'Jelajahi Program', cta_link: 'program.html',
        secondary_text: 'Tonton Video', secondary_link: '#video'
      },
      sections: { tentang: true, program: true, video: true, galeri: true, berita: true, donasi: true }
    },
    social: { instagram: '#', youtube: '#', facebook: '#', whatsapp: '' }
  };

  function fillSettings(content) {
    var s = (content && content.settings) || SETTINGS_DEFAULTS.settings;
    var social = (content && content.social) || SETTINGS_DEFAULTS.social;

    var set = function (id, val) {
      var el = document.getElementById(id);
      if (el) el.value = val == null ? '' : val;
    };
    var setChecked = function (id, val) {
      var el = document.getElementById(id);
      if (el) el.checked = !!val;
    };

    set('t-site-name', s.site_name);
    set('t-site-tagline', s.site_tagline);
    set('t-logo-url', s.logo_url);
    set('t-font', s.font || 'plus-jakarta');
    set('t-color-primary', (s.colors && s.colors.primary) || '#0f766e');
    set('t-color-primary-dark', (s.colors && s.colors.primary_dark) || '#115e59');
    set('t-color-accent', (s.colors && s.colors.accent) || '#c89b3c');
    set('t-color-bg', (s.colors && s.colors.background) || '#faf9f5');
    set('t-cta-text', s.hero && s.hero.cta_text);
    set('t-cta-link', s.hero && s.hero.cta_link);
    set('t-secondary-text', s.hero && s.hero.secondary_text);
    set('t-secondary-link', s.hero && s.hero.secondary_link);
    set('t-social-instagram', social.instagram);
    set('t-social-youtube', social.youtube);
    set('t-social-facebook', social.facebook);
    set('t-social-whatsapp', social.whatsapp);

    var sec = s.sections || {};
    ['tentang', 'program', 'video', 'galeri', 'berita', 'donasi'].forEach(function (k) {
      setChecked('t-sec-' + k, sec[k] !== false);
    });
    updateThemePreview();
  }

  function collectSettings() {
    var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var checked = function (id) { var el = document.getElementById(id); return el ? el.checked : true; };
    return {
      settings: {
        site_name: v('t-site-name'),
        site_tagline: v('t-site-tagline'),
        logo_url: v('t-logo-url'),
        font: v('t-font') || 'plus-jakarta',
        colors: {
          primary: v('t-color-primary'),
          primary_dark: v('t-color-primary-dark'),
          accent: v('t-color-accent'),
          background: v('t-color-bg')
        },
        hero: {
          cta_text: v('t-cta-text'),
          cta_link: v('t-cta-link'),
          secondary_text: v('t-secondary-text'),
          secondary_link: v('t-secondary-link')
        },
        sections: {
          tentang: checked('t-sec-tentang'),
          program: checked('t-sec-program'),
          video: checked('t-sec-video'),
          galeri: checked('t-sec-galeri'),
          berita: checked('t-sec-berita'),
          donasi: checked('t-sec-donasi')
        }
      },
      social: {
        instagram: v('t-social-instagram'),
        youtube: v('t-social-youtube'),
        facebook: v('t-social-facebook'),
        whatsapp: v('t-social-whatsapp')
      }
    };
  }

  // Pratinjau tema langsung saat mengubah warna
  function updateThemePreview() {
    var prev = $('#themePreview');
    if (!prev) return;
    var g = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
    var primary = g('t-color-primary');
    var dark = g('t-color-primary-dark');
    var accent = g('t-color-accent');
    var bg = g('t-color-bg');
    var title = prev.querySelector('.tp-text strong');
    if (title && dark) title.style.color = dark;
    var btn = prev.querySelector('.tp-btn');
    if (btn && primary) btn.style.background = primary;
    var accentBtn = prev.querySelector('.tp-btn.tp-accent');
    if (accentBtn && accent) accentBtn.style.background = accent;
    if (bg) prev.style.background = bg;
  }

  ['t-color-primary', 't-color-primary-dark', 't-color-accent', 't-color-bg']
    .forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', updateThemePreview);
    });

  var settingsStatus = $('#settingsStatus');

  $('#settingsForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = $('#btnSaveSettings');
    btn.disabled = true;
    btn.textContent = 'Menyimpan...';
    settingsStatus.className = 'status';
    settingsStatus.textContent = '';

    api('/api/content', { method: 'PUT', body: JSON.stringify(collectSettings()) })
      .then(function () {
        showToast('✅ Tampilan berhasil disimpan.');
        settingsStatus.textContent = 'Tersimpan.';
      })
      .catch(function (err) {
        showToast(err.message, 'err');
        settingsStatus.textContent = err.message;
        settingsStatus.className = 'status err';
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = 'Simpan Tampilan';
      });
  });

  $('#btnResetSettings').addEventListener('click', function () {
    if (!confirm('Kembalikan semua pengaturan tampilan ke nilai bawaan?')) return;
    fillSettings(SETTINGS_DEFAULTS);
    showToast('Form dikembalikan ke bawaan. Klik "Simpan Tampilan" untuk menerapkan.');
  });

  api('/api/content').then(function (c) {
    fillSettings(c);
  }).catch(function () {
    fillSettings(SETTINGS_DEFAULTS);
  });
})();
