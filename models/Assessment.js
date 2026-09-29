import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true
    },
    paragraph: {
      type: String,
      required: true
    },
    paragraphTitle: {
      type: String,
      default: 'Typing Assessment'
    },
    paragraphId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Paragraph'
    },
    startTime: {
      type: Date
    },
    endTime: {
      type: Date
    },
    durationSeconds: {
      type: Number,
      default: 0
    },
    typedText: {
      type: String,
      default: ''
    },
    wordCount: {
      type: Number,
      default: 0
    },
    characterCount: {
      type: Number,
      default: 0
    },
    wpm: {
      type: Number,
      default: 0
    },
    lpm: {
      type: Number,
      default: 0
    },
    averageLpm: {
      type: Number,
      default: 0
    },
    minuteStats: {
      type: [Number],
      default: []
    },
    accuracy: {
      type: Number,
      default: 0
    },
    autoSubmitted: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED'],
      default: 'NOT_STARTED'
    },
    submittedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Assessment', assessmentSchema);
