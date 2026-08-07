/* ========================================================
   NAVBAR — frosted glass saat scroll + hamburger menu
   ======================================================== */
(function () {
  var nav = document.getElementById('navbar');
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navLinks');

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 10) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && menu) {
    function setOpen(open) {
      toggle.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    toggle.addEventListener('click', function () {
      setOpen(!menu.classList.contains('is-open'));
    });
    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        setOpen(false);
      });
    }
  }
})();

/* ========================================================
   REVEAL ON SCROLL
   ======================================================== */
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < items.length; i++) items[i].classList.add('is-visible');
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (el) { io.observe(el); });
})();

/* ========================================================
   ANIMASI ANGKA STATISTIK (data-count)
   ======================================================== */
(function () {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animate(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1400;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) { io.observe(el); });
})();

/* ========================================================
   BACK TO TOP
   ======================================================== */
(function () {
  var btn = document.getElementById('backTop');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ========================================================
   LINK WHATSAPP (floating + CTA)
   ======================================================== */
(function () {
  var phone = '6282147975947';
  var msg = 'Assalamualaikum, saya ingin bertanya / berdonasi ke Yayasan Mustaqbal Lana.';
  var url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);

  var wa = document.getElementById('waFloat');
  if (wa) wa.href = url;

  var waDonasi = document.getElementById('donasiWa');
  if (waDonasi) waDonasi.href = url;
})();

/* ========================================================
   TAHUN FOOTER
   ======================================================== */
(function () {
  var yearEls = document.querySelectorAll('#year, .year');
  var year = new Date().getFullYear();
  yearEls.forEach(function (el) { el.textContent = year; });
})();

/* ========================================================
   GALERI — tab album + lightbox
   ======================================================== */
(function () {
  var grid = document.getElementById('galleryGrid');
  if (!grid) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll('.gallery-item'));
  var tabs = document.querySelectorAll('.tab-btn');
  var lightbox = document.getElementById('lightbox');

  // Tab filter
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      var album = tab.getAttribute('data-album');
      items.forEach(function (it) {
        it.style.display = (it.getAttribute('data-album') === album) ? '' : 'none';
      });
    });
  });

  if (!lightbox) return;

  var lbImg = document.getElementById('lbImg');
  var lbCaption = document.getElementById('lbCaption');
  var lbClose = document.getElementById('lbClose');
  var lastFocused = null;
  var visible = items.slice();
  var index = 0;

  function show(i) {
    if (!visible.length) return;
    index = (i + visible.length) % visible.length;
    var it = visible[index];
    var img = it.querySelector('img');
    lbImg.src = img.getAttribute('data-full') || img.src;
    lbImg.alt = img.alt || '';
    lbCaption.textContent = it.querySelector('.gallery-overlay p').textContent;
  }

  function open(it) {
    visible = items.filter(function (item) {
      return item.style.display !== 'none';
    });
    lastFocused = document.activeElement;
    show(visible.indexOf(it));
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  items.forEach(function (it) {
    it.addEventListener('click', function () { open(it); });
  });

  lbClose.addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function () { show(index - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(index + 1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();

/* ========================================================
   CONTACT FORM
   ======================================================== */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var feedback = document.getElementById('formFeedback');
  if (!feedback) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      var res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      var result = await res.json();
      if (result.success) {
        feedback.style.color = '#0f766e';
        feedback.textContent = '✅ Pesan berhasil dikirim. Terima kasih!';
        form.reset();
      } else {
        feedback.style.color = '#b91c1c';
        feedback.textContent = '❌ Gagal mengirim. Coba lagi nanti.';
      }
    } catch (err) {
      feedback.style.color = '#b91c1c';
      feedback.textContent = '❌ Terjadi kesalahan. Periksa koneksi Anda.';
    }
  });
})();

/* ========================================================
   DONATION FORM
   ======================================================== */
