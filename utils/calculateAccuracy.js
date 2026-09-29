/**
 * Calculate Levenshtein distance between two strings.
 */
const levenshteinDistance = (str1, str2) => {
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // Deletion
          dp[i][j - 1],     // Insertion
          dp[i - 1][j - 1]  // Substitution
        );
      }
    }
  }

  return dp[m][n];
};

/**
 * Calculate typing accuracy percentage comparing typed text with reference paragraph.
 * 
 * @param {string} typedText - Text typed by the candidate
 * @param {string} targetParagraph - Original reference paragraph
 * @returns {object} Accuracy object with percentage, correct, incorrect counts
 */
export const calculateAccuracy = (typedText = '', targetParagraph = '') => {
  if (!typedText || typedText.length === 0) {
    return {
      accuracy: 0,
      correctChars: 0,
      incorrectChars: 0
    };
  }

  const targetLength = targetParagraph.length;
  if (targetLength === 0) {
    return { accuracy: 100, correctChars: typedText.length, incorrectChars: 0 };
  }

  // Calculate Levenshtein distance
  const distance = levenshteinDistance(typedText, targetParagraph);
  
  // Maximum error potential can exceed targetLength if candidate typed much more
  const maxLen = Math.max(targetLength, typedText.length);
  const correctEstimate = Math.max(0, maxLen - distance);
  
  const accuracyPercentage = Math.max(0, Math.min(100, Math.round((correctEstimate / maxLen) * 1000) / 10));

  return {
    accuracy: accuracyPercentage,
    correctChars: correctEstimate,
    incorrectChars: distance
  };
};
