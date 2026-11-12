/**
 * Arabic utilities for search indexing and text manipulation.
 * Preserves original diacritics while providing a stripped representation
 * purely for searching/filtering so users can search with or without harakat.
 */

// Arabic Diacritics Range (Fathah, Dammah, Kasrah, Tanwin, Sukun, Shaddah, etc.)
const ARABIC_DIACRITICS_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;

/**
 * Remove diacritics ONLY for generating search index tokens.
 * NEVER use this function to alter original stored text!
 */
export function stripArabicDiacritics(text: string): string {
  if (!text) return '';
  return text
    .replace(ARABIC_DIACRITICS_REGEX, '')
    // Normalize variants of Alif (أ, إ, آ, ٱ -> ا) for flexible search
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Ta Marbuta (ة -> ه)
    .replace(/ة/g, 'ه')
    // Normalize Alif Maqsura (ى -> ي)
    .replace(/ى/g, 'ي');
}

/**
 * Build a combined search index string from all searchable vocabulary fields.
 */
export function buildSearchIndex(
  arabic: string,
  meaning: string,
  forms?: Array<{ label: string; value: string }>,
  examples?: Array<{ arabic: string; translation: string }>
): string {
  const parts: string[] = [];

  // 1. Raw Arabic word
  parts.push(arabic);
  // 2. Diacritics-stripped Arabic word for flexible searching
  parts.push(stripArabicDiacritics(arabic));

  // 3. Meaning in Indonesian (lowercase)
  parts.push(meaning.toLowerCase());

  // 4. Forms
  if (forms && forms.length > 0) {
    for (const f of forms) {
      parts.push(f.value);
      parts.push(stripArabicDiacritics(f.value));
    }
  }

  // 5. Examples (Arabic sentence & Indonesian translation)
  if (examples && examples.length > 0) {
    for (const ex of examples) {
      parts.push(ex.arabic);
      parts.push(stripArabicDiacritics(ex.arabic));
      parts.push(ex.translation.toLowerCase());
    }
  }

  return parts.join(' ');
}
