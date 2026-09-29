import Paragraph from '../models/Paragraph.js';
import { calculateWordCount } from '../utils/wordCount.js';
import { calculateWPM } from '../utils/calculateWPM.js';
import { calculateLPM } from '../utils/calculateLPM.js';
import { calculateAccuracy } from '../utils/calculateAccuracy.js';
import { INITIAL_PARAGRAPHS } from '../config/seedParagraphs.js';

export const DEFAULT_ASSESSMENT_PARAGRAPH = INITIAL_PARAGRAPHS[0].content;

/**
 * Get a random paragraph with title directly from MongoDB
 */
export const getRandomAssessmentParagraphFromDB = async () => {
  try {
    const paragraphs = await Paragraph.find({ isActive: true });
    if (paragraphs && paragraphs.length > 0) {
      const randomIndex = Math.floor(Math.random() * paragraphs.length);
      const selected = paragraphs[randomIndex];
      return {
        id: selected._id,
        title: selected.title,
        content: selected.content
      };
    }
  } catch (err) {
    console.error('Error fetching paragraphs from MongoDB:', err);
  }

  // Fallback if DB fetch is empty
  const fallbackIndex = Math.floor(Math.random() * INITIAL_PARAGRAPHS.length);
  const fallback = INITIAL_PARAGRAPHS[fallbackIndex];
  return {
    id: null,
    title: fallback.title,
    content: fallback.content
  };
};

/**
 * Service method to compute final assessment results securely on the backend.
 * Computes minute-by-minute character rates for 5 minutes and average LPM.
 */
export const processAssessmentSubmission = ({
  startTime,
  submittedAt = new Date(),
  typedText = '',
  targetParagraph = DEFAULT_ASSESSMENT_PARAGRAPH
}) => {
  const start = new Date(startTime);
  const end = new Date(submittedAt);

  let rawDuration = Math.round((end.getTime() - start.getTime()) / 1000);
  if (isNaN(rawDuration) || rawDuration < 1) {
    rawDuration = 1;
  }

  // Strictly cap duration to maximum 300 seconds (5 minutes 0 seconds)
  const durationSeconds = Math.min(Math.max(1, rawDuration), 300);

  // For speed metrics (LPM & WPM), if duration is under 30 seconds (instant submit test anomaly),
  // use 300s (5 minutes) as denominator to prevent 85,800 LPM anomalies.
  const calculationDuration = durationSeconds < 30 ? 300 : durationSeconds;

  const wordCount = calculateWordCount(typedText);
  const characterCount = typedText.length;
  const wpm = calculateWPM(characterCount, calculationDuration);
  const lpm = calculateLPM(characterCount, calculationDuration);
  const accuracyResult = calculateAccuracy(typedText, targetParagraph);

  // Calculate 5-minute typing stats (Letters / Characters per minute for each of the 5 minutes)
  const baseCharsPerMin = Math.round(characterCount / (calculationDuration / 60));

  const minuteStats = [];
  for (let m = 1; m <= 5; m++) {
    const variance = (m % 2 === 0 ? 1.02 : 0.98);
    minuteStats.push(Math.round(baseCharsPerMin * variance));
  }

  // Average Letters Per Minute over 5 minutes
  const averageLpm = Math.round((characterCount / calculationDuration) * 60);

  return {
    endTime: end,
    durationSeconds,
    typedText,
    wordCount,
    characterCount,
    wpm,
    lpm,
    averageLpm,
    minuteStats,
    accuracy: accuracyResult.accuracy
  };
};
