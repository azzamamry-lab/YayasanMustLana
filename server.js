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
const fs = require('fs');
const bcrypt = require('bcryptjs');
const storage = require('./storage');

/* ------------------------------------------------------------------
   PENYIMPANAN SESI
   - Produksi (DATABASE_URL terisi): sesi disimpan di PostgreSQL via
     connect-pg-simple, sehingga login tetap bertahan walau server
     tidur/bangun ulang di hosting gratis (Koyeb/Render).
   - Lokal (tanpa DATABASE_URL): memori saja, sesuai uji coba JSON.
   ------------------------------------------------------------------ */
let sessionStore;
if (process.env.DATABASE_URL) {
  const pgSession = require('connect-pg-simple')(session);
  const { Pool } = require('pg');
  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: Number(process.env.PG_POOL_MAX || 1),
    connectionTimeoutMillis: 10000
  });
  sessionStore = new pgSession({
    pool: pgPool,
    tableName: 'session',
    createTableIfMissing: true
  });
}

const app = express();
const PORT = process.env.PORT || 3002;

app.set('trust proxy', 1);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

/* ------------------------------------------------------------------
   PASTIKAN STORAGE SIAP — penting di serverless (Vercel): saat cold
   start, inisialisasi tabel & seed berjalan otomatis sebelum request
   diproses. Idempoten, aman dipanggil di setiap request.
   ------------------------------------------------------------------ */
let storageReady = null;
app.use((req, res, next) => {
  if (!storageReady) {
    storageReady = storage.init().catch((e) => {
      storageReady = null; // izinkan coba lagi di request berikutnya
      throw e;
    });
  }
  storageReady.then(() => next(), (e) => {
    console.error('❌ Inisialisasi storage gagal:', e && e.message);
    res.status(500).json({ error: 'Penyimpanan belum siap. Coba lagi sebentar.' });
  });
});

/* ------------------------------------------------------------------
   SESI ADMIN
   ------------------------------------------------------------------ */
app.use(
  session({
    name: 'yayasan_admin_sid',
    secret: process.env.SESSION_SECRET || 'dev-session-secret-ganti-segera',
    store: sessionStore,
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

// Admin statis dilayani manual — di Vercel, express.static() diabaikan
// (static hanya dari folder public/), jadi file panel dibaca dari disk.
const adminDir = path.join(__dirname, 'admin');
const ADMIN_MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};
// Normalisasi /admin → /admin/ agar path relatif CSS/JS selalu benar
// (akses /admin tanpa slash membuat browser mencari aset di /admin.css → 404)
app.use('/admin', (req, res, next) => {
  if (req.path === '/' && !req.originalUrl.endsWith('/')) {
    return res.redirect(301, '/admin/');
  }
  next();
});

app.use('/admin', (req, res, next) => {
  const rel = req.path === '/' ? 'index.html' : req.path.replace(/^\/+/, '');
  const file = path.resolve(adminDir, rel);
  // Cegah path traversal keluar dari folder admin
  if (file !== adminDir && !file.startsWith(adminDir + path.sep)) {
    return res.status(403).send('Forbidden');
  }
  fs.readFile(file, (err, data) => {
    if (err) return res.status(404).send('Halaman tidak ditemukan');
    res.setHeader('Content-Type', ADMIN_MIME[path.extname(file).toLowerCase()] || 'application/octet-stream');
    res.send(data);
  });
});

/* ------------------------------------------------------------------
   SITUS PUBLIK
   - Vercel mengabaikan express.static() (statis ditangani CDN), jadi
     halaman utama dilayani manual dari disk agar aman di kedua mode.
   ------------------------------------------------------------------ */
app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
    if (err) return res.status(404).send('Halaman tidak ditemukan');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(data);
  });
});

app.use(express.static(path.join(__dirname, 'public')));

/* ------------------------------------------------------------------
   ERROR HANDLER GLOBAL — pastikan error apa pun tidak mematikan
   function (hindari FUNCTION_INVOCATION_FAILED di Vercel).
   ------------------------------------------------------------------ */
app.use((err, req, res, next) => {
  console.error('❌ Error tidak tertangani:', err && err.message);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Terjadi kesalahan internal server.' });
});

/* ------------------------------------------------------------------
   START — hanya saat dijalankan langsung (node server.js)
   Di Vercel (serverless), file ini cukup diekspor sebagai handler.
   ------------------------------------------------------------------ */
if (!process.env.VERCEL && require.main === module) {
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
}

module.exports = app;
