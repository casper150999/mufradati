import { db, seedInitialCategories } from '../src/database/db.ts';
import { parseSmartPasteText } from '../src/features/smart-paste/smartPasteParser.ts';

// Test saving parsed item directly to IndexedDB simulation
console.log('Testing schema and parser structures...');

const raw = `٣١١. غَشَّ - يَغُشُّ
Arti: Menyontek / Menipu
Jumlah Mufidah:
① حَرَّمَ الإِسْلَامُ أَنْ يَغُشَّ الطَّالِبُ فِي الِامْتِحَانِ.
Islam mengharamkan siswa untuk menyontek dalam ujian.`;

const parsed = parseSmartPasteText(raw);
console.log('Parsed count:', parsed.length);
if (parsed.length === 0) {
  console.error('FAIL: No items parsed');
  process.exit(1);
}

const item = parsed[0];
console.log('Arabic:', item.arabic);
console.log('Meaning:', item.meaning);
console.log('Forms:', JSON.stringify(item.forms));
console.log('Examples:', JSON.stringify(item.examples));
console.log('Success test');
