# AI CONTINUITY HANDOFF: MUFRADATI (مُفْرَدَاتِي)
*Dokumen ini diperbarui secara berkala sebagai poros pemulihan sesi coding AI saat kuota terpotong.*

---

## 1. Identitas & Tujuan Proyek
- **Nama Proyek:** Mufradati (مُفْرَدَاتِي) — Personal Arabic Vocabulary Bank & Digital Vocabulary Book
- **Fokus Utama:** Mengelola kosakata bahasa Arab pribadi seperti dokumen/buku digital elegan dengan fitur Smart Paste cerdas, preservasi teks Arab utuh, penomoran global stabil, zero-cost, dan offline-first.

---

## 2. Status Saat Ini
- **Fase Aktif:** Selesai **PHASE 5 (Backup, Restore & PDF Export)**. Siap masuk **PHASE 6 (PWA & Offline Readiness)**.
- **Progres Keseluruhan:** ~80%
- **Status Build:** `npm run build` sukses 100% (0 error TypeScript, strict mode).
- **Status Test:** PASS (Parser test & Backup validation test sukses 100%).
- **Commit Terakhir:** `feat: implement json backup, restore with schema validation, and vector pdf print export (Phase 5)`

---

## 3. Komponen yang Sudah Terpasang & Berfungsi
1. **JSON Backup & Restore Engine (`backupService.ts`):**
   - Ekspor seluruh database IndexedDB (kosakata, kategori, sequence nomor atomik) menjadi file `.json`.
   - Validasi skema protektif sebelum pemulihan data (`validateBackupJson`).
   - Opsi pemulihan fleksibel: **Timpa Seluruh Data** atau **Gabungkan Data**.
2. **Ekspor & Cetak PDF Vektor Presisi:**
   - Aturan stylesheet `@media print` terkonfigurasi dengan font lokal Amiri, RTL, dan `break-inside: avoid` untuk mencegah pemotongan kartu entri di batas halaman.
3. **Modul Smart Paste & Preview:**
   - Parser offline rule-based di `smartPasteParser.ts` dengan preservasi harakat 100%.
   - Live interactive adjustment & Undo Last Import per batch.
4. **Database & UI:**
   - IndexedDB persisten, penomoran stabil, pencarian dwibahasa, dark/light mode, font scaler.

---

## 4. Langkah Teknis Selanjutnya (Immediate Next Actions)
1. **PHASE 6 (PWA & Offline Readiness):**
   - Buat file `public/manifest.json` (Nama: Mufradati, background `#F7F8F5`, theme `#244D3B`, ikon PWA).
   - Buat service worker di `public/sw.js` untuk cache statis aset & font lokal.
   - Daftarkan service worker di `main.tsx`.

---

## 5. Keputusan Mutlak yang Dilarang Diubah
- Dilarang menggunakan API AI berbayar (Zero-Cost).
- Dilarang menghilangkan harakat/tanda baca Arab saat parsing atau penyimpanan.
- Penomoran kosakata harus stabil dan global menggunakan sequence atomik.
