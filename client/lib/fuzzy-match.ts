/**
 * Fuzzy string matching utilities for conflict of interest checks
 */

/**
 * Calculate Levenshtein distance between two strings
 * Lower distance = more similar strings
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,      // deletion
        matrix[j - 1][i] + 1,      // insertion
        matrix[j - 1][i - 1] + indicator  // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity score between 0 and 1 (1 = exact match)
 */
export function calculateSimilarity(str1: string, str2: string, caseInsensitive = true): number {
  const s1 = caseInsensitive ? str1.toLowerCase() : str1;
  const s2 = caseInsensitive ? str2.toLowerCase() : str2;
  
  if (s1 === s2) return 1; // Exact match
  
  const distance = levenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  
  return 1 - (distance / maxLength);
}

/**
 * Check if strings are similar enough to be considered a match
 * threshold: 0-1, higher = stricter matching (default 0.7 = 70% similar)
 */
export function isSimilar(str1: string, str2: string, threshold = 0.7): boolean {
  return calculateSimilarity(str1, str2) >= threshold;
}

/**
 * Find similar strings from a list
 */
export function findSimilarMatches(
  query: string,
  list: string[],
  threshold = 0.7
): { match: string; similarity: number }[] {
  return list
    .map(item => ({
      match: item,
      similarity: calculateSimilarity(query, item)
    }))
    .filter(result => result.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);
}

/**
 * Extract initials or common abbreviations from a name
 * e.g., "John Doe" -> ["JD", "J.D.", "J D"]
 */
export function getNameVariants(name: string): string[] {
  const variants: Set<string> = new Set();
  
  // Add original
  variants.add(name);
  
  // Add lowercase
  variants.add(name.toLowerCase());
  
  // Extract initials
  const words = name.trim().split(/\s+/);
  if (words.length > 1) {
    const initials = words.map(w => w[0]).join('');
    variants.add(initials);
    variants.add(initials.toLowerCase());
    variants.add(initials.split('').join('.') + '.');  // J.D.
    variants.add(initials.split('').join(' '));  // J D
  }
  
  return Array.from(variants);
}

/**
 * Compare two names considering variants
 */
export function compareNames(name1: string, name2: string, threshold = 0.7): boolean {
  // Exact match
  if (name1.toLowerCase() === name2.toLowerCase()) return true;
  
  // Direct similarity check
  if (isSimilar(name1, name2, threshold)) return true;
  
  // Check variants
  const variants1 = getNameVariants(name1);
  const variants2 = getNameVariants(name2);
  
  for (const v1 of variants1) {
    for (const v2 of variants2) {
      if (isSimilar(v1, v2, threshold)) return true;
    }
  }
  
  return false;
}
