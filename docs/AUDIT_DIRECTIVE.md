# MASTER PROFESSIONAL AUDIT & FULL FEATURE HEALTH CHECK DIRECTIVE
# PROJECT: MUFRADATI (مُفْرَدَاتِي)
# LIVE PRODUCTION URL: https://mufradati-cnc.pages.dev/

---

## 1. PERAN DAN KONTEKS KERJA
Bertindaklah sebagai Principal Database Engineer, Senior Web Architect, dan Lead QA Engineer.

Aplikasi **Mufradati — مُفْرَدَاتِي** telah di-deploy ke Cloudflare Pages pada alamat publik:
👉 **URL:** https://mufradati-cnc.pages.dev/

Saat ini ditemukan kendala runtime pada lingkungan live ketika pengguna menekan tombol **"Simpan Kosakata Ke Buku"** (baik pada modal Smart Paste maupun penambahan entri), dengan pesan kesalahan IndexedDB:
```
Failed to execute 'objectStore' on 'IDBTransaction': The specified object store was not found. 
NotFoundError: Failed to execute 'objectStore' on 'IDBTransaction': The specified object store was not found.
```

Tugas Anda adalah melakukan audit mendalam, memperbaiki akar masalah transaksi database, dan menguji menyeluruh seluruh modul aplikasi agar aplikasi di https://mufradati-cnc.pages.dev/ berjalan 100% stabil, presisi, dan bebas bug.

---

## 2. AUDIT & PERBAIKAN TEKNIS KRITIS (INDEXEDDB TRANSACTION SCOPE)

### 2.1. Akar Masalah Transaksi (Dexie / IDBTransaction)
Pesan `NotFoundError: The specified object store was not found on IDBTransaction` terjadi karena salah satu dari dua faktor:
1. **Transaction Scope Mismatch:**
   Panggilan `db.transaction('rw', ...)` hanya mendaftarkan sebagian tabel, namun di dalam fungsi callback mengeksekusi operasi baca/tulis terhadap tabel lain yang tidak terdaftar dalam scope.
   - Contoh nyata: `getNextVocabularyNumbers` hanya mendaftarkan `db.sequences`, tetapi di dalamnya memanggil `db.vocabularies.orderBy('number').last()`.
   - Contoh pada batch import: Transaksi memanggil `getNextVocabularyNumbers` yang membuat sub-transaksi atau mengakses tabel di luar scope `db.vocabularies, db.import_batches`.
2. **Database Version Upgrade:**
   Pengguna yang membuka web di domain https://mufradati-cnc.pages.dev/ mungkin memiliki database lokal IndexedDB versi lama yang belum menginisialisasi tabel `import_batches` atau `sequences`.
   - Skema Dexie harus dinaikkan versinya secara eksplisit (`db.version(2).stores(...)`) agar browser menjalankan lifecycle `upgradeneeded` secara otomatis tanpa crash.

### 2.2. Standardisasi Transaksi yang Wajib Diterapkan:
- **`getNextVocabularyNumbers`**:
  Wajib mendaftarkan scope `[db.sequences, db.vocabularies]`.
- **`addBatchVocabularies`**:
  Wajib mengalokasikan sequence number **di luar** atau menyatukan seluruh tabel `[db.vocabularies, db.import_batches, db.sequences]` dalam satu transaksi atomik terpadu.
- **`undoLastImport`**:
  Wajib mendaftarkan `[db.vocabularies, db.import_batches]`.
- **`restoreDatabaseFromJson`**:
  Wajib mendaftarkan `[db.vocabularies, db.categories, db.sequences, db.import_batches]`.

---

## 3. AUDIT KELAYAKAN SELURUH MODUL FITUR

Lakukan pemeriksaan menyeluruh pada 5 modul utama:

### MODUL 1: BUKU KOSAKATA DIGITAL & PENGALAMAN MEMBACA
- [ ] Pengambilan data dari IndexedDB saat pertama kali halaman https://mufradati-cnc.pages.dev/ dibuka.
- [ ] Tampilan continuous scroll berurutan (nomor global `001, 002, ...`, kata Arab berharakat tajam, bentuk kata, arti, dan contoh kalimat `①, ②, ③`).
- [ ] Pengatur ukuran teks Arab (font scaler `A-` dan `A+`).
- [ ] Mode gelap (Dark Mode) dan mode terang (Light Mode).
- [ ] Fitur penanda bacaan (Bookmark) dan filter hanya menampilkan bookmark.
- [ ] Fitur hapus kosakata dengan pembaruan reaktif.

### MODUL 2: SMART PASTE AI PARSER (FITUR UTAMA)
- [ ] Tokenizer lokal offline TypeScript: membaca nomor Latin (`311.`), nomor Arab (`٣١١.`), arti, bentuk fi'il, dan daftar Jumlah Mufidah.
- [ ] **Preservasi Harakat 100%:** Harakat (fathah, kasrah, dhammah, tanwin, sukun, tasydid) dan tanda baca Arab asli tidak boleh hilang atau rusak sedikit pun.
- [ ] Modal Pratinjau Interaktif: pengguna dapat menyunting teks Arab, arti, atau kalimat sebelum disimpan.
- [ ] Tombol **"Simpan Kosakata Ke Buku"** bekerja tanpa error transaksi IDB.
- [ ] Tombol **"Undo Last Import"** di sidebar dapat membatalkan batch terakhir secara bersih.

### MODUL 3: MANAJEMEN BAB & KATEGORI
- [ ] Tambah bab baru melalui modal `CategoryManagerModal`.
- [ ] Ubah nama bab (inline edit).
- [ ] Proteksi hapus bab: jika bab memiliki kosakata, muncul dialog untuk memindahkan kosakata ke bab lain sebelum dihapus.
- [ ] Filter navigasi bab di sidebar menampilkan jumlah entri secara akurat.

### MODUL 4: CADANGAN, PEMULIHAN & EKSPOR PDF
- [ ] Unduh cadangan JSON lengkap (mencakup vocabularies, categories, dan sequence counter).
- [ ] Pemulihan JSON dengan validasi skema (opsi Timpa Seluruh Data / Gabungkan Data).
- [ ] Cetak / Ekspor PDF A4 dengan font lokal Amiri, RTL rapi, dan kartu entri tidak terpotong acak antar halaman.

### MODUL 5: PWA, OFFLINE ENGINE & ZERO-COST
- [ ] Font Amiri Regular & Bold ter-load dari `/fonts/` lokal tanpa request Google Fonts eksternal.
- [ ] Web App Manifest (`manifest.json`) dan Service Worker (`sw.js`) aktif dan melayani aset secara offline.
- [ ] Kompatibel 100% dengan hosting gratis Cloudflare Pages di https://mufradati-cnc.pages.dev/.

---

## 4. TARGET HASIL AKHIR
1. Error `objectStore on IDBTransaction not found` terselesaikan secara permanen di tingkat database engine.
2. Build produksi di folder `dist/` ter-update dan siap di-upload ke Cloudflare Pages https://mufradati-cnc.pages.dev/.
3. Seluruh unit test dan integrity check bernilai **PASS**.

