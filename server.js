/* ==========================================================================
   BACKEND ADMIN — Yayasan Bin Sef Al Khoiriyah
   - Melayani situs publik (folder public/) dan panel admin (folder admin/)
   - REST API: konten website, galeri foto, berita & pengumuman
   - Login admin aman: username + password (bcrypt) + sesi cookie
   - Storage: PostgreSQL (DATABASE_URL) atau file JSON lokal
   ========================================================================== */

const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
const storage = require('./storage');

const app = express();
const PORT = process.env.PORT || 3002;

app.set('trust proxy', 1);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

/* ------------------------------------------------------------------
   SESI ADMIN
   ------------------------------------------------------------------ */
app.use(
  session({
    name: 'yayasan_admin_sid',
    secret: process.env.SESSION_SECRET || 'dev-session-secret-ganti-segera',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true', // aktifkan (true) saat deploy HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 hari
    }
  })
);

/* ------------------------------------------------------------------
   PELINDUNG LOGIN SEDERHANA — batasi percobaan gagal per IP
   ------------------------------------------------------------------ */
const loginAttempts = {};

function loginBlocked(ip) {
  const rec = loginAttempts[ip];
  return !!(rec && rec.until > Date.now());
}

function recordLoginFail(ip) {
  const now = Date.now();
  const rec = loginAttempts[ip] || { count: 0, until: 0 };
  rec.count += 1;
  if (rec.count >= 10) {
    rec.until = now + 15 * 60 * 1000; // kunci 15 menit setelah 10x gagal
    rec.count = 0;
  }
  loginAttempts[ip] = rec;
}

/* ------------------------------------------------------------------
   CORS — izinkan situs statis (GitHub Pages) membaca API publik
   ------------------------------------------------------------------ */
app.use('/api', (req, res, next) => {
  const allowed = process.env.ALLOWED_ORIGIN;
  res.setHeader('Access-Control-Allow-Origin', allowed || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Header credentials hanya dikirim bila origin eksplisit (tidak valid dengan '*').
  if (allowed) res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ------------------------------------------------------------------
   KREDENSIAL ADMIN
   ------------------------------------------------------------------ */
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || null;

if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) {
  console.warn('⚠  Gunakan username "admin" / password "admin123" (mode pengembangan).');
  console.warn('    Di produksi, set env ADMIN_PASSWORD (atau ADMIN_PASSWORD_HASH).');
}

function checkPassword(pw) {
  if (ADMIN_PASSWORD_HASH) return bcrypt.compareSync(pw || '', ADMIN_PASSWORD_HASH);
  return (pw || '') === ADMIN_PASSWORD;
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  const wantsHtml = /\.html?$/.test(req.path) || req.path === '/' || req.path === '';
  if (wantsHtml) return res.redirect('/admin/');
  return res.status(401).json({ error: 'Sesi tidak valid. Silakan login kembali.' });
}

/* ------------------------------------------------------------------
   AUTH ROUTES
   ------------------------------------------------------------------ */
app.post('/api/login', (req, res) => {
  const ip = req.ip || 'unknown';
  if (loginBlocked(ip)) {
    return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi 15 menit lagi.' });
  }

  const { username, password } = req.body || {};
  if (username === ADMIN_USERNAME && checkPassword(password)) {
    delete loginAttempts[ip];
    // Regenerasi ID sesi untuk mencegah session fixation
    return req.session.regenerate(function (err) {
      if (err) return res.status(500).json({ error: 'Terjadi kesalahan pada sesi.' });
      req.session.admin = true;
      res.json({ success: true });
    });
  }
  recordLoginFail(ip);
  res.status(401).json({ error: 'Username atau password salah.' });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

app.get('/api/session', (req, res) => {
  res.json({ authed: !!(req.session && req.session.admin) });
});

/* ------------------------------------------------------------------
   API PUBLIK (dibaca situs)
   ------------------------------------------------------------------ */
app.get('/api/site', async (req, res) => {
  try {
    res.json(await storage.getSite());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gagal membaca data.' });
  }
});

app.get('/api/content', async (req, res) => {
  try {
    res.json(await storage.getContent());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gagal membaca konten.' });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    res.json(await storage.getGallery());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gagal membaca galeri.' });
  }
});

app.get('/api/berita', async (req, res) => {
  try {
    res.json(await storage.getBerita());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gagal membaca berita.' });
  }
});

/* ------------------------------------------------------------------
   API ADMIN (perlu login)
   ------------------------------------------------------------------ */
app.put('/api/content', requireAdmin, async (req, res) => {
  try {
    await storage.saveContent(req.body || {});
    res.json({ success: true, message: 'Konten berhasil disimpan.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gagal menyimpan konten.' });
  }
});

app.post('/api/gallery', requireAdmin, async (req, res) => {
  try {
    const item = await storage.addGalleryItem(req.body || {});
    res.json({ success: true, item });
  } catch (e) {
    res.status(400).json({ error: e.message || 'Gagal menambah foto.' });
  }
});

app.put('/api/gallery/:id', requireAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    if (body.src != null && !String(body.src).trim()) {
      return res.status(400).json({ error: 'URL foto tidak boleh kosong.' });
    }
    const item = await storage.updateGalleryItem(req.params.id, body);
    if (!item) return res.status(404).json({ error: 'Foto tidak ditemukan.' });
    res.json({ success: true, item });
  } catch (e) {
    res.status(400).json({ error: e.message || 'Gagal mengubah foto.' });
  }
});

app.delete('/api/gallery/:id', requireAdmin, async (req, res) => {
  try {
    await storage.deleteGalleryItem(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Gagal menghapus foto.' });
  }
});

app.post('/api/berita', requireAdmin, async (req, res) => {
  try {
    const item = await storage.addBerita(req.body || {});
    res.json({ success: true, item });
  } catch (e) {
    res.status(400).json({ error: e.message || 'Gagal menambah berita.' });
  }
});

app.put('/api/berita/:id', requireAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    if (body.title != null && !String(body.title).trim()) {
      return res.status(400).json({ error: 'Judul berita tidak boleh kosong.' });
    }
    const item = await storage.updateBerita(req.params.id, body);
    if (!item) return res.status(404).json({ error: 'Berita tidak ditemukan.' });
    res.json({ success: true, item });
  } catch (e) {
    res.status(400).json({ error: e.message || 'Gagal mengubah berita.' });
  }
});

app.delete('/api/berita/:id', requireAdmin, async (req, res) => {
  try {
    await storage.deleteBerita(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Gagal menghapus berita.' });
  }
});

/* ------------------------------------------------------------------
   PANEL ADMIN (dashboard hanya untuk yang sudah login)
   ------------------------------------------------------------------ */
app.get('/admin/dashboard.html', requireAdmin);
app.use('/admin', express.static(path.join(__dirname, 'admin')));

/* ------------------------------------------------------------------
   SITUS PUBLIK
   ------------------------------------------------------------------ */
app.use(express.static(path.join(__dirname, 'public')));

/* ------------------------------------------------------------------
   START
   ------------------------------------------------------------------ */
storage.init().then(() => {
  app.listen(PORT, () => {
    console.log('==========================================================');
    console.log('🚀 Backend Admin Yayasan Bin Sef Al Khoiriyah berjalan di:');
    console.log(`   http://localhost:${PORT}         (situs publik)`);
    console.log(`   http://localhost:${PORT}/admin/  (panel admin)`);
    console.log('==========================================================');
  });
}).catch((e) => {
  console.error('❌ Gagal menginisialisasi storage:', e);
  process.exit(1);
});