(function () {
  var form = document.getElementById('donasiForm');
  if (!form) return;

  var customInput = document.getElementById('customAmount');
  var feedback = document.getElementById('donasiFeedback');
  var modal = document.getElementById('donasiModal');

  function formatRupiah(n) {
    return 'Rp ' + Number(n || 0).toLocaleString('id-ID');
  }

  function currentAmount() {
    var preset = document.querySelector('input[name="amountPreset"]:checked');
    if (preset && preset.value === 'custom' && customInput.value) {
      return parseInt(customInput.value, 10) || 0;
    }
    return preset ? parseInt(preset.value, 10) || 0 : 0;
  }

  function currentProgram() {
    var el = document.querySelector('input[name="program"]:checked');
    return el ? el.value : '—';
  }

  function currentMethod() {
    var el = document.querySelector('input[name="method"]:checked');
    return el ? el.value : '—';
  }

  // Ringkasan donasi (sidebar)
  function updateSummary() {
    var amount = currentAmount();
    document.getElementById('sumProgram').textContent = currentProgram();
    document.getElementById('sumAmount').textContent = formatRupiah(amount);
    document.getElementById('sumMethod').textContent = currentMethod();
    document.getElementById('sumTotal').textContent = formatRupiah(amount);
  }

  // Pemilihan nominal (preset / custom)
  var amountPresets = document.querySelectorAll('input[name="amountPreset"]');
  for (var i = 0; i < amountPresets.length; i++) {
    amountPresets[i].addEventListener('change', function () {
      var checked = document.querySelector('input[name="amountPreset"]:checked');
      if (checked && checked.value === 'custom') {
        customInput.disabled = false;
        customInput.focus();
      } else {
        customInput.disabled = true;
        customInput.value = '';
      }
      updateSummary();
    });
  }
  customInput.addEventListener('input', updateSummary);

  // Tampilkan detail metode pembayaran sesuai pilihan
  var details = {
    'Transfer Bank': document.getElementById('detailBank'),
    'E-Wallet': document.getElementById('detailWallet'),
    'QRIS': document.getElementById('detailQris')
  };

  function showMethodDetail() {
    var name = currentMethod();
    for (var key in details) {
      if (details[key]) {
        details[key].hidden = (key !== name);
      }
    }
  }

  var methodInputs = document.querySelectorAll('input[name="method"]');
  for (var j = 0; j < methodInputs.length; j++) {
    methodInputs[j].addEventListener('change', function () {
      showMethodDetail();
      updateSummary();
    });
  }

  // Tombol salin nomor rekening / e-wallet
  var copyBtns = document.querySelectorAll('.donasi__copy');
  for (var k = 0; k < copyBtns.length; k++) {
    copyBtns[k].addEventListener('click', function () {
      var text = this.getAttribute('data-copy');
      var btn = this;
      function done() {
        btn.textContent = 'Tersalin ✓';
        setTimeout(function () { btn.textContent = 'Salin'; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
  }

  // Kirim donasi
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    var amount = currentAmount();
    if (!amount || amount < 10000) {
      feedback.style.color = '#b91c1c';
      feedback.textContent = '❌ Minimal donasi Rp 10.000.';
      return;
    }

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    if (!name || !email) {
      feedback.style.color = '#b91c1c';
      feedback.textContent = '❌ Mohon lengkapi nama dan email Anda.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.style.color = '#b91c1c';
      feedback.textContent = '❌ Format email tidak valid.';
      return;
    }

    var data = {
      name: name,
      email: email,
      phone: form.phone.value,
      program: currentProgram(),
      amount: amount,
      method: currentMethod(),
      message: form.message.value
    };

    feedback.style.color = '';
    feedback.textContent = '⏳ Mengirim donasi...';

    try {
      var res = await fetch('/api/donasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      var result = await res.json();

      if (result.success) {
        document.getElementById('modalId').textContent = result.id;
        document.getElementById('modalProgram').textContent = data.program;
        document.getElementById('modalAmount').textContent = formatRupiah(amount);
        document.getElementById('modalMethod').textContent = data.method;

        openModal();

        feedback.textContent = '';
        form.reset();
        customInput.value = '';
        customInput.disabled = true;
        showMethodDetail();
        updateSummary();
      } else {
        feedback.style.color = '#b91c1c';
        feedback.textContent = '❌ ' + (result.message || 'Gagal mengirim. Coba lagi nanti.');
      }
    } catch (err) {
      feedback.style.color = '#b91c1c';
      feedback.textContent = '❌ Terjadi kesalahan. Periksa koneksi Anda.';
    }
  });

  // Buka & tutup modal
  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  var closers = modal.querySelectorAll('[data-modal-close]');
  for (var m = 0; m < closers.length; m++) {
    closers[m].addEventListener('click', closeModal);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // Inisialisasi
  showMethodDetail();
  updateSummary();
})();
