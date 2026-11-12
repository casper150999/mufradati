export interface VocabularyForm {
  label: string;
  value: string;
}

export interface Example {
  id: string;
  arabic: string;
  translation: string;
}

export interface Vocabulary {
  id: string;
  number: number;
  arabic: string;
  forms?: VocabularyForm[];
  meaning: string;
  categoryId: string;
  illustrationId?: string;
  examples: Example[];
  bookmarked: boolean;
  sourceRawText?: string;
  importBatchId?: string;
  searchIndex: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ImportBatch {
  id: string;
  importedAt: string;
  vocabularyIds: string[];
  sourceRawText: string;
  status: 'completed' | 'undone';
}

export interface Sequence {
  key: string;
  currentValue: number;
}

export interface UserSettings {
  key: string;
  arabicFontSize: number;
  spacingLevel: 'compact' | 'normal' | 'relaxed';
  theme: 'light' | 'dark';
  focusMode: boolean;
}

