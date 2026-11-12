/**
 * SMART PASTE PARSER ENGINE (Offline TypeScript Rule-Based Tokenizer)
 * 
 * Strict Arabic text preservation rules:
 * - NO stripping of diacritics / harakat (fathah, kasrah, dammah, tanwin, sukun, shaddah)
 * - NO alteration of Arabic punctuation
 * - Preserves exact characters from source text
 */

export interface ParsedExample {
  id: string;
  arabic: string;
  translation: string;
}

export interface ParsedForm {
  label: string;
  value: string;
}

export interface ParsedVocabularyItem {
  tempId: string;
  sourceNumber?: string;
  arabic: string;
  meaning: string;
  forms: ParsedForm[];
  examples: ParsedExample[];
  rawBlock: string;
  isAmbiguous?: boolean;
}

// Regex to detect if a string contains substantial Arabic characters
const CONTAINS_ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

// Regex to match entry header numbers: e.g. "311.", "٣١١.", "1)", "[1]"
const ENTRY_START_REGEX = /^(?:(?:\d+|[\u0660-\u0669]+)[\.\)\-\:]\s*|\[(?:\d+|[\u0660-\u0669]+)\]\s*)/;

// Circled / numbered example markers: e.g. ①, ②, 1., (1), ١.
const EXAMPLE_MARKER_REGEX = /^(?:[①②③④⑤⑥⑦⑧⑨⑩]|\(?\d+\)?\.?|\(?[\u0660-\u0669]+\)?\.?)\s*/;

/**
 * Split raw input text into separate candidate entry blocks.
 */
function splitIntoBlocks(text: string): string[] {
  const lines = text.split(/\r?\n/);
  const blocks: string[] = [];
  let currentBlock: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentBlock.length > 0) {
        currentBlock.push('');
      }
      continue;
    }

    // Check if line looks like a new entry start (e.g. "311. ..." or "٣١١. ...")
    const isNewEntry = ENTRY_START_REGEX.test(trimmed);

    if (isNewEntry && currentBlock.length > 0) {
      // Flush previous block
      const joined = currentBlock.join('\n').trim();
      if (joined) blocks.push(joined);
      currentBlock = [trimmed];
    } else {
      currentBlock.push(trimmed);
    }
  }

  if (currentBlock.length > 0) {
    const joined = currentBlock.join('\n').trim();
    if (joined) blocks.push(joined);
  }

  return blocks;
}

/**
 * Parse an individual block into a structured ParsedVocabularyItem.
 */
function parseBlock(blockText: string, index: number): ParsedVocabularyItem {
  const lines = blockText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  let sourceNumber = '';
  let arabic = '';
  let meaning = '';
  const forms: ParsedForm[] = [];
  const examples: ParsedExample[] = [];

  let currentExampleArabic = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Detect Entry Number & Main Arabic word on first relevant line
    if (!arabic && CONTAINS_ARABIC_REGEX.test(line)) {
      let cleanLine = line;
      const numMatch = cleanLine.match(ENTRY_START_REGEX);
      if (numMatch) {
        sourceNumber = numMatch[0].replace(/[\.\)\-\:\s\[\]]/g, '');
        cleanLine = cleanLine.slice(numMatch[0].length).trim();
      }

      // Check if line contains inline forms (e.g., "غَشَّ - يَغُشُّ")
      if (cleanLine.includes('-') || cleanLine.includes('/')) {
        const parts = cleanLine.split(/[\-\/]/).map(p => p.trim());
        if (parts.length >= 2 && CONTAINS_ARABIC_REGEX.test(parts[0])) {
          forms.push({ label: "Fi'il Madhi", value: parts[0] });
          forms.push({ label: "Fi'il Mudhari'", value: parts[1] });
          if (parts[2]) {
            forms.push({ label: "Mashdar/Lainnya", value: parts[2] });
          }
        }
      }

      arabic = cleanLine;
      continue;
    }

    // 2. Detect Meaning line: e.g. "Arti: ...", "Makna: ...", "Terjemahan: ..."
    const meaningMatch = line.match(/^(?:Arti|Makna|Terjemahan|Artinya|Maksud)\s*[\:\-]\s*(.+)/i);
    if (meaningMatch) {
      meaning = meaningMatch[1].trim();
      continue;
    }

    // 3. Skip header lines like "Jumlah Mufidah:" or "Contoh Kalimat:"
    if (/^(?:Jumlah\s*Mufidah|Contoh\s*Kalimat|Contoh|Kalimat)\s*[\:\-]?$/i.test(line)) {
      continue;
    }

    // 4. Detect Examples: check if line has Arabic sentence (often marked with ①, 1., etc.)
    if (CONTAINS_ARABIC_REGEX.test(line)) {
      // Flush previous pending example if exists
      if (currentExampleArabic) {
        examples.push({
          id: crypto.randomUUID(),
          arabic: currentExampleArabic,
          translation: ''
        });
        currentExampleArabic = '';
      }

      let arabicSentence = line.replace(EXAMPLE_MARKER_REGEX, '').trim();
      currentExampleArabic = arabicSentence;
      continue;
    }

    // 5. If previous line was an Arabic sentence, this Latin line is its translation
    if (currentExampleArabic && !CONTAINS_ARABIC_REGEX.test(line)) {
      examples.push({
        id: crypto.randomUUID(),
        arabic: currentExampleArabic,
        translation: line.trim()
      });
      currentExampleArabic = '';
      continue;
    }

    // 6. Fallback: if meaning is not yet set and line is Latin without colon
    if (!meaning && !CONTAINS_ARABIC_REGEX.test(line)) {
      meaning = line.trim();
    }
  }

  // Flush any trailing example
  if (currentExampleArabic) {
    examples.push({
      id: crypto.randomUUID(),
      arabic: currentExampleArabic,
      translation: ''
    });
  }

  return {
    tempId: `temp_${index}_${Date.now()}`,
    sourceNumber,
    arabic: arabic || 'غير محدد',
    meaning: meaning || 'Belum ada terjemahan',
    forms,
    examples,
    rawBlock: blockText,
    isAmbiguous: !arabic || !meaning
  };
}

/**
 * Main parser entry point: parses raw pasted text into a list of vocabulary entries.
 */
export function parseSmartPasteText(rawText: string): ParsedVocabularyItem[] {
  if (!rawText || !rawText.trim()) return [];

  const blocks = splitIntoBlocks(rawText);
  return blocks.map((b, idx) => parseBlock(b, idx));
}
