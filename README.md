# Yayasan Islam Bin Sef Al Khoiriyah — Website & Backend Admin

Website profil yayasan (HTML + CSS + JS murni, di-hosting di GitHub Pages) **plus backend admin**
(Node.js + Express) untuk mengelola **konten website**, **galeri foto**, dan **berita & pengumuman**
tanpa perlu menyentuh kode.

---

## 🗂 Struktur

```
├── public/            → situs publik (di-deploy ke GitHub Pages)
│   ├── index.html     → halaman depan (hero, tentang, program, video, galeri, berita, kontak)
│   ├── tentang.html / program.html / kontak.html / donasi.html
│   ├── styles.css / script.js
│   ├── content-loader.js  → ambil konten dari API backend & terapkan ke halaman
│   └── site-config.js     → setel URL API backend (window.SITE_API_URL)
├── admin/             → panel admin (login + dashboard), dilayani backend
│   ├── index.html     → halaman login
│   ├── dashboard.html → kelola konten, galeri, berita
│   └── admin.css / admin.js / dashboard.js
├── server.js          → backend Express: API + auth + serve situs & admin
├── storage.js         → penyimpanan (PostgreSQL produksi / file JSON lokal)
├── config.json        → data awal (seed) konten situs
└── .env.example       → contoh konfigurasi environment
```

## ▶️ Menjalankan di komputer (lokal)

```bash
npm install
npm start        # atau: npm run dev (nodemon)
```

Lalu buka:
- Situs publik: http://localhost:3002
- Panel admin:  http://localhost:3002/admin/
- Login default (mode pengembangan): **admin / admin123**

Tanpa database, data tersimpan di file `data/db.json` (otomatis dibuat & di-ignore git).

## 🚀 Deploy Backend Online (gratis)

Backend perlu hosting yang mendukung Node.js. Langkah rekomendasi:

1. **Database PostgreSQL gratis** → buat proyek di [Neon](https://neon.tech)
   (atau Supabase), salin **connection string** (`postgresql://...`).
2. **Hosting backend** → buat akun di [Render](https://render.com), lalu
   **New → Web Service**, hubungkan repo GitHub ini.
   - Build command: `npm install`
   - Start command: `node server.js`
3. **Environment variables** di dashboard Render:
   | Variabel | Nilai |
   |---|---|
   | `DATABASE_URL` | connection string Neon (Postgres) |
   | `ADMIN_USERNAME` | username admin |
   | `ADMIN_PASSWORD` | password admin yang kuat |
   | `SESSION_SECRET` | string acak panjang |
   | `ALLOWED_ORIGIN` | `https://binsefalkhoiriyah.com` |
   - Render otomatis mengisi `PORT`.

4. **Hubungkan situs publik (GitHub Pages) ke API**:
   Edit `public/site-config.js` di repo:
   ```js
   window.SITE_API_URL = 'https://nama-backend-anda.onrender.com';
   ```
   Commit → GitHub Pages ter-deploy ulang → situs mengambil konten dari backend.
   Jika API tidak tersedia, situs tetap tampil dengan konten statis bawaan (aman).

> 💡 Render versi gratis mematikan layanan setelah ~15 menit tidak aktif;
> kunjungan pertama akan membutuhkan beberapa detik (cold start).

## 🔐 Keamanan

- Password admin TIDAK disimpan di file publik; gunakan env `ADMIN_PASSWORD`
  (atau `ADMIN_PASSWORD_HASH` untuk hash bcrypt).
- Sesi admin memakai cookie httpOnly; dashboard hanya bisa diakses setelah login.
- Endpoint tulis (`PUT/POST/DELETE`) hanya bisa dipanggil dengan sesi admin valid.
- Ganti nilai default `admin/admin123` dan `SESSION_SECRET` saat deploy.

## 🧩 API Ringkas

| Method | Path | Akses | Fungsi |
|---|---|---|---|
| GET | `/api/site` | publik | Konten + galeri + berita (dipakai situs) |
| GET | `/api/content` · `/api/gallery` · `/api/berita` | publik | Baca per-bagian |
| POST | `/api/login` · `/api/logout` | publik | Login / logout admin |
| GET | `/api/session` | publik | Cek status login |
| PUT | `/api/content` | admin | Simpan konten |
| POST/PUT/DELETE | `/api/gallery[/:id]` | admin | Kelola galeri |
| POST/PUT/DELETE | `/api/berita[/:id]` | admin | Kelola berita |

## 📝 Catatan

- `config.json` dipakai sebagai **data awal (seed)** saat database pertama kali dibuat.
- Folder `public/` adalah yang ter-deploy ke GitHub Pages (workflow `pages.yml`).
- File di root lama (`index.html`, `css/`, `js/`) adalah template versi lama yang
  tidak dipakai situs live; dibiarkan agar tidak mengganggu.
