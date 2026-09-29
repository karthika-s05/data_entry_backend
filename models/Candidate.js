import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      trim: true,
      lowercase: true
    },
    contactNo: {
      type: String,
      required: [true, 'Please provide contact number'],
      trim: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    assessmentStatus: {
      type: String,
      enum: ['NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED'],
      default: 'NOT_STARTED'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Candidate', candidateSchema);
