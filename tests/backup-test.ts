import { validateBackupJson } from '../src/features/backup/backupService.ts';

console.log('--- RUNNING BACKUP VALIDATION TEST ---');

const sampleValidBackup = {
  version: 1,
  appName: 'Mufradati',
  exportedAt: new Date().toISOString(),
  data: {
    vocabularies: [
      {
        id: 'v1',
        number: 1,
        arabic: 'غَشَّ - يَغُشُّ',
        meaning: 'Menyontek',
        categoryId: 'cat1',
        examples: [],
        bookmarked: false,
        searchIndex: 'غش',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    categories: [
      { id: 'cat1', name: 'Umum', order: 1, createdAt: '', updatedAt: '' }
    ],
    sequences: [
      { key: 'vocabulary_number', currentValue: 1 }
    ]
  }
};

try {
  const result = validateBackupJson(sampleValidBackup);
  console.log('Validated backup items:', result.data.vocabularies.length);
  if (result.data.vocabularies[0].arabic !== 'غَشَّ - يَغُشُّ') {
    throw new Error('Arabic text altered in validation');
  }
  console.log('PASS: Valid backup payload correctly accepted.');
} catch (err: any) {
  console.error('FAIL: Expected valid backup, got error:', err.message);
  process.exit(1);
}

// Test invalid payload rejection
try {
  validateBackupJson({ random: 'data' });
  console.error('FAIL: Invalid payload was unexpectedly accepted');
  process.exit(1);
} catch (err: any) {
  console.log('PASS: Invalid payload was properly rejected:', err.message);
}
