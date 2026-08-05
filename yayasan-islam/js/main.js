/* ==========================================================================
   Yayasan Islam Mustaqbal Lana — interaksi halaman + config.json loader
   ========================================================================== */

/* ======================================================================
   0. LOAD CONFIG.JSON (menggantikan hardcode)
   ====================================================================== */
let CONFIG = {};

(async function loadSiteConfig() {
  try {
    const res = await fetch('config.json');
    CONFIG = await res.json();
    console.log('✅ Config loaded:', CONFIG);
    applyConfig();
  } catch(e) {
    console.warn('⚠ Gagal load config.json, pakai fallback.', e);
  }
})();

function applyConfig() {
  // Hero
  const h1 = document.querySelector('.hero-title');
  if (h1 && CONFIG.hero) {
    const t = CONFIG.hero.title || h1.textContent;
    h1.innerHTML = t;
  }
  const heroSub = document.querySelector('.hero-sub');
  if (heroSub && CONFIG.hero) heroSub.textContent = CONFIG.hero.subtitle || heroSub.textContent;

  // Stats
  if (CONFIG.stats) {
    document.querySelectorAll('[data-count]').forEach(el => {
      if (el.closest('.stat:nth-child(1)') && CONFIG.stats.years) el.dataset.count = CONFIG.stats.years;
      if (el.closest('.stat:nth-child(2)') && CONFIG.stats.santri) el.dataset.count = CONFIG.stats.santri;
      if (el.closest('.stat:nth-child(3)') && CONFIG.stats.relawan) el.dataset.count = CONFIG.stats.relawan;
      if (el.closest('.stat:nth-child(4)') && CONFIG.stats.programs) el.dataset.count = CONFIG.stats.programs;
    });
  }

  // Videos
  if (CONFIG.videos) {
    const featuredVideo = CONFIG.videos.find(v => v.featured) || CONFIG.videos[0];
    const sideVideos = CONFIG.videos.filter(v => !v.featured).slice(0, 2);
    const iframes = document.querySelectorAll('#video iframe');
    if (featuredVideo && iframes[0]) {
      iframes[0].src = `https://www.youtube-nocookie.com/embed/${featuredVideo.youtube_id}`;
    }
    sideVideos.forEach((v, i) => {
      if (iframes[i+1]) iframes[i+1].src = `https://www.youtube-nocookie.com/embed/${v.youtube_id}`;
    });
  }

  // Gallery — load dari config
  if (CONFIG.gallery) {
    window.ALBUMS = CONFIG.gallery;
  }

  // WhatsApp
  if (CONFIG.contact) {
    const waNum = CONFIG.contact.whatsapp || '6282147975947';
    const waMsg = CONFIG.contact.whatsapp_message || "Assalamu'alaikum, saya ingin bertanya/donasi ke Yayasan Mustaqbal Lana.";
    const waLink = `https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}`;
    const waFloat = document.querySelector('#waFloat');
    const donasiWa = document.querySelector('#donasiWa');
    if (waFloat) waFloat.href = waLink;
    if (donasiWa) donasiWa.href = waLink;
  }
}

/* ======================================================================
   1. KONFIGURASI KONTEN (fallback)
   ====================================================================== */
const WHATSAPP_NUMBER = "6282147975947";
const WHATSAPP_MESSAGE = "Assalamu'alaikum, saya ingin bertanya/donasi ke Yayasan Mustaqbal Lana.";

