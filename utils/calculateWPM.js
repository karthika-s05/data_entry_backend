/**
 * Calculate Standard Words Per Minute (WPM).
 * Formula: Standard WPM = (typed characters / 5) / elapsed minutes
 * 
 * @param {number} charCount - Total character count of typed text
 * @param {number} durationSeconds - Elapsed time in seconds
 * @returns {number} WPM value rounded to 1 decimal place
 */
export const calculateWPM = (charCount, durationSeconds) => {
  if (!charCount || charCount <= 0 || !durationSeconds || durationSeconds <= 0) {
    return 0;
  }
  
  const elapsedMinutes = durationSeconds / 60;
  const standardWords = charCount / 5;
  const wpm = standardWords / elapsedMinutes;
  
  return Math.max(0, Math.round(wpm));
};
