/**
 * Calculate Letters Per Minute (LPM) / Characters Per Minute (CPM)
 * Formula: LPM = (Total Typed Letters / Elapsed Time in Seconds) * 60
 * 
 * @param {number} charCount - Total character/letter count typed by candidate
 * @param {number} durationSeconds - Total elapsed assessment time in seconds
 * @returns {number} Letters Per Minute rounded to 1 decimal place
 */
export const calculateLPM = (charCount, durationSeconds) => {
  if (!charCount || charCount <= 0 || !durationSeconds || durationSeconds <= 0) {
    return 0;
  }
  const elapsedMinutes = durationSeconds / 60;
  const lpm = charCount / elapsedMinutes;
  return Math.max(0, Math.round(lpm));
};