const ALBUMS_FALLBACK = {
  sosial: [
    { src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=70", caption: "Santunan anak yatim — Ramadan 1447 H", tag: "Kemanusiaan" },
    { src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=70", caption: "Distribusi paket sembako untuk warga dhuafa", tag: "Sosial" },
    { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=70", caption: "Aksi relawan membantu korban banjir", tag: "Tanggap Bencana" },
    { src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=900&q=70", caption: "Kegiatan penghijauan bersama masyarakat", tag: "Lingkungan" },
    { src: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=900&q=70", caption: "Buka puasa bersama anak yatim dan dhuafa", tag: "Ramadan" },
    { src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=70", caption: "Kunjungan peduli ke panti asuhan", tag: "Kemanusiaan" }
  ],
  santri: [
    { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=70", caption: "Santri belajar bersama di ruang kelas", tag: "Pendidikan" },
    { src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=70", caption: "Suasana pembelajaran tahfizh Al-Qur'an", tag: "Tahfizh" },
    { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=70", caption: "Praktik mengajar di madrasah diniyah", tag: "Madrasah" },
    { src: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=900&q=70", caption: "Santri berdiskusi setelah salat berjamaah", tag: "Pembinaan" },
    { src: "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?auto=format&fit=crop&w=900&q=70", caption: "Kegiatan outbound dan permainan edukatif", tag: "Kreativitas" },
    { src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=70", caption: "Pekan literasi santri di perpustakaan", tag: "Literasi" }
  ]
};

// Gunakan config jika ada, fallback ke hardcode
window.ALBUMS = window.ALBUMS || ALBUMS_FALLBACK;

/* ======================================================================
   2. UTILITAS
   ====================================================================== */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ======================================================================
   3. NAVBAR — bayangan saat scroll + menu mobile
   ====================================================================== */
const navbar = $("#navbar");
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

const onScroll = () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
  $("#backTop").classList.toggle("is-visible", window.scrollY > 480);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const closeMenu = () => {
  navLinks.classList.remove("is-open");
  navToggle.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
});

// Tutup menu saat link diklik
$$(".nav-link", navLinks).forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("click", (e) => {
  if (navLinks.classList.contains("is-open") && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
    closeMenu();
  }
});

/* ======================================================================
   4. ANIMASI ANGKA (statistik)
   ====================================================================== */
const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10) || 0;
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(target * eased).toLocaleString("id-ID");
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

/* ======================================================================
   5. GALERI — render album, tab, dan lightbox
   ====================================================================== */
const galleryGrid = $("#galleryGrid");
const lightbox = $("#lightbox");
const lbImg = $("#lbImg");
const lbCaption = $("#lbCaption");

let currentAlbum = "sosial";
let currentIndex = 0;

// Fallback otomatis jika foto galeri gagal dimuat di lightbox
lbImg.onerror = function () {
  this.onerror = null;
  this.src = "https://picsum.photos/seed/lb" + currentAlbum + currentIndex + "/900/675";
};

const getAlbums = () => window.ALBUMS || ALBUMS_FALLBACK;

const renderGallery = (albumKey) => {
  const items = getAlbums()[albumKey];
  if (!items) return;
  currentAlbum = albumKey;
  galleryGrid.innerHTML = items
    .map(
      (item, i) => `
      <figure class="gallery-item" data-index="${i}" tabindex="0" role="button"
              aria-label="Lihat foto: ${item.caption}">
        <img src="${item.src}" alt="${item.caption}"
             loading="lazy"
             onerror="this.onerror=null;this.src='https://picsum.photos/seed/g${albumKey}${i}/800/600'" />
        <figcaption class="gallery-overlay">
          <span>${item.tag}</span>
          <p>${item.caption}</p>
        </figcaption>
      </figure>`
    )
    .join("");
};

const openLightbox = (index) => {
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add("is-open");
  document.body.style.overflow = "hidden";
  $("#lbClose").focus();
};

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  document.body.style.overflow = "";
};

const updateLightbox = () => {
  const items = getAlbums()[currentAlbum];
  const item = items[currentIndex];
  lbImg.src = item.src;
  lbImg.alt = item.caption;
  lbCaption.textContent = `${currentIndex + 1} / ${items.length} — ${item.caption}`;
};

const step = (dir) => {
  const items = getAlbums()[currentAlbum];
  currentIndex = (currentIndex + dir + items.length) % items.length;
  updateLightbox();
};

// Tab galeri
$$(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".tab-btn").forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", String(b === btn));
    });
    renderGallery(btn.dataset.album);
  });
});

// Buka lightbox dari grid (klik / keyboard)
galleryGrid.addEventListener("click", (e) => {
  const item = e.target.closest(".gallery-item");
  if (item) openLightbox(Number(item.dataset.index));
});
galleryGrid.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const item = e.target.closest(".gallery-item");
  if (item) { e.preventDefault(); openLightbox(Number(item.dataset.index)); }
});

// Kontrol lightbox
$("#lbClose").addEventListener("click", closeLightbox);
$("#lbPrev").addEventListener("click", () => step(-1));
$("#lbNext").addEventListener("click", () => step(1));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

// Render awal
renderGallery("sosial");

/* ======================================================================
   6. REVEAL ON SCROLL
   ====================================================================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

$$(".reveal").forEach((el) => revealObserver.observe(el));

// Jalankan animasi angka saat statistik terlihat
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        $$("[data-count]", entry.target).forEach(animateCount);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);
statsObserver.observe($(".hero-stats"));

/* ======================================================================
   8. BACK TO TOP
   ====================================================================== */
$("#backTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ======================================================================
   9. WHATSAPP
   ====================================================================== */
const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
$("#waFloat").href = waLink;
$("#donasiWa").href = waLink;

/* ======================================================================
   10. TAHUN SAAT INI DI FOOTER
   ====================================================================== */
$("#year").textContent = new Date().getFullYear();
