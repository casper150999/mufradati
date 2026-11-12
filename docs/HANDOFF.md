# AI CONTINUITY HANDOFF: MUFRADATI (مُفْرَدَاتِي)
*Dokumen ini diperbarui secara berkala sebagai poros pemulihan sesi coding AI saat kuota terpotong.*

---

## 1. Identitas & Tujuan Proyek
- **Nama Proyek:** Mufradati (مُفْرَدَاتِي) — Personal Arabic Vocabulary Bank & Digital Vocabulary Book
- **Fokus Utama:** Mengelola kosakata bahasa Arab pribadi seperti dokumen/buku digital elegan dengan fitur Smart Paste cerdas, preservasi teks Arab utuh, penomoran global stabil, zero-cost, dan offline-first.

---

## 2. Status Saat Ini
- **Fase Aktif:** Selesai **PHASE 6 (PWA & Offline Readiness)**. Siap masuk **PHASE 7 (Comprehensive Quality Assurance)** & **PHASE 8 (Deployment ke Cloudflare Pages)**.
- **Progres Keseluruhan:** ~90%
- **Status Build:** `npm run build` sukses 100% (0 error TypeScript, strict mode).
- **Commit Terakhir:** `feat: implement web app manifest and offline service worker (Phase 6)`

---

## 3. Komponen yang Sudah Terpasang & Berfungsi
1. **PWA & Offline Architecture (`manifest.json` & `sw.js`):**
   - Web App Manifest terpasang dengan theme color Forest Green `#244D3B`, background `#F7F8F5`, dan ikon SVG vektor mandiri.
   - Service worker aktif dengan strategi caching offline untuk font lokal Amiri, dokumen HTML, dan bundle statis.
2. **JSON Backup, Restore & Ekspor PDF:**
   - Ekspor/Impor database lengkap dengan validasi skema integritas.
   - Ekspor PDF presisi A4 dengan font Amiri lokal & RTL sempurna.
3. **Smart Paste Engine & Preview:**
   - Parser regex/tokenisasi baris offline tanpa biaya API, preservasi harakat 100%, preview interaktif, batch import & Undo Last Import.
4. **Database & UI:**
   - Dexie IndexedDB persisten, sequence counter nomor global atomik, search index dwibahasa, dark/light mode, font scaler.

---

## 4. Langkah Teknis Selanjutnya (Immediate Next Actions)
1. **PHASE 7 & 8 (QA & Deployment):**
   - Jalankan verifikasi pengujian menyeluruh (TypeScript check, parser test, backup test).
   - Buat panduan deployment Cloudflare Pages Free di repository.

---

## 5. Keputusan Mutlak yang Dilarang Diubah
- Dilarang menggunakan API AI berbayar (Zero-Cost).
- Dilarang menghilangkan harakat/tanda baca Arab saat parsing atau penyimpanan.
- Penomoran kosakata harus stabil dan global menggunakan sequence atomik.
