# AI CONTINUITY HANDOFF: MUFRADATI (مُفْرَدَاتِي)
*Dokumen ini diperbarui secara berkala sebagai poros pemulihan sesi coding AI saat kuota terpotong.*

---

## 1. Identitas & Tujuan Proyek
- **Nama Proyek:** Mufradati (مُفْرَدَاتِي) — Personal Arabic Vocabulary Bank & Digital Vocabulary Book
- **Fokus Utama:** Mengelola kosakata bahasa Arab pribadi seperti dokumen/buku digital elegan dengan fitur Smart Paste cerdas, preservasi teks Arab utuh, penomoran global stabil, zero-cost, dan offline-first.

---

## 2. Status Saat Ini
- **Fase Aktif:** Selesai PHASE 1 (Foundation) & PHASE 2 (UI Foundation). Siap memulai **PHASE 3 (Database Engine & Sequence Counter)**.
- **Progres Keseluruhan:** ~25%
- **Status Build:** `npm run build` sukses 100% (TypeScript strict mode, 0 warning/error).
- **Commit Terakhir:** `feat: implement project foundation, local amiri fonts, and digital book layout (Phase 1 & 2)`

---

## 3. Komponen yang Sudah Terpasang & Berfungsi
1. **Frontend Foundation:** Vite + React 19 + TypeScript + Tailwind CSS v4.
2. **Offline Font Engine:** Font Arab `Amiri-Regular.ttf` dan `Amiri-Bold.ttf` lokal di `public/fonts/` dengan `@font-face` terpasang.
3. **Design System:** Palet Forest Green (`#244D3B`), Warm Gold (`#D5B875`), Surface Warm (`#F8F7F1`), Dark mode ready.
4. **UI Digital Book:** Sidebar daftar isi bab, search bar, kontrol font scaler teks Arab, tampilan entri kosakata continuous scroll dengan badge bentuk kata (Madhi, Mudhari', Mashdar) dan contoh kalimat bernomor `①, ②, ③`.
5. **Dependensi Inti:** `dexie` v4, `lucide-react`, `clsx`, `tailwind-merge` sudah terpasang.

---

## 4. Langkah Teknis Selanjutnya (Immediate Next Actions)
1. **PHASE 3 (Database Engine):**
   - Buat modul `src/database/db.ts` menggunakan Dexie.js.
   - Buat sequence manager untuk penomoran global stabil (menggunakan tabel `sequences` dengan key `vocabulary_number`).
   - Buat seed initial categories ("Umum", "Perilaku & Akhlak", "Pendidikan & Belajar").
   - Buat custom hook `useVocabulary` dan `useCategories` untuk CRUD data asli ke IndexedDB.
   - Gantikan mock data di `App.tsx` dengan data riil dari IndexedDB.

---

## 5. Keputusan Mutlak yang Dilarang Diubah
- Dilarang menggunakan API AI berbayar (Zero-Cost).
- Dilarang menghilangkan harakat/tanda baca Arab saat parsing atau penyimpanan.
- Penomoran kosakata harus stabil dan global menggunakan sequence atomik.
