import { parseSmartPasteText } from '../src/features/smart-paste/smartPasteParser.ts';

const testInput = `٣١١. غَشَّ - يَغُشُّ
Arti: Menyontek / Menipu
Jumlah Mufidah:
① حَرَّمَ الإِسْلَامُ أَنْ يَغُشَّ الطَّالِبُ فِي الِامْتِحَانِ.
Islam mengharamkan siswa untuk menyontek dalam ujian.
② لَمْ يَغُشَّ زَيْدٌ فِي الِاخْتِبَارِ لِأَنَّهُ مَاهِرٌ.
Zaid tidak menyontek saat ujian karena dia pintar.
③ مَنْ غَشَّنَا فَلَيْسَ مِنَّا.
Barang siapa yang menipu/menyontek kami, maka ia bukan dari golongan kami.

٣١٢. اِجْتَهَدَ - يَجْتَهِدُ
Arti: Bersungguh-sungguh / Berjuang keras
Jumlah Mufidah:
① يَجْتَهِدُ التِّلْمِيذُ فِي دِرَاسَتِهِ لِيَنْجَحَ فِي الِامْتِحَانِ.
Murid itu bersungguh-sungguh dalam belajarnya agar lulus ujian.
② مَنْ جَدَّ وَجَدَ، وَمَنِ اجْتَهَدَ حَصَدَ.
Barang siapa bersungguh-sungguh dia akan berhasil, dan siapa yang berjuang dia akan menuai hasilnya.`;

console.log('--- RUNNING SMART PASTE PARSER TEST ---');
const parsed = parseSmartPasteText(testInput);

console.log(`Parsed total entries: ${parsed.length}`);
if (parsed.length !== 2) {
  console.error('FAIL: Expected 2 entries, got', parsed.length);
  process.exit(1);
}

const item1 = parsed[0];
console.log('Item 1 Arabic:', item1.arabic);
console.log('Item 1 Meaning:', item1.meaning);
console.log('Item 1 Forms:', item1.forms.length);
console.log('Item 1 Examples:', item1.examples.length);

if (item1.arabic !== 'غَشَّ - يَغُشُّ' || item1.meaning !== 'Menyontek / Menipu' || item1.examples.length !== 3) {
  console.error('FAIL: Item 1 attributes mismatch');
  process.exit(1);
}

// Check exact harakat preservation
const ex1 = item1.examples[0];
if (!ex1.arabic.includes('حَرَّمَ الإِسْلَامُ أَنْ يَغُشَّ')) {
  console.error('FAIL: Arabic harakat was damaged or missing in Example 1');
  process.exit(1);
}

console.log('PASS: All parser tests succeeded with 100% Arabic diacritics preservation!');

