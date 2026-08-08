/* ==========================================================================
   STORAGE — lapisan penyimpanan backend admin
   - Mode Postgres (produksi):  dipakai jika env DATABASE_URL diisi
   - Mode JSON file (lokal):    dipakai untuk uji coba tanpa database
   Data awal (seed) diambil dari config.json (konten situs saat ini).
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

let DEFAULTS = {};
try {
  DEFAULTS = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.warn('⚠ config.json tidak terbaca, seed memakai konten kosong.', e.message);
}

function usePostgres() {
  return !!process.env.DATABASE_URL;
}

/* ------------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------------ */

// Konten default dari config.json (tanpa admin_password — sistem baru
// memakai username/password dari environment, bukan dari file publik).
function defaultContent() {
  const c = JSON.parse(JSON.stringify(DEFAULTS));
  delete c.admin_password;
  return c;
}

// Galeri default: config.json menyimpan { sosial: [], santri: [] } →
// di-flatten menjadi array item dengan field album.
function defaultGallery() {
  const out = [];
  const g = (DEFAULTS.gallery && typeof DEFAULTS.gallery === 'object') ? DEFAULTS.gallery : {};
  Object.keys(g).forEach((album) => {
    (Array.isArray(g[album]) ? g[album] : []).forEach((it, i) => {
      out.push({
        id: out.length + 1,
        album,
        src: it.src || '',
        caption: it.caption || '',
        tag: it.tag || '',
        ord: i
      });
    });
  });
  return out;
}

/* ------------------------------------------------------------------
   MODE JSON FILE (lokal)
   ------------------------------------------------------------------ */

let jsonCache = null;

function loadJson() {
  if (jsonCache) return jsonCache;
  try {
    jsonCache = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    jsonCache = null;
  }
  if (!jsonCache) {
    jsonCache = {
      content: defaultContent(),
      gallery: defaultGallery(),
      berita: []
    };
    saveJson();
  }
  return jsonCache;
}

function saveJson() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(jsonCache, null, 2), 'utf8');
}

/* ------------------------------------------------------------------
   MODE POSTGRES (produksi)
   ------------------------------------------------------------------ */

let pool = null;

function getPool() {
  if (!pool) {
    const { Pool } = require('pg');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

async function initPg() {
  const sql = `
    CREATE TABLE IF NOT EXISTS cms_content (
      id  INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      data JSONB NOT NULL
    );
    CREATE TABLE IF NOT EXISTS cms_gallery (
      id      SERIAL PRIMARY KEY,
      album   TEXT NOT NULL,
      src     TEXT NOT NULL,
      caption TEXT NOT NULL DEFAULT '',
      tag     TEXT NOT NULL DEFAULT '',
      ord     INT  NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS cms_berita (
      id         SERIAL PRIMARY KEY,
      title      TEXT NOT NULL,
      body       TEXT NOT NULL DEFAULT '',
      date       TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  await getPool().query(sql);

  // Seed konten jika belum ada
  const row = await getPool().query('SELECT 1 FROM cms_content WHERE id = 1');
  if (row.rowCount === 0) {
    await getPool().query(
      'INSERT INTO cms_content (id, data) VALUES (1, $1)',
      [JSON.stringify(defaultContent())]
    );
  }
  const gal = await getPool().query('SELECT 1 FROM cms_gallery LIMIT 1');
  if (gal.rowCount === 0) {
    const items = defaultGallery();
    for (const it of items) {
      await getPool().query(
        'INSERT INTO cms_gallery (album, src, caption, tag, ord) VALUES ($1,$2,$3,$4,$5)',
        [it.album, it.src, it.caption, it.tag, it.ord]
      );
    }
  }
}

/* ------------------------------------------------------------------
   ANTARMUKA UMUM
   ------------------------------------------------------------------ */

async function getContent() {
  if (usePostgres()) {
    const r = await getPool().query('SELECT data FROM cms_content WHERE id = 1');
    return (r.rows[0] && r.rows[0].data) || defaultContent();
  }
  return loadJson().content;
}

async function saveContent(obj) {
  // Gabungkan dengan konten lama agar update parsial tidak menghapus bagian lain
  const existing = await getContent();
  const merged = Object.assign({}, existing, obj && typeof obj === 'object' ? obj : {});
  if (usePostgres()) {
    await getPool().query(
      `INSERT INTO cms_content (id, data) VALUES (1, $1)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [JSON.stringify(merged)]
    );
    return;
  }
  const db = loadJson();
  db.content = merged;
  saveJson();
}

async function getGallery() {
  if (usePostgres()) {
    const r = await getPool().query('SELECT * FROM cms_gallery ORDER BY album, ord, id');
    return r.rows.map((row) => ({
      id: row.id,
      album: row.album,
      src: row.src,
      caption: row.caption,
      tag: row.tag,
      ord: row.ord
    }));
  }
  return loadJson().gallery.slice();
}

async function addGalleryItem(item) {
  const album = String(item.album || 'sosial');
  const src = String(item.src || '').trim();
  if (!src) throw new Error('URL foto tidak boleh kosong');
  const caption = String(item.caption || '');
  const tag = String(item.tag || '');

  if (usePostgres()) {
    const r = await getPool().query(
      `INSERT INTO cms_gallery (album, src, caption, tag, ord)
       VALUES ($1,$2,$3,$4, COALESCE((SELECT MAX(ord) FROM cms_gallery WHERE album=$1),0)+1)
       RETURNING *`,
      [album, src, caption, tag]
    );
    const row = r.rows[0];
    return { id: row.id, album: row.album, src: row.src, caption: row.caption, tag: row.tag, ord: row.ord };
  }

  const db = loadJson();
  const id = db.gallery.reduce((m, g) => Math.max(m, g.id || 0), 0) + 1;
  const ord = db.gallery.filter((g) => g.album === album).length;
  const newItem = { id, album, src, caption, tag, ord };
  db.gallery.push(newItem);
  saveJson();
  return newItem;
}

