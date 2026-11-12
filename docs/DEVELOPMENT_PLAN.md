# DEVELOPMENT PLAN: MUFRADATI

---

## Tahapan & Kriteria Penyelesaian

### PHASE 0 — Project Discovery & Perencanaan Teknis (Status: Ongoing)
- [x] Analisis kelayakan teknis dan identifikasi risiko
- [x] Penyusunan dokumen arsitektur dan spesifikasi (`PROJECT_SPEC.md`, `ARCHITECTURE.md`)
- [x] Pembuatan dokumen kontinuitas (`DEVELOPMENT_PLAN.md`, `PROGRESS.md`, `DECISIONS.md`, `TESTING.md`, `CHANGELOG.md`, `HANDOFF.md`)
- [ ] Konfirmasi kesiapan lingkungan kerja

### PHASE 1 — Project Foundation & Tooling Setup
- [ ] Inisialisasi React + TypeScript + Vite di root workspace
- [ ] Instalasi dependensi: Tailwind CSS, Lucide React, Dexie
- [ ] Konfigurasi Tailwind CSS (Forest Green, Sage, Warm Gold, Surface)
- [ ] Download & setup font lokal Amiri & Inter di `public/fonts/` dengan `@font-face`
- [ ] Setup Git repository & commit initial foundation

### PHASE 2 — UI Foundation & Digital Book Experience
- [ ] Komponen Layout Utama (Sidebar/Drawer kategori, Header navigasi, Toolbar membaca)
- [ ] Digital Book Canvas: Tampilan entri continuous scroll dengan typography nyaman
- [ ] Responsive design (Desktop split screen & Mobile full drawer)
- [ ] Fitur Pengalaman Membaca: Ukuran font Arab slider, Spacing, Focus Mode, Dark/Light mode toggle
- [ ] Visual testing dengan mock dataset awal

### PHASE 3 — Database Engine & Core Vocabulary Management
- [ ] Inisialisasi Dexie database dengan skema `vocabularies`, `categories`, `sequences`, `import_batches`
- [ ] Service sequence counter untuk penomoran global stabil (tanpa reuse nomor)
- [ ] CRUD Kosakata lengkap (Tambah manual, Edit, Hapus, Bookmark)
- [ ] CRUD Kategori (Tambah, Ubah nama, Urutkan, Hapus dengan modal mitigasi)
- [ ] Engine Pencarian lokal (Support teks Arab berharakat / teks polos + arti Indonesia)

### PHASE 4 — Smart Paste Engine (Fitur Unggulan)
- [ ] Tokenizer & Rule-based Parser di TypeScript (offline, zero-cost)
- [ ] Deteksi multi-entry kosakata, nomor Arab/Latin, label fleksibel (Makna/Arti/Jumlah Mufidah)
- [ ] Aturan ketat preservasi teks Arab (menjaga seluruh harakat asli tanpa distorsi)
- [ ] Modal Smart Paste & Live Interactive Preview Editor
- [ ] Mekanisme Import Batch & Undo Last Import
- [ ] Pengujian komprehensif terhadap sampel dataset nyata (termasuk kosakata 311–334)

### PHASE 5 — Backup, Restore, & Ekspor PDF
- [ ] Fitur Backup JSON & Restore JSON dengan validasi skema integritas
- [ ] Modal konfirmasi restore (Opsi Timpa / Gabung)
- [ ] Engine Ekspor PDF lokal dengan font Amiri tersemat, RTL akurat, dan pemisahan halaman rapi

### PHASE 6 — PWA & Offline Readiness
- [ ] Konfigurasi Web App Manifest (nama, ikon, theme color `#244D3B`, orientasi)
- [ ] Service worker caching untuk seluruh aset dan font lokal
- [ ] Indikator status instalasi & offline readiness check

### PHASE 7 — Quality Assurance & Refinement
- [ ] TypeScript check tanpa error (`tsc --noEmit`)
- [ ] Unit test parser & integritas penomoran global
- [ ] Cross-device UI review (Mobile & Desktop)

### PHASE 8 — Deployment & Handover
- [ ] Konfigurasi build Cloudflare Pages
- [ ] Dokumentasi penggunaan dan panduan deployment
- [ ] Finalisasi checkpoint dan serah terima proyek
