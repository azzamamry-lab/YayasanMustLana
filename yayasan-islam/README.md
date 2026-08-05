# Yayasan Islam Al-Hidayah — Landing Page (Demo)

Landing page statis untuk profil yayasan islam: pendidikan, kegiatan sosial, dan pembinaan santri.
Murni **HTML + CSS + JavaScript** — tanpa framework, tanpa server, tanpa database.

## Struktur Folder

```
yayasan-islam/
├── index.html      → halaman utama (semua section)
├── css/style.css   → design system minimalis & responsif
├── js/main.js      → konfigurasi galeri + interaksi
└── .nojekyll       → agar GitHub Pages tidak memproses Jekyll
```

## Cara Deploy ke GitHub Pages (tanpa terminal)

1. **Buat akun GitHub** di https://github.com/signup (jika belum punya).
2. **Buat repository baru**: klik tombol `+` → *New repository*.
   - Repository name: contoh `yayasan-alhidayah`
   - Pilih **Public** (gratis untuk publik).
   - Jangan centang apa pun — klik *Create repository*.
3. **Upload file**: di halaman repo, klik *uploading an existing file* →
   buka folder `yayasan-islam` di komputer, lalu **seret isi folder tersebut**
   (`index.html`, folder `css`, folder `js`, dan `.nojekyll`) ke area upload →
   klik *Commit changes*.
4. **Aktifkan Pages**: buka tab **Settings** → menu **Pages** (sidebar kiri) →
   pada *Source* pilih **Deploy from a branch** → *Branch*: `main` → folder: `/ (root)` →
   klik **Save**.
5. **Tunggu 1–2 menit**, lalu buka:
   `https://<username-anda>.github.io/<nama-repo>/`

   Contoh: `https://budi123.github.io/yayasan-alhidayah/`

> Catatan: jika nama repo persis `<username>.github.io`, situs akan tampil di
> `https://<username>.github.io/` (tanpa nama repo).

## Cara Mengubah Konten (sebelum upload ulang)

| Yang diganti | Di mana |
|---|---|
| Nama & identitas yayasan | Cari & ganti kata `Al-Hidayah` di `index.html` |
| Video YouTube | Cari komentar `GANTI ID VIDEO` di `index.html` |
| Foto galeri | Objek `ALBUMS` di `js/main.js` |
| Nomor WhatsApp | `WHATSAPP_NUMBER` di `js/main.js` |
| Email / telepon / alamat | Bagian footer di `index.html` |

## Pemasangan Domain Sendiri (nanti)

Setelah situs jalan di GitHub Pages:

1. **Di GitHub**: Settings → Pages → kolom *Custom domain* → isi domain Anda
   (contoh `alhidayah.or.id`) → Save (GitHub akan membuat file `CNAME` otomatis).
2. **Di registrar domain** (idwebhost, Niagahoster, dll.):
   - **A record** untuk root domain:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME** untuk `www` → `<username>.github.io`
3. HTTPS aktif otomatis setelah beberapa saat.
