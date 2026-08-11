# Yayasan Islam Bin Sef Al Khoiriyah — Website & Backend Admin

Website profil yayasan (HTML + CSS + JS murni, di-hosting di GitHub Pages) **plus backend admin**
(Node.js + Express) untuk mengelola **konten website**, **galeri foto**, **berita & pengumuman**, dan
**tampilan website** (warna tema, font, identitas/logo, bagian halaman) tanpa perlu menyentuh kode.

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

## 🌐 Deploy Live
Backend + panel admin saat ini berjalan di **https://yayasan-must-lana.vercel.app** (Vercel + Neon PostgreSQL).

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

## 🚀 Deploy Backend Online — Gratis, TANPA Kartu Kredit

Backend ini siap di-deploy ke **Vercel** (serverless, gratis) dengan database
**Neon PostgreSQL** (gratis). Keduanya **tidak memerlukan kartu kredit** untuk
daerah free tier. Situs publik tetap di GitHub Pages; hanya backend + database
 yang online 24/7.

### Arsitektur akhir

```
Situs publik (binsefalkhoiriyah.com)
   └─ GitHub Pages (folder public/)
        └─ content-loader.js → SITE_API_URL → Vercel API
                                              └─ Neon PostgreSQL
Backend + panel admin: https://<nama-app>.vercel.app/admin/
```

### Langkah 1 — Database PostgreSQL (Neon)

1. Daftar di [neon.tech](https://neon.tech) (free, tanpa kartu kredit).
2. **New Project** → pilih region terdekat → **Create**.
3. Salin **connection string**: dashboard → *Connection details* →
   **Pooled connection string** (host berakhiran `-pooler`, cocok untuk serverless).
   Bentuknya: `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`

### Langkah 2 — Deploy backend ke Vercel

Opsi A (paling mudah): **Import repo GitHub**
1. Buka [vercel.com/new](https://vercel.com/new), login (GitHub/email, tanpa kartu).
2. **Import** repo `YayasanMustLana` ini. Vercel otomatis mendeteksi Express
   (`server.js` mengekspor app → jadi satu serverless function).
3. Di **Settings → Environment Variables**, tambahkan:
   | Variabel | Nilai |
   |---|---|
   | `DATABASE_URL` | connection string Neon (*pooled*) |
   | `ADMIN_USERNAME` | username admin |
   | `ADMIN_PASSWORD` | password admin yang kuat |
   | `SESSION_SECRET` | string acak panjang |
   | `COOKIE_SECURE` | `true` |
   | `ALLOWED_ORIGIN` | `https://binsefalkhoiriyah.com` |
   | `PG_POOL_MAX` | `1` (tetap 1 utk aman di limit koneksi Neon free) |
4. **Deploy**. Setelah selesai dapat URL seperti `https://nama-app.vercel.app`.

Opsi B (CLI):
```bash
npx vercel login
npx vercel --prod   # dari folder proyek; ikuti petunjuk
```

### Langkah 3 — Hubungkan situs publik (GitHub Pages) ke API

Edit `public/site-config.js` di repo:
```js
window.SITE_API_URL = 'https://nama-app.vercel.app';
```
Commit → GitHub Pages ter-deploy ulang → situs mengambil konten & tampilan dari backend.
Jika API tidak tersedia, situs tetap tampil dengan konten statis bawaan (aman).

> 💡 Neon free tier menidurkan database setelah ±5 menit tidak dipakai;
> kunjungan pertama akan membutuhkan beberapa detik (cold start) — normal.

### Alternatif hosting lain

- **Render** (perlu kartu kredit saat daftar akun baru) — langkah lama ada di commit sebelumnya.
- **Koyeb / Fly.io / Railway** — free tier saat ini umumnya meminta kartu kredit.

## 🔐 Keamanan

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
| PUT | `/api/content` | admin | Simpan konten & pengaturan tampilan (`settings`/`social`) |
| POST/PUT/DELETE | `/api/gallery[/:id]` | admin | Kelola galeri |
| POST/PUT/DELETE | `/api/berita[/:id]` | admin | Kelola berita |

## 🎨 Kelola Tampilan Website (tab "Tampilan")

Admin dapat mengubah penampilan situs tanpa menyentuh CSS:

- **Identitas & merek** — nama yayasan, tagline, dan URL logo (navbar + footer).
- **Warna tema** — warna utama, utama-gelap, aksen, dan latar halaman (dengan pratinjau langsung).
- **Tipografi** — pilihan font utama (Plus Jakarta Sans, Poppins, Inter, Nunito Sans, Merriweather, Lora).
- **Tombol hero** — teks & tautan dua tombol di banner beranda.
- **Bagian halaman** — tampilkan/sembunyikan section (Tentang, Program, Video, Galeri, Berita, CTA Donasi).
- **Media sosial** — tautan Instagram, YouTube, Facebook, WhatsApp di footer.

Semua nilai disimpan di `settings` (dan `social`) pada konten backend; situs menerapkannya
melalui CSS variables di `public/content-loader.js`. Jika API tidak tersedia, situs memakai
tema bawaan di `public/styles.css`.

## 📝 Catatan

- `config.json` dipakai sebagai **data awal (seed)** saat database pertama kali dibuat.
- Folder `public/` adalah yang ter-deploy ke GitHub Pages (workflow `pages.yml`).
- Di Vercel, `express.static()` tidak dipakai untuk melayani file — situs publik
  memang di-deploy ke GitHub Pages, dan panel admin (`/admin`) dilayani lewat
  route eksplisit di `server.js`.
- File di root lama (`index.html`, `css/`, `js/`) adalah template versi lama yang
  tidak dipakai situs live; dibiarkan agar tidak mengganggu.
