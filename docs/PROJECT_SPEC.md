# PROJECT SPECIFICATION: MUFRADATI (مُفْرَدَاتِي)
**Personal Arabic Vocabulary Bank & Digital Vocabulary Book**

---

## 1. Visi & Tujuan Produk
Mufradati adalah aplikasi bank kosakata bahasa Arab pribadi yang berfungsi sebagai buku kosakata digital (*Digital Arabic Vocabulary Book*).
- **Fokus Utama:** Mengumpulkan, menyimpan, mengelola, membaca, dan mempelajari kosakata bahasa Arab secara sistematis layaknya membaca buku/dokumen digital elegan.
- **Bukan:** Bukan sekadar aplikasi flashcard, bukan media sosial, bukan sistem produktivitas yang rumit.
- **Prinsip Produk:** Sederhana dalam penggunaan, presisi dalam pengelolaan data, dan elegan dalam penyajian.

---

## 2. Identitas Visual & Design System
- **Konsep:** Balanced, Modern, Elegant, Academic, Minimalist, Clean, Nyaman untuk membaca jangka panjang.
- **Color Palette (Forest Green + Warm Neutral):**
  - Forest Green: `#244D3B` (Primary Brand & Header)
  - Sage Green: `#4F8067` (Accents & Highlights)
  - Warm Gold: `#D5B875` (Badges, Active Items, Numbers)
  - Background Light: `#F7F8F5`
  - Warm Surface: `#F8F7F1`
  - White Surface: `#FFFFFF`
  - Primary Text: `#27332C`
  - Dark Mode Palette: Slate/Dark Forest background `#141D18`, Surface `#1C2621`, Text `#E8ECE9`.
- **Tipografi:**
  - Bahasa Arab: **Amiri** (Offline TTF lokal, harakat jelas, RTL sempurna).
  - Antarmuka & Bahasa Indonesia: **Inter** (Keterbacaan tinggi).
- **Komponen:**
  - Card radius: 14–18px.
  - Border halus: 1px subtle border.
  - Shadow ringan: Soft ambient elevation.
  - Icon: Lucide Icons.

---

## 3. Fitur Utama (4 Modul Inti)
1. **Modul 1 — Buku Kosakata (Digital Book View):**
   - Tampilan continuous scroll berurutan (bukan model pagination kaku).
   - Menampilkan nomor global stabil, teks Arab berharakat, bentuk kata tambahan (fi'il madhi/mudhari', jamak, mashdar), arti bahasa Indonesia, daftar Jumlah Mufidah dengan nomor otomatis `①, ②, ③`, serta terjemahannya.
   - Kontrol ukuran teks Arab, mode fokus, dark mode, filter kategori, search bar cepat, bookmark.
2. **Modul 2 — Smart Paste (Fitur Unggulan):**
   - Menghilangkan proses merapikan teks manual dari AI (ChatGPT, Claude, dsb.).
   - Parser TypeScript lokal offline: Mengenali angka Latin/Arab, variasi label (Arti, Makna, Jumlah Mufidah, Contoh, dll.), bentuk kata, multi-kosakata sekaligus.
   - **Preservasi Teks Arab Kritis:** Dilarang menghapus/mengubah harakat, tanwin, sukun, tanda baca Arab.
   - Preview interaktif sebelum disimpan ke IndexedDB.
   - Penomoran otomatis berbasis sequence counter (tidak menimpa nomor yang ada).
   - Dukungan Undo Last Import per batch ID.
3. **Modul 3 — Kategori / Bab:**
   - Tambah, edit, urutkan, dan hapus kategori.
   - Proteksi penghapusan kategori yang berisi entri kosakata (konfirmasi pemindahan).
4. **Modul 4 — Backup & Ekspor:**
   - Backup & Restore JSON (validasi skema sebelum timpa data).
   - Ekspor PDF lokal dengan font Amiri, RTL, dan harakat yang rapi tanpa terpotong acak antar halaman.
   - Ekspor CSV opsional.

---

## 4. Ketentuan Teknis & Arsitektur
- **Zero-Cost:** Rp0 biaya wajib. Bebas API berbayar, bebas backend server berbayar.
- **Local-First & Offline-First:** Menggunakan IndexedDB (Dexie.js), Font lokal, PWA Service Worker caching.
- **Frontend Stack:** React 19 / TypeScript / Vite / Tailwind CSS / Lucide React.

