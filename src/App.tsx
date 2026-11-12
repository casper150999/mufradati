import { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Sparkles, 
  Bookmark, 
  Moon, 
  Sun, 
  Folder, 
  Download,
  Trash2,
  RotateCcw,
  Printer
} from 'lucide-react';
import { useMufradati } from './hooks/useMufradati.ts';
import { VocabularyFormModal } from './features/vocabulary/VocabularyFormModal.tsx';
import { SmartPasteModal } from './features/smart-paste/SmartPasteModal.tsx';
import { BackupModal } from './features/backup/BackupModal.tsx';

export function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [arabicFontSize, setArabicFontSize] = useState(36);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSmartPasteOpen, setIsSmartPasteOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [undoNotice, setUndoNotice] = useState<string | null>(null);

  const {
    vocabularies,
    allVocabularies,
    categories,
    loading,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    bookmarkedOnly,
    setBookmarkedOnly,
    addVocabulary,
    addBatchVocabularies,
    undoLastImport,
    deleteVocabulary,
    toggleBookmark,
    seedSampleEntryIfEmpty
  } = useMufradati();

  // Helper mapping category name
  const getCategoryName = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Umum';
  };

  const bookmarkCount = allVocabularies.filter(v => v.bookmarked).length;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#141D18] text-[#E8ECE9]' : 'bg-[#F7F8F5] text-[#27332C]'}`}>
      <div className="flex h-screen overflow-hidden">
        
        {/* SIDEBAR: Daftar Isi & Kategori */}
        <aside className="w-80 border-r border-gray-200/80 dark:border-white/10 flex flex-col bg-[#F8F7F1] dark:bg-[#1C2621]">
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-gray-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#244D3B] text-white flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 text-[#D5B875]" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight tracking-tight text-[#244D3B] dark:text-[#D5B875]">
                  مُفْرَدَاتِي
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Digital Arabic Book</p>
              </div>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-200/60 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#D5B875]" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-4 space-y-2 border-b border-gray-200/60 dark:border-white/10">
            <button 
              onClick={() => setIsSmartPasteOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#244D3B] hover:bg-[#1b3b2d] text-white rounded-xl font-medium text-sm transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#D5B875]" />
              <span>Smart Paste AI</span>
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-white/20 hover:bg-white dark:hover:bg-white/5 rounded-xl font-medium text-xs text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Kosakata Manual</span>
            </button>
            <button 
              onClick={async () => {
                const undone = await undoLastImport();
                if (undone) {
                  setUndoNotice('Batch impor terakhir berhasil dibatalkan (Undo).');
                  setTimeout(() => setUndoNotice(null), 4000);
                } else {
                  setUndoNotice('Tidak ada riwayat batch impor aktif untuk dibatalkan.');
                  setTimeout(() => setUndoNotice(null), 4000);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 hover:bg-gray-200/50 dark:hover:bg-white/5 rounded-lg text-[11px] text-gray-500 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Undo Last Import</span>
            </button>
          </div>

          {/* Category Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
              <span>Daftar Isi / Bab</span>
              <span className="text-[11px] bg-gray-200/70 dark:bg-white/10 py-0.5 px-2 rounded-full">
                {categories.length} Bab
              </span>
            </div>
            <nav className="space-y-1">
              <button 
                onClick={() => {
                  setActiveCategory('all');
                  setBookmarkedOnly(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeCategory === 'all' && !bookmarkedOnly
                    ? 'bg-[#244D3B]/10 dark:bg-[#D5B875]/20 text-[#244D3B] dark:text-[#D5B875]' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Folder className="w-4 h-4 opacity-70" />
                  <span>Semua Kosakata</span>
                </div>
                <span className="text-xs bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full font-mono">
                  {allVocabularies.length}
                </span>
              </button>

              {categories.map((cat) => {
                const count = allVocabularies.filter(v => v.categoryId === cat.id).length;
                return (
                  <button 
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setBookmarkedOnly(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeCategory === cat.id && !bookmarkedOnly
                        ? 'bg-[#244D3B]/10 dark:bg-[#D5B875]/20 text-[#244D3B] dark:text-[#D5B875]' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Folder className="w-4 h-4 opacity-70" />
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <span className="text-xs bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full font-mono">
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200/60 dark:border-white/10 flex items-center justify-between text-xs text-gray-500">
            <span>Mufradati v1.0 (IndexedDB)</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsBackupOpen(true)}
                title="Cadangan, Pulihkan & Cetak PDF" 
                className="p-1.5 hover:bg-gray-200/60 dark:hover:bg-white/10 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => window.print()}
                title="Cetak Langsung PDF" 
                className="p-1.5 hover:bg-gray-200/60 dark:hover:bg-white/10 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN DIGITAL BOOK CANVAS */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Reading Toolbar */}
          <header className="h-16 px-8 border-b border-gray-200/70 dark:border-white/10 flex items-center justify-between bg-white/70 dark:bg-[#1C2621]/70 backdrop-blur-md z-10">
            {/* Search Input */}
            <div className="relative w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kata Arab, arti Indonesia, atau kalimat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-100/80 dark:bg-white/5 border border-transparent focus:border-[#244D3B] dark:focus:border-[#D5B875] rounded-xl text-sm outline-none transition-all"
              />
            </div>

            {/* Reading Preferences (Font Scaler & Bookmarks) */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/10">
                <span className="text-xs font-medium text-gray-500">Ukuran Arab:</span>
                <button 
                  onClick={() => setArabicFontSize(Math.max(26, arabicFontSize - 2))}
                  className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  A-
                </button>
                <span className="text-xs font-mono font-semibold w-6 text-center">{arabicFontSize}</span>
                <button 
                  onClick={() => setArabicFontSize(Math.min(54, arabicFontSize + 2))}
                  className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  A+
                </button>
              </div>

              <button 
                onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
                  bookmarkedOnly 
                    ? 'bg-[#D5B875]/20 border-[#D5B875] text-[#244D3B] dark:text-[#D5B875]' 
                    : 'border-gray-200/60 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarkedOnly ? 'fill-[#D5B875] text-[#D5B875]' : 'text-[#D5B875]'}`} />
                <span>Bookmark ({bookmarkCount})</span>
              </button>
            </div>
          </header>

          {/* Continuous Scroll Book Content */}
          <div className="flex-1 overflow-y-auto px-6 py-10 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto space-y-10">
              
              {/* Book Header Section */}
              <div className="border-b-2 border-[#244D3B]/20 dark:border-white/10 pb-6 mb-8 text-center">
                <span className="inline-block px-3 py-1 bg-[#244D3B]/10 dark:bg-[#D5B875]/20 text-[#244D3B] dark:text-[#D5B875] text-xs font-semibold rounded-full mb-2">
                  Buku Kosakata Bahasa Arab Digital
                </span>
                <h2 className="text-2xl font-bold tracking-tight">
                  {bookmarkedOnly 
                    ? 'Daftar Kosakata Ditandai (Bookmarks)' 
                    : activeCategory === 'all' 
                      ? 'Seluruh Koleksi Kosakata' 
                      : `Bab: ${getCategoryName(activeCategory)}`}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Membaca dokumen digital berkelanjutan dengan presisi harakat dan makna.
                </p>
              </div>

              {/* Empty State */}
              {vocabularies.length === 0 && !loading && (
                <div className="text-center py-16 px-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#244D3B]/10 text-[#244D3B] dark:text-[#D5B875] flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg">Belum Ada Kosakata</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    {searchQuery 
                      ? `Tidak ditemukan kosakata yang cocok dengan kata kunci "${searchQuery}".` 
                      : 'Mulai bangun buku kosakata Anda dengan menambahkan entri manual atau gunakan Smart Paste.'}
                  </p>
                  {!searchQuery && allVocabularies.length === 0 && (
                    <button
                      onClick={seedSampleEntryIfEmpty}
                      className="px-4 py-2 bg-[#244D3B] text-white rounded-xl text-xs font-medium hover:bg-[#1c3c2e] transition-colors"
                    >
                      Muat Contoh Kosakata (311. غَشَّ - يَغُشُّ)
                    </button>
                  )}
                </div>
              )}

              {/* Vocabulary Entries */}
              {vocabularies.map((item) => (
                <article 
                  key={item.id}
                  className="bg-white dark:bg-[#1C2621] rounded-2xl p-7 shadow-sm border border-gray-200/80 dark:border-white/10 hover:border-[#244D3B]/40 dark:hover:border-[#D5B875]/40 transition-all duration-200"
                >
                  {/* Entry Header: Global Number, Category, Actions */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-[#F8F7F1] dark:bg-[#222F29] text-[#244D3B] dark:text-[#D5B875] font-mono font-bold text-sm flex items-center justify-center border border-gray-200/60 dark:border-white/5">
                        {String(item.number).padStart(3, '0')}
                      </span>
                      <span className="text-xs px-2.5 py-1 bg-[#4F8067]/10 dark:bg-[#4F8067]/20 text-[#4F8067] dark:text-[#8ac2a5] rounded-full font-medium">
                        {getCategoryName(item.categoryId)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => deleteVocabulary(item.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-red-500 transition-colors"
                        title="Hapus Kosakata"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleBookmark(item.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        title={item.bookmarked ? 'Hapus dari bookmark' : 'Tandai bookmark'}
                      >
                        <Bookmark className={`w-4 h-4 ${item.bookmarked ? 'fill-[#D5B875] text-[#D5B875]' : 'text-gray-400'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Main Arabic Vocab Word & Forms */}
                  <div className="pt-6 pb-4">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                      {/* Arabic Main Word with Amiri font */}
                      <h3 
                        className="font-arabic font-bold text-right text-[#244D3B] dark:text-[#E8ECE9] leading-relaxed tracking-wide"
                        dir="rtl"
                        style={{ fontSize: `${arabicFontSize}px` }}
                      >
                        {item.arabic}
                      </h3>

                      {/* Indonesian Meaning */}
                      <div className="text-left md:text-right">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Arti / Makna:</span>
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          {item.meaning}
                        </p>
                      </div>
                    </div>

                    {/* Word Forms (Fi'il / Jamak / Mashdar) */}
                    {item.forms && item.forms.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-dashed border-gray-100 dark:border-white/5">
                        {item.forms.map((form, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-1.5 bg-[#F8F7F1] dark:bg-[#222F29] px-2.5 py-1 rounded-lg border border-gray-200/50 dark:border-white/5 text-xs">
                            <span className="text-gray-400 font-medium">{form.label}:</span>
                            <span className="font-arabic font-bold text-[#244D3B] dark:text-[#D5B875] text-sm" dir="rtl">{form.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Examples Section (Jumlah Mufidah) */}
                  {item.examples && item.examples.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#4F8067] dark:text-[#D5B875]">
                          Jumlah Mufidah (Contoh Kalimat)
                        </span>
                        <span className="text-[11px] text-gray-400">({item.examples.length} kalimat)</span>
                      </div>

                      <div className="space-y-4">
                        {item.examples.map((example, eIdx) => {
                          const circledNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
                          return (
                            <div key={example.id} className="p-3.5 rounded-xl bg-[#F8F7F1]/60 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-1.5">
                              {/* Arabic Sentence */}
                              <div className="flex items-start justify-end gap-2 text-right" dir="rtl">
                                <span className="text-[#244D3B] dark:text-[#D5B875] font-bold text-base select-none">
                                  {circledNumbers[eIdx] || `(${eIdx + 1})`}
                                </span>
                                <p 
                                  className="font-arabic font-medium text-gray-800 dark:text-gray-100 leading-loose"
                                  style={{ fontSize: `${Math.round(arabicFontSize * 0.72)}px` }}
                                >
                                  {example.arabic}
                                </p>
                              </div>

                              {/* Indonesian Translation */}
                              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 pl-2 leading-relaxed">
                                {example.translation}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </article>
              ))}

              {/* End of Document Bookmark Notice */}
              {vocabularies.length > 0 && (
                <div className="text-center py-10 text-xs text-gray-400 flex flex-col items-center gap-2">
                  <div className="w-12 h-0.5 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                  <span>Akhir dokumen buku kosakata ({vocabularies.length} entri dimuat)</span>
                </div>
              )}

            </div>
          </div>
        </main>

      </div>

      {/* MODAL: Tambah Kosakata Manual */}
      <VocabularyFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        onSubmit={async (data) => {
          await addVocabulary(data);
        }}
      />

      {/* MODAL: Smart Paste AI */}
      <SmartPasteModal
        isOpen={isSmartPasteOpen}
        onClose={() => setIsSmartPasteOpen(false)}
        categories={categories}
        onCommitBatch={async (items, categoryId, rawText) => {
          const payload = items.map(item => ({
            arabic: item.arabic,
            meaning: item.meaning,
            categoryId,
            forms: item.forms,
            examples: item.examples.map(ex => ({
              id: ex.id,
              arabic: ex.arabic,
              translation: ex.translation
            })),
            sourceRawText: item.rawBlock
          }));
          await addBatchVocabularies(payload, rawText);
        }}
      />

      {/* Undo Notification Toast */}
      {undoNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#244D3B] text-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 animate-bounce">
          <RotateCcw className="w-4 h-4 text-[#D5B875]" />
          <span>{undoNotice}</span>
        </div>
      )}

      {/* MODAL: Backup, Restore & Ekspor PDF */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onDataRestored={async () => {
          await useMufradati().refreshData();
        }}
        onPrintPdf={() => {
          setTimeout(() => {
            window.print();
          }, 300);
        }}
      />
    </div>
  );
}

export default App;
