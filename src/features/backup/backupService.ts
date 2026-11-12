import { db } from '../../database/db.ts';
import type { Vocabulary, Category, Sequence } from '../../types/index.ts';

export interface MufradatiBackupPayload {
  version: number;
  appName: string;
  exportedAt: string;
  data: {
    vocabularies: Vocabulary[];
    categories: Category[];
    sequences: Sequence[];
  };
}

/**
 * Export all database contents into a structured JSON file.
 */
export async function exportDatabaseToJson(): Promise<void> {
  const [vocabularies, categories, sequences] = await Promise.all([
    db.vocabularies.toArray(),
    db.categories.toArray(),
    db.sequences.toArray()
  ]);

  const payload: MufradatiBackupPayload = {
    version: 1,
    appName: 'Mufradati',
    exportedAt: new Date().toISOString(),
    data: {
      vocabularies,
      categories,
      sequences
    }
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `mufradati_backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Validate imported JSON schema before committing to database.
 */
export function validateBackupJson(rawJson: any): MufradatiBackupPayload {
  if (!rawJson || typeof rawJson !== 'object') {
    throw new Error('Format file cadangan tidak valid (bukan objek JSON).');
  }

  if (rawJson.appName !== 'Mufradati' && !rawJson.data) {
    throw new Error('File ini bukan file cadangan resmi Mufradati.');
  }

  if (!rawJson.data.vocabularies || !Array.isArray(rawJson.data.vocabularies)) {
    throw new Error('Data kosakata tidak ditemukan dalam file cadangan.');
  }

  return rawJson as MufradatiBackupPayload;
}

/**
 * Restore database from valid payload with overwrite or merge strategy.
 */
export async function restoreDatabaseFromJson(
  payload: MufradatiBackupPayload, 
  mode: 'overwrite' | 'merge' = 'overwrite'
): Promise<{ restoredVocabs: number; restoredCats: number }> {
  const { vocabularies, categories, sequences } = payload.data;

  return await db.transaction('rw', [db.vocabularies, db.categories, db.sequences, db.import_batches], async () => {
    if (mode === 'overwrite') {
      await db.vocabularies.clear();
      await db.categories.clear();
      await db.sequences.clear();
      await db.import_batches.clear();

      await db.vocabularies.bulkAdd(vocabularies);
      await db.categories.bulkAdd(categories);
      if (sequences && sequences.length > 0) {
        await db.sequences.bulkAdd(sequences);
      }
    } else {
      // Merge strategy: add missing categories and vocabularies
      for (const cat of categories) {
        const exists = await db.categories.get(cat.id);
        if (!exists) {
          await db.categories.add(cat);
        }
      }
      for (const v of vocabularies) {
        const exists = await db.vocabularies.get(v.id);
        if (!exists) {
          await db.vocabularies.add(v);
        }
      }
    }

    return {
      restoredVocabs: vocabularies.length,
      restoredCats: categories.length
    };
  });
}
