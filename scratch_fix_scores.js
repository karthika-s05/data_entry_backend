import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Assessment from './models/Assessment.js';

dotenv.config();

const fixScores = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kst_typing_assessment';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for score cleanup...');

    const assessments = await Assessment.find({});
    console.log(`Analyzing ${assessments.length} assessment records...`);

    let updatedCount = 0;
    for (const ass of assessments) {
      if (ass.status === 'SUBMITTED') {
        const charCount = ass.characterCount || (ass.typedText ? ass.typedText.length : 0);
        const wordCount = ass.wordCount || (ass.typedText ? ass.typedText.split(/\s+/).filter(Boolean).length : 0);
        const rawDur = ass.durationSeconds || 300;
        const effectiveDur = rawDur < 30 ? 300 : Math.min(rawDur, 300);

        const newLpm = Math.round(charCount / (effectiveDur / 60));
        const newWpm = Math.round(wordCount / (effectiveDur / 60));

        ass.lpm = newLpm;
        ass.averageLpm = newLpm;
        ass.wpm = newWpm;
        await ass.save();
        updatedCount++;
        console.log(`Updated Assessment [${ass._id}]: ${charCount} chars in ${rawDur}s -> ${newLpm} LPM, ${newWpm} WPM`);
      }
    }

    console.log(`Cleaned up ${updatedCount} assessment records in MongoDB.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Cleanup error:', err);
    process.exit(1);
  }
};

fixScores();
