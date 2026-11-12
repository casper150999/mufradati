import { useState, useEffect, useCallback } from 'react';
import { db, getNextVocabularyNumbers, seedInitialCategories } from '../database/db.ts';
import type { Vocabulary, Category, Example, VocabularyForm } from '../types/index.ts';
import { buildSearchIndex, stripArabicDiacritics } from '../lib/arabic-utils.ts';

export function useMufradati() {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  // Load all initial data from IndexedDB
  const refreshData = useCallback(async () => {
    try {
      await seedInitialCategories();
      const [allVocabs, allCats] = await Promise.all([
        db.vocabularies.orderBy('number').toArray(),
        db.categories.orderBy('order').toArray()
      ]);
      setVocabularies(allVocabs);
      setCategories(allCats);
    } catch (err) {
      console.error('Failed to load database:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Add a new vocabulary with atomic sequence number
  const addVocabulary = async (data: {
    arabic: string;
    meaning: string;
    categoryId: string;
    forms?: VocabularyForm[];
    examples: Example[];
    sourceRawText?: string;
    importBatchId?: string;
  }): Promise<Vocabulary> => {
    const [assignedNumber] = await getNextVocabularyNumbers(1);
    const searchIndex = buildSearchIndex(data.arabic, data.meaning, data.forms, data.examples);
    
    const newVocab: Vocabulary = {
      id: crypto.randomUUID(),
      number: assignedNumber,
      arabic: data.arabic,
      meaning: data.meaning,
      categoryId: data.categoryId,
      forms: data.forms || [],
      examples: data.examples || [],
      bookmarked: false,
      sourceRawText: data.sourceRawText,
      importBatchId: data.importBatchId,
      searchIndex,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.vocabularies.add(newVocab);
    await refreshData();
    return newVocab;
  };

  // Update existing vocabulary
  const updateVocabulary = async (
    id: string, 
    updates: Partial<Omit<Vocabulary, 'id' | 'number' | 'createdAt'>>
  ): Promise<void> => {
    const existing = await db.vocabularies.get(id);
    if (!existing) return;

    const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    merged.searchIndex = buildSearchIndex(merged.arabic, merged.meaning, merged.forms, merged.examples);

    await db.vocabularies.put(merged);
    await refreshData();
  };

  // Delete vocabulary
  const deleteVocabulary = async (id: string): Promise<void> => {
    await db.vocabularies.delete(id);
    await refreshData();
  };

  // Toggle bookmark
  const toggleBookmark = async (id: string): Promise<void> => {
    const existing = await db.vocabularies.get(id);
    if (!existing) return;
    await db.vocabularies.update(id, { 
      bookmarked: !existing.bookmarked,
      updatedAt: new Date().toISOString()
    });
    await refreshData();
  };

  // Add multiple vocabularies in an atomic batch
  const addBatchVocabularies = async (
    items: Array<{
      arabic: string;
      meaning: string;
      categoryId: string;
      forms?: VocabularyForm[];
      examples: Example[];
      sourceRawText?: string;
    }>,
    rawBatchText: string
  ): Promise<{ batchId: string; count: number }> => {
    const batchId = crypto.randomUUID();
    const count = items.length;
    if (count === 0) return { batchId, count: 0 };

    const assignedNumbers = await getNextVocabularyNumbers(count);
    const vocabEntities: Vocabulary[] = items.map((item, idx) => {
      const searchIndex = buildSearchIndex(item.arabic, item.meaning, item.forms, item.examples);
      return {
        id: crypto.randomUUID(),
        number: assignedNumbers[idx],
        arabic: item.arabic,
        meaning: item.meaning,
        categoryId: item.categoryId,
        forms: item.forms || [],
        examples: item.examples || [],
        bookmarked: false,
        sourceRawText: item.sourceRawText,
        importBatchId: batchId,
        searchIndex,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    await db.transaction('rw', [db.vocabularies, db.import_batches], async () => {
      await db.vocabularies.bulkAdd(vocabEntities);
      await db.import_batches.add({
        id: batchId,
        importedAt: new Date().toISOString(),
        vocabularyIds: vocabEntities.map(v => v.id),
        sourceRawText: rawBatchText,
        status: 'completed'
      });
    });

    await refreshData();
    return { batchId, count };
  };

  // Undo last import batch
  const undoLastImport = async (): Promise<boolean> => {
    const lastBatch = await db.import_batches
      .where('status')
      .equals('completed')
      .reverse()
      .sortBy('importedAt');

    if (!lastBatch || lastBatch.length === 0) return false;
    const target = lastBatch[0];

    await db.transaction('rw', [db.vocabularies, db.import_batches], async () => {
      await db.vocabularies.bulkDelete(target.vocabularyIds);
      await db.import_batches.update(target.id, { status: 'undone' });
    });

    await refreshData();
    return true;
  };

  // Filtered list based on active category, search query, and bookmarks
  const filteredVocabularies = vocabularies.filter((v) => {
    // 1. Filter Category
    if (activeCategory !== 'all' && v.categoryId !== activeCategory) {
      return false;
    }

    // 2. Filter Bookmark
    if (bookmarkedOnly && !v.bookmarked) {
      return false;
    }

    // 3. Search Query Filter (diacritics-agnostic & case-insensitive)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const qStripped = stripArabicDiacritics(q);
      const indexLower = v.searchIndex.toLowerCase();

      return (
        indexLower.includes(q) ||
        indexLower.includes(qStripped) ||
        String(v.number).includes(q)
      );
    }

    return true;
  });

  // Seed sample initial entry if database is completely empty
  const seedSampleEntryIfEmpty = async () => {
    const count = await db.vocabularies.count();
    if (count === 0 && categories.length > 0) {
      const catAkhlak = categories.find(c => c.name.includes('Akhlak')) || categories[0];
      await addVocabulary({
        arabic: 'غَشَّ - يَغُشُّ',
        meaning: 'Menyontek / Menipu',
        categoryId: catAkhlak.id,
        forms: [
          { label: 'Madhi', value: 'غَشَّ' },
          { label: 'Mudhari\'', value: 'يَغُشُّ' },
          { label: 'Mashdar', value: 'غَشًّا' }
        ],
        examples: [
          {
            id: crypto.randomUUID(),
            arabic: 'حَرَّمَ الإِسْلَامُ أَنْ يَغُشَّ الطَّالِبُ فِي الِامْتِحَانِ.',
            translation: 'Islam mengharamkan siswa untuk menyontek dalam ujian.'
          },
          {
            id: crypto.randomUUID(),
            arabic: 'لَمْ يَغُشَّ زَيْدٌ فِي الِاخْتِبَارِ لِأَنَّهُ مَاهِرٌ.',
            translation: 'Zaid tidak menyontek saat ujian karena dia pintar.'
          },
          {
            id: crypto.randomUUID(),
            arabic: 'مَنْ غَشَّنَا فَلَيْسَ مِنَّا.',
            translation: 'Barang siapa yang menipu/menyontek kami, maka ia bukan dari golongan kami.'
          }
        ]
      });
    }
  };

  // Category Management
  const addCategory = async (name: string): Promise<Category> => {
    const highestOrder = categories.length > 0 
      ? Math.max(...categories.map(c => c.order)) 
      : 0;

    const newCat: Category = {
      id: crypto.randomUUID(),
      name,
      order: highestOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.categories.add(newCat);
    await refreshData();
    return newCat;
  };

  const updateCategory = async (id: string, name: string): Promise<void> => {
    await db.categories.update(id, {
      name,
      updatedAt: new Date().toISOString()
    });
    await refreshData();
  };

  const deleteCategory = async (id: string, transferTargetCategoryId?: string): Promise<void> => {
    await db.transaction('rw', [db.categories, db.vocabularies], async () => {
      if (transferTargetCategoryId) {
        // Transfer all vocabularies to the target category
        const affectedVocabs = await db.vocabularies.where('categoryId').equals(id).toArray();
        for (const v of affectedVocabs) {
          await db.vocabularies.update(v.id, {
            categoryId: transferTargetCategoryId,
            updatedAt: new Date().toISOString()
          });
        }
      }
      await db.categories.delete(id);
    });

    if (activeCategory === id) {
      setActiveCategory('all');
    }
    await refreshData();
  };

  return {
    vocabularies: filteredVocabularies,
    allVocabularies: vocabularies,
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
    updateVocabulary,
    deleteVocabulary,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleBookmark,
    refreshData,
    seedSampleEntryIfEmpty
  };
}

