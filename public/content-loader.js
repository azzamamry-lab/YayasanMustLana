/* ==========================================================================
   CONTENT LOADER — ambil konten dari backend admin dan tampilkan di halaman
   Jika API tidak tersedia, situs tetap menampilkan konten statis bawaan.
   ========================================================================== */
(function () {
  'use strict';

  var API = window.SITE_API_URL || '';

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
  function applyBerita(items) {
    var section = document.getElementById('berita');
    var list = document.getElementById('beritaList');
    if (!section || !list) return;
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
        applyContent(data.content);
        var galleryRebuilt = applyGallery(data.gallery);
        applyBerita(data.berita);
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
