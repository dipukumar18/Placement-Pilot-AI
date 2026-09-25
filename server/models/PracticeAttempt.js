import mongoose from "mongoose";

const practiceAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    question: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "PracticeQuestion",
  required: true,
},

    answer: {
      type: String,
      default: "",
      trim: true,
    },

    selectedOption: {
      type: String,
      default: "",
      trim: true,
    },

    isCorrect: {
      type: Boolean,
      default: null,
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    timeTaken: {
      type: Number,
      default: 0,
      min: 0,
    },

    evaluationStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    feedback: {
      type: String,
      default: "",
      trim: true,
    },

    strengths: {
      type: [String],
      default: [],
    },

    improvementAreas: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

practiceAttemptSchema.index({
  user: 1,
  createdAt: -1,
});

practiceAttemptSchema.index({
  question: 1,
});

const PracticeAttempt = mongoose.model(
  "PracticeAttempt",
  practiceAttemptSchema
);

export default PracticeAttempt;