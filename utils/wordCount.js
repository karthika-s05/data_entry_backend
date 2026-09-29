/**
 * Calculate accurate word count from a text string.
 * Handles multiple spaces, tabs, newlines, and leading/trailing whitespace.
 */
export const calculateWordCount = (text) => {
  if (!text || typeof text !== 'string') return 0;
  const trimmed = text.trim();
  if (trimmed === '') return 0;
  return trimmed.split(/\s+/).length;
};
