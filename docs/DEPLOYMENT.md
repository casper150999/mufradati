# PANDUAN DEPLOYMENT KE CLOUDFLARE PAGES (100% GRATIS)

Mufradati dirancang sebagai Single Page Application (SPA) client-side murni dengan IndexedDB lokal.
Dapat di-deploy ke **Cloudflare Pages Free** dengan biaya Rp0 dan sertifikat SSL/HTTPS otomatis gratis.

---

## 1. Persiapan Repository GitHub
1. Buat repository baru di GitHub Anda (misalnya: `mufradati` atau `arabic-vocabulary-book`).
2. Hubungkan repositori lokal Anda ke remote GitHub:
   ```bash
   git remote add origin https://github.com/<username-anda>/mufradati.git
   git branch -M main
   git push -u origin main
   ```

---

## 2. Langkah Deploy di Cloudflare Pages Dashboard
1. Buka [dash.cloudflare.com](https://dash.cloudflare.com) dan login ke akun gratis Anda.
2. Di menu navigasi samping, pilih **Compute (Workers & Pages)** > **Create application** > Tab **Pages**.
3. Pilih **Connect to Git** dan hubungkan akun GitHub Anda.
4. Pilih repository `mufradati`.
5. Pada pengaturan build:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** *(kosongkan / default)*
   - **Environment variables:** *(tidak ada variabel berbayar yang dibutuhkan)*
6. Klik **Save and Deploy**.

---

## 3. Konfigurasi Routing SPA di Cloudflare Pages
File build `dist/index.html` sudah menangani seluruh routing dan state klien. Jika pengguna me-refresh halaman pada path tertentu, Cloudflare Pages secara otomatis melayani `index.html` bila Anda menambahkan aturan fallback atau file `public/_routes.json` / `public/_redirects`:

```
/* /index.html 200
```
*(File ini sudah ditambahkan di folder `public/_redirects`).*

---

## 4. Verifikasi Pasca-Deployment
- Buka URL yang diberikan oleh Cloudflare (misalnya: `https://mufradati.pages.dev`).
- Periksa logo install PWA di address bar browser untuk memasang aplikasi ke desktop atau smartphone.
- Uji fitur Smart Paste, simpan kosakata, lalu matikan koneksi internet (Airplane mode) untuk membuktikan mode offline penuh.

