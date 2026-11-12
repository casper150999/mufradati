import { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Sparkles, 
  Bookmark, 
  Settings, 
  Moon, 
  Sun, 
  Folder, 
  Download,
  Trash2,
  Edit3
} from 'lucide-react';

export function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [arabicFontSize, setArabicFontSize] = useState(36);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sample vocabulary data adhering to spec
  const sampleVocabulary = [
    {
      id: '1',
      number: 311,
      arabic: 'غَشَّ - يَغُشُّ',
      forms: [
        { label: 'Madhi', value: 'غَشَّ' },
        { label: 'Mudhari\'', value: 'يَغُشُّ' },
        { label: 'Mashdar', value: 'غَشًّا' }
      ],
      meaning: 'Menyontek / Menipu',
      category: 'Perilaku & Akhlak',
      bookmarked: false,
      examples: [
        {
          id: 'e1',
          arabic: 'حَرَّمَ الإِسْلَامُ أَنْ يَغُشَّ الطَّالِبُ فِي الِامْتِحَانِ.',
          translation: 'Islam mengharamkan siswa untuk menyontek dalam ujian.'
        },
        {
          id: 'e2',
          arabic: 'لَمْ يَغُشَّ زَيْدٌ فِي الِاخْتِبَارِ لِأَنَّهُ مَاهِرٌ.',
          translation: 'Zaid tidak menyontek saat ujian karena dia pintar.'
        },
        {
          id: 'e3',
          arabic: 'مَنْ غَشَّنَا فَلَيْسَ مِنَّا.',
          translation: 'Barang siapa yang menipu/menyontek kami, maka ia bukan dari golongan kami.'
        }
      ]
    },
    {
      id: '2',
      number: 312,
      arabic: 'اِجْتَهَدَ - يَجْتَهِدُ',
      forms: [
        { label: 'Madhi', value: 'اِجْتَهَدَ' },
        { label: 'Mudhari\'', value: 'يَجْتَهِدُ' },
        { label: 'Mashdar', value: 'اِجْتِهَادًا' }
      ],
      meaning: 'Bersungguh-sungguh / Berjuang keras',
      category: 'Pendidikan & Belajar',
      bookmarked: true,
      examples: [
        {
          id: 'e4',
          arabic: 'يَجْتَهِدُ التِّلْمِيذُ فِي دِرَاسَتِهِ لِيَنْجَحَ فِي الِامْتِحَانِ.',
          translation: 'Murid itu bersungguh-sungguh dalam belajarnya agar lulus ujian.'
        },
        {
          id: 'e5',
          arabic: 'مَنْ جَدَّ وَجَدَ، وَمَنِ اجْتَهَدَ حَصَدَ.',
          translation: 'Barang siapa bersungguh-sungguh dia akan berhasil, dan siapa yang berjuang dia akan menuai hasilnya.'
        }
      ]
    }
  ];

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
            <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#244D3B] hover:bg-[#1b3b2d] text-white rounded-xl font-medium text-sm transition-all shadow-sm">
              <Sparkles className="w-4 h-4 text-[#D5B875]" />
              <span>Smart Paste AI</span>
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-white/20 hover:bg-white dark:hover:bg-white/5 rounded-xl font-medium text-xs text-gray-700 dark:text-gray-300 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Manual</span>
            </button>
          </div>

          {/* Category Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
              <span>Daftar Isi / Bab</span>
              <span className="text-[11px] bg-gray-200/70 dark:bg-white/10 py-0.5 px-2 rounded-full">3 Bab</span>
            </div>
            <nav className="space-y-1">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-[#244D3B]/10 dark:bg-[#D5B875]/20 text-[#244D3B] dark:text-[#D5B875]' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Folder className="w-4 h-4 opacity-70" />
                  <span>Semua Kosakata</span>
                </div>
                <span className="text-xs bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full font-mono">2</span>
              </button>

              <button 
                onClick={() => setSelectedCategory('Perilaku & Akhlak')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  selectedCategory === 'Perilaku & Akhlak' 
                    ? 'bg-[#244D3B]/10 dark:bg-[#D5B875]/20 text-[#244D3B] dark:text-[#D5B875]' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Folder className="w-4 h-4 opacity-70" />
                  <span className="truncate">Perilaku & Akhlak</span>
                </div>
                <span className="text-xs bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full font-mono">1</span>
              </button>

              <button 
                onClick={() => setSelectedCategory('Pendidikan & Belajar')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  selectedCategory === 'Pendidikan & Belajar' 
                    ? 'bg-[#244D3B]/10 dark:bg-[#D5B875]/20 text-[#244D3B] dark:text-[#D5B875]' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Folder className="w-4 h-4 opacity-70" />
                  <span className="truncate">Pendidikan & Belajar</span>
                </div>
                <span className="text-xs bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full font-mono">1</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200/60 dark:border-white/10 flex items-center justify-between text-xs text-gray-500">
            <span>Mufradati v1.0</span>
            <div className="flex items-center gap-2">
              <button title="Backup & Restore" className="p-1.5 hover:bg-gray-200/60 dark:hover:bg-white/10 rounded-lg">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button title="Pengaturan" className="p-1.5 hover:bg-gray-200/60 dark:hover:bg-white/10 rounded-lg">
                <Settings className="w-3.5 h-3.5" />
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
                placeholder="Cari kata Arab, arti Indonesia, atau contoh kalimat..."
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

              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200/60 dark:border-white/10">
                <Bookmark className="w-3.5 h-3.5 text-[#D5B875]" />
                <span>Bookmark (1)</span>
              </button>
            </div>
          </header>

          {/* Continuous Scroll Book Content */}
          <div className="flex-1 overflow-y-auto px-6 py-10 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto space-y-10">
              
              {/* Book Header Section */}
              <div className="border-b-2 border-[#244D3B]/20 dark:border-white/10 pb-6 mb-8 text-center">
                <span className="inline-block px-3 py-1 bg-[#244D3B]/10 dark:bg-[#D5B875]/20 text-[#244D3B] dark:text-[#D5B875] text-xs font-semibold rounded-full mb-2">
                  Buku Kosakata Bahasa Arab
                </span>
                <h2 className="text-2xl font-bold tracking-tight">Koleksi Kosakata Terpilih</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Membaca dokumen digital berkelanjutan dengan presisi harakat dan makna.
                </p>
              </div>

              {/* Vocabulary Entries */}
              {sampleVocabulary.map((item) => (
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
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
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
                    {item.forms && (
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

                </article>
              ))}

              {/* End of Document Bookmark Notice */}
              <div className="text-center py-10 text-xs text-gray-400 flex flex-col items-center gap-2">
                <div className="w-12 h-0.5 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                <span>Akhir dokumen buku kosakata</span>
              </div>

            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

export default App;
