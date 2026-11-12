import { useState } from 'react';
import { 
  X, 
  FolderPlus, 
  Edit2, 
  Trash2, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import type { Category, Vocabulary } from '../../types/index.ts';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  allVocabularies: Vocabulary[];
  onAddCategory: (name: string) => Promise<any>;
  onUpdateCategory: (id: string, name: string) => Promise<any>;
  onDeleteCategory: (id: string, targetTransferCategoryId?: string) => Promise<any>;
}

export function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  allVocabularies,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}: CategoryManagerModalProps) {
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deletingCat, setDeletingCat] = useState<Category | null>(null);
  const [transferTargetId, setTransferTargetId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await onAddCategory(newCatName.trim());
      setNewCatName('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menambahkan bab.');
    }
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditingName(cat.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) return;
    try {
      await onUpdateCategory(id, editingName.trim());
      setEditingCatId(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memperbarui bab.');
    }
  };

  const handlePromptDelete = (cat: Category) => {
    setErrorMsg(null);
    const count = allVocabularies.filter(v => v.categoryId === cat.id).length;
    if (categories.length <= 1) {
      setErrorMsg('Minimal harus ada 1 bab tersisa.');
      return;
    }
    if (count > 0) {
      // Find default fallback category to transfer
      const fallback = categories.find(c => c.id !== cat.id);
      setTransferTargetId(fallback?.id || '');
      setDeletingCat(cat);
    } else {
      // Delete directly if no entries
      onDeleteCategory(cat.id);
    }
  };

  const handleConfirmDeleteWithTransfer = async () => {
    if (!deletingCat) return;
    try {
      await onDeleteCategory(deletingCat.id, transferTargetId);
      setDeletingCat(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menghapus bab.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1C2621] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#244D3B]/10 dark:bg-[#D5B875]/20 text-[#244D3B] dark:text-[#D5B875] flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-[#244D3B] dark:text-[#D5B875]">
              Kelola Daftar Bab / Kategori
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Tambah Bab Baru */}
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              placeholder="Nama bab baru (contoh: Alam & Lingkungan)..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-[#244D3B] dark:focus:border-[#D5B875] rounded-xl text-xs outline-none"
            />
            <button
              type="submit"
              disabled={!newCatName.trim()}
              className="px-4 py-2 bg-[#244D3B] hover:bg-[#1c3c2e] text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              Tambah Bab
            </button>
          </form>

          {/* List Bab */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Daftar Bab Saat Ini ({categories.length}):
            </span>

            {categories.map((cat) => {
              const count = allVocabularies.filter(v => v.categoryId === cat.id).length;
              const isEditing = editingCatId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 text-xs"
                >
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-2 mr-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-2.5 py-1 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg outline-none"
                      />
                      <button
                        onClick={() => handleSaveEdit(cat.id)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {cat.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-gray-500">
                        {count} kosakata
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-white dark:hover:bg-white/5"
                        title="Ubah nama bab"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handlePromptDelete(cat)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white dark:hover:bg-white/5"
                      title="Hapus bab"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dialog Konfirmasi Hapus Bab yang Berisi Entri */}
          {deletingCat && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span>Bab "{deletingCat.name}" berisi kosakata!</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Untuk mencegah hilangnya data kosakata, pilih bab baru untuk memindahkan seluruh kosakata terkait sebelum bab ini dihapus:
              </p>
              <select
                value={transferTargetId}
                onChange={(e) => setTransferTargetId(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#1C2621] border border-amber-300 dark:border-white/10 rounded-lg outline-none"
              >
                {categories.filter(c => c.id !== deletingCat.id).map(c => (
                  <option key={c.id} value={c.id}>Pindahkan ke: {c.name}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDeletingCat(null)}
                  className="px-3 py-1.5 border border-gray-300 dark:border-white/20 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteWithTransfer}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg"
                >
                  Pindahkan & Hapus Bab
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-white/10 flex justify-end bg-gray-50/50 dark:bg-white/[0.01]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-300 dark:border-white/20 rounded-xl text-xs font-medium hover:bg-gray-100 dark:hover:bg-white/5"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
