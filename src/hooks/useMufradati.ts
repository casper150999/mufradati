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
    updateVocabulary,
    deleteVocabulary,
    toggleBookmark,
    refreshData,
    seedSampleEntryIfEmpty
  };
}
