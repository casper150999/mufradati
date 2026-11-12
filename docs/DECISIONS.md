# ARCHITECTURAL DECISION RECORDS (ADR): MUFRADATI

---

## ADR 001: Pilihan Database Lokal (IndexedDB via Dexie.js)
- **Status:** Diterima
- **Konteks:** Mufradati harus beroperasi 100% lokal tanpa backend berbayar (Zero-Cost). Volume kosakata dan contoh kalimat dapat mencapai ribuan entri, melebihi kuota 5MB `localStorage`.
- **Keputusan:** Menggunakan `Dexie.js` sebagai wrapper IndexedDB karena stabil, mendukung transaksi atomik yang diperlukan untuk sequence penomoran dan batch rollback, serta memiliki sistem query index yang cepat.
- **Konsekuensi:** Data berada di perangkat lokal pengguna. Solusi transfer data adalah fitur wajib Backup & Restore JSON.

---

## ADR 002: Penomoran Global Atomik yang Stabil
- **Status:** Diterima
- **Konteks:** Nomor urut kosakata tidak boleh mengandalkan hitungan `count()`, karena penghapusan entri lama dapat menyebabkan duplikasi nomor pada entri baru.
- **Keputusan:** Menyediakan tabel khusus `sequences` dengan key `vocabulary_number`. Setiap penambahan kosakata mengambil angka dari counter ini dan menaikkannya secara atomik. Nomor yang sudah terhapus tidak akan dipakai ulang.

---

## ADR 003: Font Lokal Amiri & Inter (Zero External Runtime Dependency)
- **Status:** Diterima
- **Konteks:** Mufradati adalah aplikasi offline-first dan tidak boleh bergantung pada koneksi CDN/Google Fonts saat aplikasi dijalankan di perangkat pengguna.
- **Keputusan:** Menyematkan file font Amiri (Amiri-Regular, Amiri-Bold) dan Inter langsung di `public/fonts/` dengan deklarasi `@font-face` di CSS utama. Lisensi Amiri adalah SIL Open Font License (OFL) yang 100% gratis dan legal disematkan.

---

## ADR 004: Parser Smart Paste Berbasis Aturan Lokal (Tanpa AI API Berbayar)
- **Status:** Diterima
- **Konteks:** Mengikuti ketentuan Zero-Cost, dilarang menggunakan API LLM berbayar (OpenAI, Gemini API, dll.) untuk parsing di runtime.
- **Keputusan:** Membangun tokenizer berbasis baris dan ekspresi reguler Unicode di TypeScript yang mampu mengidentifikasi format angka (Latin & Arab-Indic), label arti, dan pasangan contoh kalimat secara cerdas, dengan preview interaktif untuk koreksi manual sebelum penyimpanan.

