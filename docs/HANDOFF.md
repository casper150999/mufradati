# AI CONTINUITY HANDOFF: MUFRADATI (مُفْرَدَاتِي)
*Dokumen ini diperbarui secara berkala sebagai poros pemulihan sesi coding AI saat kuota terpotong.*

---

## 1. Identitas & Tujuan Proyek
- **Nama Proyek:** Mufradati (مُفْرَدَاتِي) — Personal Arabic Vocabulary Bank & Digital Vocabulary Book
- **Fokus Utama:** Mengelola kosakata bahasa Arab pribadi seperti dokumen/buku digital elegan dengan fitur Smart Paste cerdas, preservasi teks Arab utuh, penomoran global stabil, zero-cost, dan offline-first.

---

## 2. Status Saat Ini
- **Fase Aktif:** Selesai PHASE 0 (Project Discovery & Documentation), Siap Eksekusi PHASE 1 (Project Foundation & Setup).
- **Progres Keseluruhan:** ~8%
- **Status Build:** Belum ada build (folder proyek baru siap diinisialisasi dengan Vite).
- **Commit Terakhir:** Menunggu inisialisasi git pada Phase 1.

---

## 3. Dokumen Arsitektur & Spesifikasi
Sebelum memulai pekerjaan di sesi baru, wajib membaca file berikut:
- [PROJECT_SPEC.md](file:///d:/Documents/Kosakata%20Bahasa%20Arab%20app/docs/PROJECT_SPEC.md)
- [ARCHITECTURE.md](file:///d:/Documents/Kosakata%20Bahasa%20Arab%20app/docs/ARCHITECTURE.md)
- [DEVELOPMENT_PLAN.md](file:///d:/Documents/Kosakata%20Bahasa%20Arab%20app/docs/DEVELOPMENT_PLAN.md)
- [PROGRESS.md](file:///d:/Documents/Kosakata%20Bahasa%20Arab%20app/docs/PROGRESS.md)
- [DECISIONS.md](file:///d:/Documents/Kosakata%20Bahasa%20Arab%20app/docs/DECISIONS.md)

---

## 4. Langkah Teknis Selanjutnya (Immediate Next Actions)
1. **Inisialisasi Project (Phase 1):**
   - Jalankan `npm create vite@latest . -- --template react-ts` di direktori proyek.
   - Instal dependensi dasar: `lucide-react`, `dexie`, `clsx`, `tailwind-merge`.
   - Setup Tailwind CSS v3/v4 dengan konfigurasi warna Forest Green `#244D3B`, Warm Gold `#D5B875`, Surface `#F7F8F5`.
   - Siapkan aset font lokal Amiri (`Amiri-Regular.ttf`, `Amiri-Bold.ttf`) dan Inter di `public/fonts/`.
   - Setup `@font-face` di CSS.
   - Verifikasi build dengan `npm run build`.
   - Buat Git repository awal (`git init`, commit: `chore: initialize project foundation`).

---

## 5. Keputusan Mutlak yang Dilarang Diubah
- Dilarang menggunakan API AI berbayar (Zero-Cost).
- Dilarang menghilangkan harakat/tanda baca Arab saat parsing.
- Penomoran kosakata harus stabil dan global menggunakan sequence atomik.
