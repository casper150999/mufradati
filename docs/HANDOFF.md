# AI CONTINUITY HANDOFF: MUFRADATI (مُفْرَدَاتِي)
*Dokumen ini diperbarui secara berkala sebagai poros pemulihan sesi coding AI saat kuota terpotong.*

---

## 1. Identitas & Tujuan Proyek
- **Nama Proyek:** Mufradati (مُفْرَدَاتِي) — Personal Arabic Vocabulary Bank & Digital Vocabulary Book
- **Fokus Utama:** Mengelola kosakata bahasa Arab pribadi seperti dokumen/buku digital elegan dengan fitur Smart Paste cerdas, preservasi teks Arab utuh, penomoran global stabil, zero-cost, dan offline-first.

---

## 2. Status Saat Ini
- **Fase Aktif:** Selesai **PHASE 4 (Smart Paste Engine & Batch Parser)**. Siap masuk **PHASE 5 (Backup, Restore & PDF Export)**.
- **Progres Keseluruhan:** ~65%
- **Status Build:** `npm run build` sukses 100% (0 error TypeScript, strict mode).
- **Status Test Parser:** PASS (`node --experimental-strip-types tests/smart-paste-test.ts` berhasil mem-parsing entri 311-312 dengan 100% harakat utuh).
- **Commit Terakhir:** `feat: implement smart paste parser, interactive preview, and batch undo (Phase 4)`

---

## 3. Komponen yang Sudah Terpasang & Berfungsi
1. **Smart Paste Rule-Based Parser (`smartPasteParser.ts`):** 
   - Tokenizer baris & regex Unicode offline (bebas API AI berbayar).
   - Preservasi harakat 100% mutlak.
   - Deteksi nomor Arab/Latin (`٣١١.`, `311.`), kata Arab, bentuk fi'il/jamak/mashdar, arti Indonesia, serta pasangan kalimat Jumlah Mufidah (`①, ②, ③`).
2. **Interactive Preview Workbench (`SmartPasteModal.tsx`):**
   - Pengguna dapat memeriksa dan mengoreksi kata Arab, arti, atau contoh kalimat sebelum commit ke IndexedDB.
   - Pemilihan kategori tujuan impor.
3. **Batch Import & Undo Last Import:**
   - Menyimpan batch dengan `importBatchId` unik.
   - Tombol *Undo Last Import* pada sidebar yang dapat membatalkan batch terakhir tanpa mengganggu kosakata lain.
4. **Database & UI:**
   - IndexedDB persisten, penomoran sequence atomik stabil, pencarian dwibahasa, font scaler, dan continuous scroll view.

---

## 4. Langkah Teknis Selanjutnya (Immediate Next Actions)
1. **PHASE 5 (Backup, Restore & PDF Export):**
   - Buat fitur Ekspor & Impor JSON (seluruh tabel Dexie: kosakata, kategori, sequences).
   - Buat validasi skema file JSON saat restore dengan dialog konfirmasi.
   - Buat template cetak/ekspor PDF lokal dengan paged CSS styling yang merender font Amiri dan orientasi RTL sempurna tanpa memotong kalimat.

---

## 5. Keputusan Mutlak yang Dilarang Diubah
- Dilarang menggunakan API AI berbayar (Zero-Cost).
- Dilarang menghilangkan harakat/tanda baca Arab saat parsing atau penyimpanan.
- Penomoran kosakata harus stabil dan global menggunakan sequence atomik.
