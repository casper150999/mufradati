import Dexie, { type Table } from 'dexie';
import type { Vocabulary, Category, ImportBatch, Sequence, UserSettings } from '../types/index.ts';

export class MufradatiDatabase extends Dexie {
  vocabularies!: Table<Vocabulary, string>;
  categories!: Table<Category, string>;
  import_batches!: Table<ImportBatch, string>;
  sequences!: Table<Sequence, string>;
  user_settings!: Table<UserSettings, string>;

  constructor() {
    super('MufradatiDB');
    
    // Version 1 Schema
    this.version(1).stores({
      vocabularies: 'id, number, categoryId, bookmarked, importBatchId, createdAt',
      categories: 'id, order, createdAt',
      import_batches: 'id, importedAt, status',
      sequences: 'key',
      user_settings: 'key'
    });

    // Version 2 Schema (Ensures safe upgrade and explicit index availability on existing clients)
    this.version(2).stores({
      vocabularies: 'id, number, categoryId, bookmarked, importBatchId, createdAt',
      categories: 'id, order, createdAt',
      import_batches: 'id, importedAt, status',
      sequences: 'key',
      user_settings: 'key'
    });
  }
}

export const db = new MufradatiDatabase();

/**
 * Atomic sequence counter generator.
 * Guarantees persistent, monotonically increasing global numbers.
 * Numbers are NEVER reused even after deletion.
 * 
 * FIX: Scope includes BOTH db.sequences AND db.vocabularies to prevent 
 * "NotFoundError: The specified object store was not found on IDBTransaction"
 */
export async function getNextVocabularyNumbers(count: number = 1): Promise<number[]> {
  return await db.transaction('rw', [db.sequences, db.vocabularies], async () => {
    const seq = await db.sequences.get('vocabulary_number');
    let startVal = seq ? seq.currentValue : 0;
    
    // Fallback: check highest existing vocabulary number if sequence is not yet initialized
    if (!seq) {
      const highestVocab = await db.vocabularies.orderBy('number').last();
      if (highestVocab && highestVocab.number > startVal) {
        startVal = highestVocab.number;
      }
    }

    const assignedNumbers: number[] = [];
    for (let i = 1; i <= count; i++) {
      assignedNumbers.push(startVal + i);
    }

    const newVal = startVal + count;
    await db.sequences.put({
      key: 'vocabulary_number',
      currentValue: newVal
    });

    return assignedNumbers;
  });
}

/**
 * Initialize default initial categories if database is brand new
 */
export async function seedInitialCategories(): Promise<void> {
  const count = await db.categories.count();
  if (count === 0) {
    const defaultCategories: Category[] = [
      {
        id: 'cat_umum',
        name: 'Umum',
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'cat_akhlak',
        name: 'Perilaku & Akhlak',
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'cat_pendidikan',
        name: 'Pendidikan & Belajar',
        order: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    await db.categories.bulkAdd(defaultCategories);
  }
}
