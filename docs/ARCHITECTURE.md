# ARCHITECTURE SPECIFICATION: MUFRADATI

---

## 1. High-Level Architecture
Mufradati dirancang sebagai aplikasi Single-Page Web & Progressive Web App (PWA) yang beroperasi 100% di sisi klien (Client-Side, Local-First, Offline-First).

```
+-------------------------------------------------------------+
|                 PRESENTATION LAYER (React UI)               |
|  - Digital Book View (Continuous Scroll)                    |
|  - Smart Paste Workbench & Preview                          |
|  - Category Drawer & Navigation                             |
|  - Search & Filter Bar                                      |
|  - Settings, Reader Customizer & Focus Mode                 |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                  DOMAIN & SERVICES LAYER                    |
|  - Smart Paste Rule-Based Parser (TypeScript)               |
|  - Sequence & Batch Manager (Atomic Numbers, Undo Batch)    |
|  - Search Indexing Service (Diacritics-agnostic index)     |
|  - PDF Generation Engine (Local Amiri Font, RTL Support)    |
|  - JSON Backup & Restore Validator                          |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|               STORAGE LAYER (IndexedDB via Dexie)           |
|  - Table: vocabularies                                      |
|  - Table: categories                                        |
|  - Table: import_batches                                    |
|  - Table: sequences                                         |
|  - Table: user_settings                                     |
+-------------------------------------------------------------+
```

---

## 2. Directory Structure
```
mufradati/
├── public/
│   ├── fonts/
│   │   ├── Amiri-Regular.ttf
│   │   ├── Amiri-Bold.ttf
│   │   └── Inter-Variable.ttf
│   ├── icons/
│   │   └── pwa-192x192.png, pwa-512x512.png
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/         # Button, Modal, Card, Input, Badge
│   │   ├── layout/         # Header, Sidebar, BookContainer
│   │   └── reader/         # TextScaler, FocusToggle, FontStyleToolbar
│   ├── features/
│   │   ├── vocabulary/     # Book view, VocabularyCard, FormsBadge, ExampleList
│   │   ├── smart-paste/    # Parser engine, PasteInput, BatchPreviewModal
│   │   ├── categories/     # CategoryManager, CategoryList
│   │   └── backup/         # JsonExportModal, JsonRestoreModal, PdfExporter
│   ├── database/
│   │   ├── db.ts           # Dexie database instance
│   │   └── schema.ts       # Type definitions & migrations
│   ├── hooks/              # useVocabulary, useCategories, useSearch, useTheme
│   ├── lib/
│   │   ├── arabic-utils.ts # Arabic script handling & diacritics stripping for search
│   │   └── pdf-maker.ts    # PDF render helper
│   ├── styles/
│   │   └── index.css       # Tailwind directives & @font-face rules
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── docs/                   # Dokumentasi kontinuitas & pemulihan
├── tests/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 3. Database Schema (IndexedDB / Dexie)

```typescript
// Database Name: "MufradatiDB"
// Current Version: 1

db.version(1).stores({
  vocabularies: 'id, number, categoryId, bookmarked, importBatchId, createdAt, *searchIndex',
  categories: 'id, order, createdAt',
  import_batches: 'id, importedAt, status',
  sequences: 'key',
  user_settings: 'key'
});
```

---

## 4. Keamanan Data & Transaksi
- Penambahan kosakata baru selalu dijalankan di dalam transaksi Dexie (`db.transaction('rw', [db.vocabularies, db.sequences, db.import_batches], ...)`).
- `lastVocabularyNumber` selalu diperbarui secara inkremental dari nilai tersimpan di `sequences`, memastikan tidak pernah terjadi duplikasi nomor meskipun terjadi impor paralel.