async function updateGalleryItem(id, patch) {
  const targetId = Number(id);
  if (usePostgres()) {
    const fields = [];
    const vals = [];
    if (patch.album != null) { fields.push('album = $' + (vals.length + 1)); vals.push(String(patch.album)); }
    if (patch.src != null) { fields.push('src = $' + (vals.length + 1)); vals.push(String(patch.src)); }
    if (patch.caption != null) { fields.push('caption = $' + (vals.length + 1)); vals.push(String(patch.caption)); }
    if (patch.tag != null) { fields.push('tag = $' + (vals.length + 1)); vals.push(String(patch.tag)); }
    if (!fields.length) throw new Error('Tidak ada field untuk diubah');
    vals.push(targetId);
    const r = await getPool().query(
      `UPDATE cms_gallery SET ${fields.join(', ')} WHERE id = $${vals.length} RETURNING *`,
      vals
    );
    return r.rows[0] ? {
      id: r.rows[0].id, album: r.rows[0].album, src: r.rows[0].src,
      caption: r.rows[0].caption, tag: r.rows[0].tag, ord: r.rows[0].ord
    } : null;
  }

  const db = loadJson();
  const item = db.gallery.find((g) => g.id === targetId);
  if (!item) return null;
  if (patch.album != null) item.album = String(patch.album);
  if (patch.src != null) item.src = String(patch.src);
  if (patch.caption != null) item.caption = String(patch.caption);
  if (patch.tag != null) item.tag = String(patch.tag);
  saveJson();
  return item;
}

async function deleteGalleryItem(id) {
  const targetId = Number(id);
  if (usePostgres()) {
    await getPool().query('DELETE FROM cms_gallery WHERE id = $1', [targetId]);
    return;
  }
  const db = loadJson();
  db.gallery = db.gallery.filter((g) => g.id !== targetId);
  saveJson();
}

async function getBerita() {
  if (usePostgres()) {
    const r = await getPool().query('SELECT * FROM cms_berita ORDER BY created_at DESC, id DESC');
    return r.rows.map((row) => ({ id: row.id, title: row.title, body: row.body, date: row.date }));
  }
  return loadJson().berita.slice().sort((a, b) => (b.id || 0) - (a.id || 0));
}

async function addBerita(item) {
  const title = String(item.title || '').trim();
  if (!title) throw new Error('Judul berita tidak boleh kosong');
  const body = String(item.body || '');
  const date = String(item.date || '');

  if (usePostgres()) {
    const r = await getPool().query(
      'INSERT INTO cms_berita (title, body, date) VALUES ($1,$2,$3) RETURNING *',
      [title, body, date]
    );
    const row = r.rows[0];
    return { id: row.id, title: row.title, body: row.body, date: row.date };
  }

  const db = loadJson();
  const id = db.berita.reduce((m, b) => Math.max(m, b.id || 0), 0) + 1;
  const itemOut = { id, title, body, date, created_at: new Date().toISOString() };
  db.berita.push(itemOut);
  saveJson();
  return { id, title, body, date };
}

async function updateBerita(id, patch) {
  const targetId = Number(id);
  if (usePostgres()) {
    const fields = [];
    const vals = [];
    if (patch.title != null) { fields.push('title = $' + (vals.length + 1)); vals.push(String(patch.title)); }
    if (patch.body != null) { fields.push('body = $' + (vals.length + 1)); vals.push(String(patch.body)); }
    if (patch.date != null) { fields.push('date = $' + (vals.length + 1)); vals.push(String(patch.date)); }
    if (!fields.length) throw new Error('Tidak ada field untuk diubah');
    vals.push(targetId);
    const r = await getPool().query(
      `UPDATE cms_berita SET ${fields.join(', ')} WHERE id = $${vals.length} RETURNING *`,
      vals
    );
    return r.rows[0] ? { id: r.rows[0].id, title: r.rows[0].title, body: r.rows[0].body, date: r.rows[0].date } : null;
  }

  const db = loadJson();
  const item = db.berita.find((b) => b.id === targetId);
  if (!item) return null;
  if (patch.title != null) item.title = String(patch.title);
  if (patch.body != null) item.body = String(patch.body);
  if (patch.date != null) item.date = String(patch.date);
  saveJson();
  return { id: item.id, title: item.title, body: item.body, date: item.date };
}

async function deleteBerita(id) {
  const targetId = Number(id);
  if (usePostgres()) {
    await getPool().query('DELETE FROM cms_berita WHERE id = $1', [targetId]);
    return;
  }
  const db = loadJson();
  db.berita = db.berita.filter((b) => b.id !== targetId);
  saveJson();
}

/* ------------------------------------------------------------------
   INISIALISASI
   ------------------------------------------------------------------ */

async function init() {
  if (usePostgres()) {
    await initPg();
    console.log('🗄  Storage: PostgreSQL terhubung.');
  } else {
    loadJson();
    console.log('🗄  Storage: file JSON lokal (data/db.json). Isi DATABASE_URL untuk memakai Postgres.');
  }
}

module.exports = {
  usePostgres,
  init,
  getContent,
  saveContent,
  getGallery,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getBerita,
  addBerita,
  updateBerita,
  deleteBerita,
  getSite: async function () {
    const [content, gallery, berita] = await Promise.all([
      getContent(),
      getGallery(),
      getBerita()
    ]);
    return { content, gallery, berita };
  }
};
