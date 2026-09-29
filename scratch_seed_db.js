import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Paragraph from './models/Paragraph.js';
import { INITIAL_PARAGRAPHS } from './config/seedParagraphs.js';

dotenv.config();

const runSeed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kst_typing_assessment';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear and insert paragraphs with titles
    await Paragraph.deleteMany({});
    const inserted = await Paragraph.insertMany(INITIAL_PARAGRAPHS);
    console.log(`Successfully stored ${inserted.length} titled paragraphs in MongoDB database:`);
    inserted.forEach((p, idx) => {
      console.log(`${idx + 1}. [ID: ${p._id}] Title: "${p.title}"`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
