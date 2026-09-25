import mongoose from "mongoose";

const practiceSessionQuestionSchema =
  new mongoose.Schema(
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PracticeQuestion",
        required: true,
      },

      attempt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PracticeAttempt",
        default: null,
      },

      order: {
        type: Number,
        required: true,
        min: 1,
      },

      status: {
        type: String,
        enum: [
          "not_answered",
          "answered",
          "evaluated",
        ],
        default: "not_answered",
      },

      score: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
    {
      _id: true,
    }
  );

const practiceSessionSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      targetRole: {
        type: String,
        default: "",
        trim: true,
      },

      category: {
        type: String,
        enum: [
          "technical",
          "coding",
          "aptitude",
          "behavioral",
          "hr",
          "communication",
        ],
        required: true,
      },

      difficulty: {
        type: String,
        enum: [
          "easy",
          "medium",
          "hard",
        ],
        default: "medium",
      },

      questions: {
        type: [
          practiceSessionQuestionSchema,
        ],
        default: [],
      },

      totalQuestions: {
        type: Number,
        default: 0,
        min: 0,
      },

      answeredQuestions: {
        type: Number,
        default: 0,
        min: 0,
      },

      evaluatedQuestions: {
        type: Number,
        default: 0,
        min: 0,
      },

      averageScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      status: {
        type: String,
        enum: [
          "not_started",
          "in_progress",
          "completed",
        ],
        default: "not_started",
      },

      startedAt: {
        type: Date,
        default: null,
      },

      completedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

practiceSessionSchema.index({
  user: 1,
  createdAt: -1,
});

practiceSessionSchema.index({
  user: 1,
  status: 1,
});

const PracticeSession =
  mongoose.model(
    "PracticeSession",
    practiceSessionSchema
  );

export default PracticeSession;