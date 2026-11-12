import { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  Printer, 
  AlertTriangle, 
  CheckCircle2,
  FileJson
} from 'lucide-react';
import { 
  exportDatabaseToJson, 
  validateBackupJson, 
  restoreDatabaseFromJson, 
  type MufradatiBackupPayload 
} from './backupService.ts';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
  onPrintPdf: () => void;
}

export function BackupModal({
  isOpen,
  onClose,
  onDataRestored,
  onPrintPdf
}: BackupModalProps) {
  const [fileToRestore, setFileToRestore] = useState<MufradatiBackupPayload | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [restoreMode, setRestoreMode] = useState<'overwrite' | 'merge'>('overwrite');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJson = async () => {
    try {
      await exportDatabaseToJson();
      setSuccessMsg('File cadangan JSON berhasil diunduh.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg('Gagal mengekspor data: ' + err.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const validated = validateBackupJson(parsed);
        setFileToRestore(validated);
      } catch (err: any) {
        setErrorMsg(err.message || 'Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = async () => {
    if (!fileToRestore) return;
    setIsProcessing(true);
    try {
      const res = await restoreDatabaseFromJson(fileToRestore, restoreMode);
      setSuccessMsg(`Berhasil memulihkan ${res.restoredVocabs} kosakata dan ${res.restoredCats} kategori.`);
      setFileToRestore(null);
      onDataRestored();
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMsg('Gagal memulihkan data: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1C2621] w-full max-w-xl rounded-2xl shadow-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#244D3B]/10 dark:bg-[#D5B875]/20 text-[#244D3B] dark:text-[#D5B875] flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-[#244D3B] dark:text-[#D5B875]">
              Cadangan, Pemulihan & Ekspor
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Section 1: Backup & PDF Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExportJson}
              className="p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-[#244D3B] dark:hover:border-[#D5B875] bg-gray-50/50 dark:bg-white/[0.02] text-left transition-all group"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">
                <FileJson className="w-4 h-4 text-[#244D3B] dark:text-[#D5B875]" />
                <span>Unduh Cadangan JSON</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Simpan seluruh kosakata dan bab ke file JSON lokal di komputer Anda.
              </p>
            </button>

            <button
              onClick={() => {
                onClose();
                onPrintPdf();
              }}
              className="p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-[#244D3B] dark:hover:border-[#D5B875] bg-gray-50/50 dark:bg-white/[0.02] text-left transition-all group"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">
                <Printer className="w-4 h-4 text-[#244D3B] dark:text-[#D5B875]" />
                <span>Cetak / Ekspor PDF</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Cetak dokumen digital ke PDF dengan font Amiri dan tata letak RTL rapi.
              </p>
            </button>
          </div>

          {/* Section 2: Restore JSON */}
          <div className="pt-4 border-t border-gray-100 dark:border-white/10 space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Pulihkan Data dari File Cadangan (Restore)
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            {!fileToRestore ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-white/15 hover:border-[#244D3B] dark:hover:border-[#D5B875] rounded-xl flex flex-col items-center justify-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Klik untuk memilih file backup JSON</span>
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-[#F8F7F1] dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    File Siap: {fileToRestore.data.vocabularies.length} Kosakata, {fileToRestore.data.categories.length} Kategori
                  </span>
                  <button
                    onClick={() => setFileToRestore(null)}
                    className="text-red-500 hover:underline"
                  >
                    Batal
                  </button>
                </div>

                {/* Mode restore selection */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="restoreMode"
                      checked={restoreMode === 'overwrite'}
                      onChange={() => setRestoreMode('overwrite')}
                      className="accent-[#244D3B]"
                    />
                    <span><strong>Timpa Seluruh Data</strong> (Data lama digantikan data backup)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="restoreMode"
                      checked={restoreMode === 'merge'}
                      onChange={() => setRestoreMode('merge')}
                      className="accent-[#244D3B]"
                    />
                    <span><strong>Gabungkan Data</strong> (Hanya tambahkan yang belum ada)</span>
                  </label>
                </div>

                <button
                  disabled={isProcessing}
                  onClick={handleExecuteRestore}
                  className="w-full mt-2 py-2 bg-[#244D3B] text-white rounded-lg text-xs font-semibold hover:bg-[#1c3c2e] transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Memulihkan Data...' : 'Konfirmasi & Pulihkan Sekarang'}
                </button>
              </div>
            )}
          </div>
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
