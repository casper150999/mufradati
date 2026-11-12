# AI CONTINUITY HANDOFF: MUFRADATI (مُفْرَدَاتِي)
*Dokumen ini diperbarui secara berkala sebagai poros pemulihan sesi coding AI saat kuota terpotong.*

---

## 1. Identitas & Tujuan Proyek
- **Nama Proyek:** Mufradati (مُفْرَدَاتِي) — Personal Arabic Vocabulary Bank & Digital Vocabulary Book
- **Fokus Utama:** Mengelola kosakata bahasa Arab pribadi seperti dokumen/buku digital elegan dengan fitur Smart Paste cerdas, preservasi teks Arab utuh, penomoran global stabil, zero-cost, dan offline-first.

---

## 2. Status Saat Ini
- **Fase Aktif:** Selesai **PHASE 3 (Database Engine & Core Vocabulary Management)**. Siap masuk **PHASE 4 (Smart Paste Engine & Batch Parser)**.
- **Progres Keseluruhan:** ~45%
- **Status Build:** `npm run build` sukses 100% (0 error TypeScript, strict mode).
- **Commit Terakhir:** `feat: implement indexeddb storage, atomic sequence numbering, and vocabulary crud (Phase 3)`

---

## 3. Komponen yang Sudah Terpasang & Berfungsi
1. **IndexedDB Engine via Dexie.js:** Database `MufradatiDB` dengan tabel `vocabularies`, `categories`, `import_batches`, `sequences`, dan `user_settings`.
2. **Atomic Sequence Numbering:** Generator angka urut stabil di `db.ts` (`getNextVocabularyNumbers`) yang menjamin nomor kosakata naik secara berurutan dan tidak pernah di-reuse.
3. **Arabic Search Index:** Service `buildSearchIndex` & `stripArabicDiacritics` di `arabic-utils.ts` yang membuat pencarian cepat baik mengetik teks dengan harakat maupun teks gundul (tanpa mengubah teks asli di database).
4. **Vocabulary CRUD & Filter:** Modal tambah entri manual (`VocabularyFormModal.tsx`), filter bab/kategori dinamis, bookmarking toggle, dan hapus entri.
5. **UI Digital Book:** Menampilkan nomor urut global `001`, bentuk kata tambahan, dan Jumlah Mufidah `①, ②, ③` langsung dari data IndexedDB persisten.

---

## 4. Langkah Teknis Selanjutnya (Immediate Next Actions)
1. **PHASE 4 (Smart Paste Engine):**
   - Buat file parser TypeScript `src/features/smart-paste/smartPasteParser.ts`.
   - Bangun rule-based tokenizer: deteksi nomor Latin/Arab, pemisah entri, kata Arab, makna, bentuk kata, dan pasangan Jumlah Mufidah.
   - Buat UI `SmartPasteModal.tsx` dengan textarea input dan Live Interactive Preview (memungkinkan koreksi baris sebelum commit).
   - Buat handler batch import di database dengan penomoran atomik berurutan serta penyimpanan `importBatchId`.
   - Buat fitur "Undo Last Import" per batch ID.

---

## 5. Keputusan Mutlak yang Dilarang Diubah
- Dilarang menggunakan API AI berbayar (Zero-Cost).
- Dilarang menghilangkan harakat/tanda baca Arab saat parsing atau penyimpanan.
- Penomoran kosakata harus stabil dan global menggunakan sequence atomik.
