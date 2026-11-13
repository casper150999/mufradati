import { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Trash2, 
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';
import type { Category } from '../../types/index.ts';
import { 
  parseSmartPasteText, 
  type ParsedVocabularyItem 
} from './smartPasteParser.ts';

interface SmartPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCommitBatch: (
    items: ParsedVocabularyItem[], 
    categoryId: string, 
    rawText: string
  ) => Promise<void>;
}

export function SmartPasteModal({
  isOpen,
  onClose,
  categories,
  onCommitBatch
}: SmartPasteModalProps) {
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [rawText, setRawText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || 'cat_umum');
  const [parsedItems, setParsedItems] = useState<ParsedVocabularyItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commitError, setCommitError] = useState<string | null>(null);

  // Sync selectedCategoryId if categories change
  useEffect(() => {
    if (categories.length > 0 && (!selectedCategoryId || !categories.some(c => c.id === selectedCategoryId))) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  if (!isOpen) return null;

  const handleParse = () => {
    setCommitError(null);
    if (!rawText.trim()) return;
    const results = parseSmartPasteText(rawText);
    setParsedItems(results);
    setStep('preview');
  };

  const handleUpdateItem = (index: number, field: keyof ParsedVocabularyItem, value: any) => {
    const updated = [...parsedItems];
    updated[index] = { ...updated[index], [field]: value };
    setParsedItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setParsedItems(parsedItems.filter((_, i) => i !== index));
  };

  const handleUpdateExample = (
    itemIndex: number, 
    exampleIndex: number, 
    field: 'arabic' | 'translation', 
    val: string
  ) => {
    const updated = [...parsedItems];
    const item = { ...updated[itemIndex] };
    const examples = [...item.examples];
    examples[exampleIndex] = { ...examples[exampleIndex], [field]: val };
    item.examples = examples;
    updated[itemIndex] = item;
    setParsedItems(updated);
  };

  const handleCommit = async () => {
    if (parsedItems.length === 0) return;
    setIsSubmitting(true);
    setCommitError(null);
    try {
      const targetCatId = selectedCategoryId || categories[0]?.id || 'cat_umum';
      await onCommitBatch(parsedItems, targetCatId, rawText);
      // Reset state and close
      setStep('input');
      setRawText('');
      setParsedItems([]);
      onClose();
    } catch (err: any) {
      console.error('Failed to commit batch:', err);
      setCommitError(err.message || 'Terjadi kesalahan saat menyimpan ke database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1C2621] w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-[#F8F7F1]/80 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#244D3B] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-[#D5B875]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#244D3B] dark:text-[#D5B875]">
                Smart Paste AI Parser
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Otomatisasi perapian kosakata dari ChatGPT tanpa Google Docs manual
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-200/60 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: INPUT WORKBENCH */}
        {step === 'input' && (
          <div className="p-6 flex-1 overflow-y-auto space-y-5">
            {/* Target Category Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F8F7F1] dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/5">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Kategori Tujuan Impor:
                </span>
                <span className="text-xs text-gray-400">
                  Kosakata yang diimpor akan dimasukkan ke dalam bab ini.
                </span>
              </div>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-[#222F29] border border-gray-300 dark:border-white/10 rounded-xl text-sm font-medium outline-none focus:border-[#244D3B] dark:focus:border-[#D5B875]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Paste Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#4F8067]" />
                  Tempelkan Teks Bebas Dari AI Di Bawah:
                </label>
                <span className="text-xs text-gray-400">Mendukung satu atau banyak kosakata sekaligus</span>
              </div>

              <textarea
                rows={12}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={`Contoh teks dari AI:
٣١١. غَشَّ - يَغُشُّ
Arti: Menyontek / Menipu
Jumlah Mufidah:
① حَرَّمَ الإِسْلَامُ أَنْ يَغُشَّ الطَّالِبُ فِي الِامْتِحَانِ.
Islam mengharamkan siswa untuk menyontek dalam ujian.
② لَمْ يَغُشَّ زَيْدٌ فِي الِاخْتِبَارِ لِأَنَّهُ مَاهِرٌ.
Zaid tidak menyontek saat ujian karena dia pintar.`}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] focus:bg-white dark:focus:bg-transparent focus:border-[#244D3B] dark:focus:border-[#D5B875] text-sm font-mono outline-none transition-all leading-relaxed"
              />
            </div>

            {/* Quick Sample Loader */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setRawText(`٣١١. غَشَّ - يَغُشُّ
Arti: Menyontek / Menipu
Jumlah Mufidah:
① حَرَّمَ الإِسْلَامُ أَنْ يَغُشَّ الطَّالِبُ فِي الِامْتِحَانِ.
Islam mengharamkan siswa untuk menyontek dalam ujian.
② لَمْ يَغُشَّ زَيْدٌ فِي الِاخْتِبَارِ لِأَنَّهُ مَاهِرٌ.
Zaid tidak menyontek saat ujian karena dia pintar.
③ مَنْ غَشَّنَا فَلَيْسَ مِنَّا.
Barang siapa yang menipu/menyontek kami, maka ia bukan dari golongan kami.

٣١٢. اِجْتَهَدَ - يَجْتَهِدُ
Arti: Bersungguh-sungguh / Berjuang keras
Jumlah Mufidah:
① يَجْتَهِدُ التِّلْمِيذُ فِي دِرَاسَتِهِ لِيَنْجَحَ فِي الِامْتِحَانِ.
Murid itu bersungguh-sungguh dalam belajarnya agar lulus ujian.
② مَنْ جَدَّ وَجَدَ، وَمَنِ اجْتَهَدَ حَصَدَ.
Barang siapa bersungguh-sungguh dia akan berhasil, dan siapa yang berjuang dia akan menuai hasilnya.`);
                }}
                className="text-xs text-[#244D3B] dark:text-[#D5B875] font-semibold hover:underline"
              >
                Gunakan Contoh Teks Asli AI (311 - 312)
              </button>

              <button
                type="button"
                disabled={!rawText.trim()}
                onClick={handleParse}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#244D3B] hover:bg-[#1b3b2d] text-white rounded-xl text-sm font-medium transition-all shadow-md disabled:opacity-50"
              >
                <span>Proses & Pratinjau</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: INTERACTIVE PREVIEW & ADJUSTMENT */}
        {step === 'preview' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Preview Sub-header */}
            <div className="px-6 py-3 bg-[#244D3B]/5 dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#244D3B] dark:text-[#D5B875]" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Terdeteksi {parsedItems.length} entri kosakata.
                </span>
                <span className="text-gray-400">Silakan periksa dan koreksi sebelum disimpan.</span>
              </div>
              <button
                onClick={() => setStep('input')}
                className="font-medium text-[#244D3B] dark:text-[#D5B875] hover:underline"
              >
                Edit Teks Sumber
              </button>
            </div>

            {/* Scrollable Preview List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {commitError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{commitError}</span>
                </div>
              )}
              {parsedItems.map((item, idx) => (
                <div
                  key={item.tempId}
                  className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1C2621] shadow-sm space-y-4 hover:border-[#244D3B]/40 transition-colors"
                >
                  {/* Item Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#244D3B]/10 dark:bg-[#D5B875]/20 text-[#244D3B] dark:text-[#D5B875] font-bold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      {item.sourceNumber && (
                        <span className="text-xs text-gray-400">
                          (Nomor Asli AI: {item.sourceNumber})
                        </span>
                      )}
                      {item.isAmbiguous && (
                        <span className="flex items-center gap-1 text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                          <AlertCircle className="w-3 h-3" /> Perlu Diperiksa
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                      title="Keluarkan dari batch impor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Arabic Word & Meaning Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Kata Arab (Berharakat Utuh)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={item.arabic}
                        onChange={(e) => handleUpdateItem(idx, 'arabic', e.target.value)}
                        className="w-full px-3.5 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl font-arabic text-xl outline-none focus:border-[#244D3B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Arti / Makna Indonesia
                      </label>
                      <input
                        type="text"
                        value={item.meaning}
                        onChange={(e) => handleUpdateItem(idx, 'meaning', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold outline-none focus:border-[#244D3B]"
                      />
                    </div>
                  </div>

                  {/* Examples (Jumlah Mufidah) */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-[#4F8067] dark:text-[#D5B875] uppercase tracking-wider block">
                      Jumlah Mufidah ({item.examples.length} contoh):
                    </span>
                    <div className="space-y-3">
                      {item.examples.map((ex, eIdx) => (
                        <div key={ex.id} className="p-3 bg-[#F8F7F1]/70 dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/5 rounded-xl space-y-1.5">
                          <input
                            type="text"
                            dir="rtl"
                            value={ex.arabic}
                            onChange={(e) => handleUpdateExample(idx, eIdx, 'arabic', e.target.value)}
                            className="w-full px-3 py-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg font-arabic text-base outline-none focus:border-[#244D3B]"
                          />
                          <input
                            type="text"
                            value={ex.translation}
                            onChange={(e) => handleUpdateExample(idx, eIdx, 'translation', e.target.value)}
                            className="w-full px-3 py-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs outline-none focus:border-[#244D3B]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between bg-[#F8F7F1]/80 dark:bg-white/[0.02]">
              <span className="text-xs text-gray-500">
                Nomor urut global akan diberikan otomatis secara berurutan.
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="px-4 py-2 border border-gray-300 dark:border-white/20 rounded-xl text-xs font-medium hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  disabled={isSubmitting || parsedItems.length === 0}
                  onClick={handleCommit}
                  className="flex items-center gap-2 px-6 py-2 bg-[#244D3B] hover:bg-[#1b3b2d] text-white rounded-xl text-xs font-semibold shadow-md transition-all disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-[#D5B875]" />
                  <span>{isSubmitting ? 'Menyimpan Batch...' : `Simpan ${parsedItems.length} Kosakata Ke Buku`}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
