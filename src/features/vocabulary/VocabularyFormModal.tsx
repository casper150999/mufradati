import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Category, Example, VocabularyForm } from '../../types/index.ts';

interface VocabularyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (data: {
    arabic: string;
    meaning: string;
    categoryId: string;
    forms?: VocabularyForm[];
    examples: Example[];
  }) => Promise<void>;
}

export function VocabularyFormModal({
  isOpen,
  onClose,
  categories,
  onSubmit
}: VocabularyFormModalProps) {
  const [arabic, setArabic] = useState('');
  const [meaning, setMeaning] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [forms, setForms] = useState<VocabularyForm[]>([
    { label: 'Madhi', value: '' },
    { label: 'Mudhari\'', value: '' }
  ]);
  const [examples, setExamples] = useState<Array<{ arabic: string; translation: string }>>([
    { arabic: '', translation: '' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddForm = () => {
    setForms([...forms, { label: 'Bentuk Lain', value: '' }]);
  };

  const handleRemoveForm = (index: number) => {
    setForms(forms.filter((_, i) => i !== index));
  };

  const handleAddExample = () => {
    setExamples([...examples, { arabic: '', translation: '' }]);
  };

  const handleRemoveExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arabic.trim() || !meaning.trim()) return;

    setSubmitting(true);
    try {
      const validForms = forms.filter(f => f.value.trim());
      const validExamples: Example[] = examples
        .filter(ex => ex.arabic.trim())
        .map(ex => ({
          id: crypto.randomUUID(),
          arabic: ex.arabic.trim(),
          translation: ex.translation.trim()
        }));

      await onSubmit({
        arabic: arabic.trim(),
        meaning: meaning.trim(),
        categoryId: categoryId || categories[0]?.id || 'cat_umum',
        forms: validForms,
        examples: validExamples
      });

      // Reset & close
      setArabic('');
      setMeaning('');
      onClose();
    } catch (err) {
      console.error('Failed to save vocabulary:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1C2621] w-full max-w-2xl rounded-2xl shadow-xl border border-gray-200/80 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-lg text-[#244D3B] dark:text-[#D5B875]">
            Tambah Kosakata Baru
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Kata Arab & Kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Kata Arab (Berharakat) *
              </label>
              <input
                type="text"
                required
                dir="rtl"
                placeholder="غَشَّ - يَغُشُّ"
                value={arabic}
                onChange={(e) => setArabic(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-[#244D3B] dark:focus:border-[#D5B875] rounded-xl font-arabic text-xl outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Kategori / Bab
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#222F29] border border-gray-200 dark:border-white/10 focus:border-[#244D3B] dark:focus:border-[#D5B875] rounded-xl text-sm outline-none transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Arti Indonesia */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Arti / Makna Indonesia *
            </label>
            <input
              type="text"
              required
              placeholder="Menyontek / Menipu"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-[#244D3B] dark:focus:border-[#D5B875] rounded-xl text-sm outline-none transition-all"
            />
          </div>

          {/* Bentuk Kata Tambahan */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Bentuk Kata Tambahan (Fi'il / Jamak / Mashdar)
              </label>
              <button
                type="button"
                onClick={handleAddForm}
                className="text-xs text-[#244D3B] dark:text-[#D5B875] font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Bentuk
              </button>
            </div>
            <div className="space-y-2">
              {forms.map((form, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Label (contoh: Madhi)"
                    value={form.label}
                    onChange={(e) => {
                      const updated = [...forms];
                      updated[idx].label = e.target.value;
                      setForms(updated);
                    }}
                    className="w-32 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs outline-none"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="Nilai Arab (contoh: غَشَّ)"
                    value={form.value}
                    onChange={(e) => {
                      const updated = [...forms];
                      updated[idx].value = e.target.value;
                      setForms(updated);
                    }}
                    className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl font-arabic text-base outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveForm(idx)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contoh Kalimat (Jumlah Mufidah) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Jumlah Mufidah (Contoh Kalimat)
              </label>
              <button
                type="button"
                onClick={handleAddExample}
                className="text-xs text-[#244D3B] dark:text-[#D5B875] font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Contoh
              </button>
            </div>
            <div className="space-y-3">
              {examples.map((ex, idx) => (
                <div key={idx} className="p-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#4F8067]">Contoh #{idx + 1}</span>
                    {examples.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExample(idx)}
                        className="text-gray-400 hover:text-red-500 text-xs"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="Kalimat Arab (contoh: حَرَّمَ الإِسْلَامُ أَنْ يَغُشَّ...)"
                    value={ex.arabic}
                    onChange={(e) => {
                      const updated = [...examples];
                      updated[idx].arabic = e.target.value;
                      setExamples(updated);
                    }}
                    className="w-full px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg font-arabic text-base outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Terjemahan bahasa Indonesia..."
                    value={ex.translation}
                    onChange={(e) => {
                      const updated = [...examples];
                      updated[idx].translation = e.target.value;
                      setExamples(updated);
                    }}
                    className="w-full px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-white/20 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#244D3B] hover:bg-[#1c3c2e] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Kosakata'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

