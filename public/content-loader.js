/* ==========================================================================
   CONTENT LOADER — ambil konten & tampilan dari backend admin
   - Konten: teks, galeri, berita
   - Tampilan: warna tema, font, identitas (nama/logo), tombol hero,
     bagian halaman yang tampil, tautan media sosial
   Jika API tidak tersedia, situs tetap menampilkan konten statis bawaan.
   ========================================================================== */
(function () {
  'use strict';

  var API = window.SITE_API_URL || '';

  /* ---------- Helper dasar ---------- */
  function sanitizeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/javascript:/gi, '');
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fetchJSON(path) {
    return fetch(API + path, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }

  function setText(sel, text) {
    var el = document.querySelector(sel);
    if (el && text) el.textContent = text;
  }
  function setHtml(sel, html) {
    var el = document.querySelector(sel);
    if (el && html) el.innerHTML = html;
  }

  /* ---------- Warna: bantu menghitung turunan lembut ---------- */
  function hexToRgb(hex) {
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    if (h.length !== 6) return null;
    var n = parseInt(h, 16);
    if (isNaN(n)) return null;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  // Campur warna dengan putih (amt 0..1 = seberapa banyak putih)
  function mixWhite(hex, amt) {
    var rgb = hexToRgb(hex);
    if (!rgb) return hex || '';
    var m = function (c) { return Math.round(c + (255 - c) * amt); };
    var to2 = function (c) { return ('0' + c.toString(16)).slice(-2); };
    return '#' + to2(m(rgb.r)) + to2(m(rgb.g)) + to2(m(rgb.b));
  }

  // Hanya izinkan tautan aman (http(s), mailto, tel, #, atau relatif);
  // tolak skema berbahaya seperti javascript: / data:.
  function safeHref(u) {
    var s = String(u == null ? '' : u).trim();
    if (!s) return '';
    var scheme = /^([a-z][a-z0-9+.-]*):/i.exec(s);
    if (!scheme) return s;
    return /^(https?|mailto|tel)$/i.test(scheme[1]) ? s : '';
  }

  /* ================================================================
     TAMPILAN / TEMA — diambil dari settings (diatur admin)
     ================================================================ */
  var FONTS = {
    'plus-jakarta': { label: 'Plus Jakarta Sans', stack: '"Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif', query: 'family=Plus+Jakarta+Sans:wght@400;500;600;700;800' },
    'poppins':      { label: 'Poppins',             stack: '"Poppins", "Segoe UI", system-ui, sans-serif',            query: 'family=Poppins:wght@400;500;600;700;800' },
    'inter':        { label: 'Inter',               stack: '"Inter", "Segoe UI", system-ui, sans-serif',              query: 'family=Inter:wght@400;500;600;700;800' },
    'nunito':       { label: 'Nunito Sans',         stack: '"Nunito Sans", "Segoe UI", system-ui, sans-serif',       query: 'family=Nunito+Sans:wght@400;600;700;800' },
    'merriweather': { label: 'Merriweather',        stack: '"Merriweather", Georgia, serif',                          query: 'family=Merriweather:wght@400;700;900' },
    'lora':         { label: 'Lora',                stack: '"Lora", Georgia, serif',                                  query: 'family=Lora:wght@400;600;700' }
  };

  function loadFont(key) {
    var f = FONTS[key];
    if (!f || key === 'plus-jakarta') return; // default sudah dimuat di HTML
    var id = 'cms-font-' + key;
    if (document.getElementById(id)) return;
    var link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?' + f.query + '&display=swap';
    document.head.appendChild(link);
  }

  function applyTheme(s) {
    if (!s) return;
    var root = document.documentElement;
    var colors = s.colors || {};

    // Warna inti
    if (colors.primary) {
      root.style.setProperty('--primary', colors.primary);
      root.style.setProperty('--primary-soft', mixWhite(colors.primary, 0.9));
    }
    if (colors.primary_dark) root.style.setProperty('--primary-dark', colors.primary_dark);
    if (colors.accent) {
      root.style.setProperty('--accent', colors.accent);
      root.style.setProperty('--accent-soft', mixWhite(colors.accent, 0.9));
    }
    if (colors.background) root.style.setProperty('--bg', colors.background);

    // Tipografi
    if (s.font && FONTS[s.font]) {
      loadFont(s.font);
      root.style.setProperty('--font-sans', FONTS[s.font].stack);
    }

    // Identitas: nama & tagline (navbar + footer di semua halaman)
    if (s.site_name) {
      document.querySelectorAll('.brand-text strong').forEach(function (el) { el.textContent = s.site_name; });
    }
    if (s.site_tagline) {
      document.querySelectorAll('.brand-text small').forEach(function (el) { el.textContent = s.site_tagline; });
    }

    // Logo: ganti ikon SVG dengan gambar bila diisi URL
    if (s.logo_url) {
      document.querySelectorAll('.brand-mark').forEach(function (mark) {
        if (mark.querySelector('img.brand-logo')) return;
        var img = document.createElement('img');
        img.className = 'brand-logo';
        img.src = s.logo_url;
        img.alt = s.site_name || 'Logo';
        mark.innerHTML = '';
        mark.appendChild(img);
      });
    }

    // Tombol hero (halaman beranda)
    if (s.hero) {
      var primary = document.querySelector('[data-cms="hero.cta"]');
      if (primary) {
        var label = primary.querySelector('.btn-label');
        if (label && s.hero.cta_text) label.textContent = s.hero.cta_text;
        var ctaHref = safeHref(s.hero.cta_link);
        if (ctaHref) primary.setAttribute('href', ctaHref);
      }
      var secondary = document.querySelector('[data-cms="hero.secondary"]');
      if (secondary) {
        var label2 = secondary.querySelector('.btn-label');
        if (label2 && s.hero.secondary_text) label2.textContent = s.hero.secondary_text;
        var secHref = safeHref(s.hero.secondary_link);
        if (secHref) secondary.setAttribute('href', secHref);
      }
    }

    // Bagian halaman yang tampil/sembunyi (beranda)
    if (s.sections) {
      Object.keys(s.sections).forEach(function (key) {
        var el = document.getElementById(key);
        if (el) el.style.display = s.sections[key] ? '' : 'none';
      });
    }

    // Judul tab browser: ganti nama lama dengan nama baru (prefiks halaman dalam tetap dipertahankan)
    if (s.site_name) {
      document.title = document.title.replace(/Bin Sef Al Khoiriyah|Mustaqbal Lana/g, s.site_name);
    }
  }

  /* ================================================================
     MEDIA SOSIAL — tautan footer (diatur admin)
     ================================================================ */
  var SOCIAL_ORDER = ['instagram', 'youtube', 'facebook', 'whatsapp'];

  function applySocial(social) {
    if (!social) return;
    var anchors = document.querySelectorAll('.socials a');
    anchors.forEach(function (a, i) {
      var key = a.getAttribute('data-cms');
      if (key && key.indexOf('social.') === 0) key = key.slice(7);
      else key = SOCIAL_ORDER[i];
      var href = key && social[key] ? safeHref(social[key]) : '';
      if (href) a.setAttribute('href', href);
    });
  }

  /* ---------------- KONTEN TEKS ---------------- */
  function applyContent(c) {
    if (!c) return;

    if (c.hero) {
      if (c.hero.title) {
        var h1 = document.querySelector('.hero-title');
        if (h1) h1.innerHTML = sanitizeHtml(c.hero.title);
      }
      setText('.hero-sub', c.hero.subtitle);
      if (c.hero.image) {
        var img = document.querySelector('.hero-frame img');
        if (img) img.src = c.hero.image;
      }
    }

    if (c.about) {
      setText('#tentang .section-title', c.about.title);
      setText('#tentang .section-desc', c.about.description);
      setText('.about-body h3', c.about.heading);
      setText('.about-body > p', c.about.body);
      var aboutImg = document.querySelector('.about-media img');
      if (aboutImg && c.about.image) aboutImg.src = c.about.image;
      var mv = document.querySelectorAll('.mv-card p');
      if (mv.length >= 2) {
        if (c.about.visi) mv[0].textContent = c.about.visi;
        if (c.about.misi) mv[1].textContent = c.about.misi;
      }
      if (c.about.values && c.about.values.length) {
        var ul = document.querySelector('.value-list');
        if (ul) {
          ul.innerHTML = c.about.values
            .map(function (v) { return '<li><span aria-hidden="true">✦</span> ' + esc(v) + '</li>'; })
            .join('');
        }
      }
    }

    if (c.programs) {
      setText('#program .section-title', c.programs.title);
      setText('#program .section-desc', c.programs.subtitle);
      var cards = document.querySelectorAll('.program-card');
      (c.programs.items || []).forEach(function (it, i) {
        if (!cards[i]) return;
        var h3 = cards[i].querySelector('h3'); if (h3) h3.textContent = it.title;
        var p = cards[i].querySelector('p'); if (p) p.textContent = it.description;
        var tag = cards[i].querySelector('.program-tag'); if (tag) tag.textContent = it.tags;
      });
    }

    if (c.videos) {
      var iframes = document.querySelectorAll('#video iframe');
      var featured = null;
      for (var vi = 0; vi < c.videos.length; vi++) { if (c.videos[vi].featured) { featured = c.videos[vi]; break; } }
      if (!featured) featured = c.videos[0];
      var sides = [];
      for (var vj = 0; vj < c.videos.length; vj++) { if (!c.videos[vj].featured) sides.push(c.videos[vj]); }
      if (featured && iframes[0] && featured.youtube_id) {
        iframes[0].src = 'https://www.youtube-nocookie.com/embed/' + featured.youtube_id;
      }
      sides.slice(0, 2).forEach(function (v, i) {
        if (iframes[i + 1] && v.youtube_id) {
          iframes[i + 1].src = 'https://www.youtube-nocookie.com/embed/' + v.youtube_id;
        }
      });
    }

    if (c.contact) {
      var addr = document.querySelector('[data-cms="contact.address"]');
      if (addr && c.contact.address) addr.textContent = c.contact.address;
      var email = document.querySelector('[data-cms="contact.email"]');
      if (email && c.contact.email) { email.textContent = c.contact.email; email.href = 'mailto:' + c.contact.email; }
      var phone = document.querySelector('[data-cms="contact.phone"]');
      if (phone && c.contact.phone) {
        phone.textContent = c.contact.phone;
        phone.href = 'tel:' + String(c.contact.phone).replace(/[^\d+]/g, '');
      }
      if (c.contact.whatsapp) {
        var msg = c.contact.whatsapp_message ||
          "Assalamu'alaikum, saya ingin bertanya/donasi ke Yayasan Bin Sef Al Khoiriyah.";
        var wa = 'https://wa.me/' + c.contact.whatsapp + '?text=' + encodeURIComponent(msg);
        var waFloat = document.querySelector('#waFloat'); if (waFloat) waFloat.href = wa;
        var donasiWa = document.querySelector('#donasiWa'); if (donasiWa) donasiWa.href = wa;
      }
    }

    if (c.stats) {
      var counters = document.querySelectorAll('.hero-stats [data-count]');
      if (counters.length >= 4) {
        counters[0].setAttribute('data-count', c.stats.years || 0);
        counters[1].setAttribute('data-count', c.stats.santri || 0);
        counters[2].setAttribute('data-count', c.stats.relawan || 0);
        counters[3].setAttribute('data-count', c.stats.programs || 0);
      }
      var exp = document.querySelector('.about-exp strong');
      if (exp && c.stats.years) exp.textContent = c.stats.years;
    }

    if (c.donasi) {
      setText('.cta-inner h2', c.donasi.title);
      setText('.cta-inner > p', c.donasi.description);
    }

    if (c.footer) {
      var q = document.querySelector('.footer-quran');
      if (q && c.footer.quote) {
        var src = q.querySelector('.footer-quran-src');
        q.textContent = '“' + c.footer.quote + '.” ';
        if (src && c.footer.quote_source) { q.appendChild(src); src.textContent = '(' + c.footer.quote_source + ')'; }
      }
    }
  }

  /* ---------------- GALERI ---------------- */
  function applyGallery(items) {
    var grid = document.getElementById('galleryGrid');
    if (!grid || !items || !items.length) return false;

    grid.innerHTML = items.map(function (it) {
      return '<figure class="gallery-item" data-album="' + esc(it.album) + '">' +
        '<img src="' + esc(it.src) + '" alt="' + esc(it.caption) + '" loading="lazy" ' +
        'onerror="this.onerror=null;this.src=\'https://picsum.photos/seed/cms' + (it.id || 0) + '/800/600\'" />' +
        '<figcaption class="gallery-overlay"><span>' + esc(it.tag) + '</span><p>' + esc(it.caption) + '</p></figcaption>' +
        '</figure>';
    }).join('');

    // Sembunyikan tab album yang tidak punya foto
    var albums = {};
    items.forEach(function (it) { albums[it.album] = true; });
    var tabs = document.querySelectorAll('.gallery-tabs .tab-btn');
    tabs.forEach(function (tab) {
      tab.style.display = albums[tab.getAttribute('data-album')] ? '' : 'none';
    });
    return true;
  }

  /* ---------------- BERITA ---------------- */
  function applyBerita(items, visible) {
    var section = document.getElementById('berita');
    var list = document.getElementById('beritaList');
    if (!section || !list) return;
    if (visible === false) { section.style.display = 'none'; return; }
    if (!items || !items.length) { section.style.display = 'none'; return; }

    section.style.display = '';
    list.innerHTML = items.map(function (b) {
      return '<article class="berita-card">' +
        (b.date ? '<time class="berita-date">' + esc(b.date) + '</time>' : '') +
        '<h3 class="berita-title">' + esc(b.title) + '</h3>' +
        '<p class="berita-body">' + esc(b.body) + '</p>' +
        '</article>';
    }).join('');
  }

  /* ---------------- INISIALISASI ---------------- */
  function load() {
    fetchJSON('/api/site')
      .then(function (data) {
        var content = data.content || {};
        var settings = content.settings || {};
        applyTheme(settings);
        applySocial(content.social);
        applyContent(content);
        var galleryRebuilt = applyGallery(data.gallery);
        var beritaVisible = !settings.sections || settings.sections.berita !== false;
        applyBerita(data.berita, beritaVisible);
        if (galleryRebuilt) window.dispatchEvent(new CustomEvent('cms:ready'));
      })
      .catch(function (e) {
        // API tidak tersedia → biarkan konten statis tampil apa adanya.
        console.warn('CMS: API tidak tersedia, memakai konten statis.', e && e.message);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
