# TESTING PLAN & RESULTS: MUFRADATI

---

## 1. Strategi Pengujian
1. **Parser & Unicode Diacritics Preservation Test:**
   - Memastikan teks Arab berharakat utuh (fathah, kasrah, dhammah, tanwin, sukun, tasydid, hamzah washl).
   - Pengujian terhadap sampel variasi AI (kosakata 311–334).
2. **Sequence Numbering Atomic Integrity Test:**
   - Memastikan import batch 10 item menghasilkan nomor berurutan tanpa jeda atau tumpang tindih.
   - Memastikan penghapusan entri tidak membuat nomor baru menggunakan kembali nomor lama.
3. **Database Transaction & Undo Test:**
   - Menguji pembatalan import batch (Undo Last Import) hanya menghapus entri dari batch terkait tanpa merusak entri lain.
4. **Offline & Font Rendering Test:**
   - Menguji aplikasi dalam mode offline (browser network disabled).
   - Memastikan font Amiri ter-render dengan baik dan orientasi RTL rapi.
5. **Backup & Restore Test:**
   - Ekspor data -> hapus database -> restore data -> verifikasi kelengkapan entri dan urutan nomor.

---

## 2. Log Hasil Pengujian
| Tanggal | Target Pengujian | Status | Catatan |
| :--- | :--- | :--- | :--- |
| *Pending* | Phase 1 Foundation Build | Menunggu | Direncanakan pada akhir Phase 1 |
| *Pending* | Smart Paste Parser Unit Test | Menunggu | Direncanakan pada Phase 4 |
