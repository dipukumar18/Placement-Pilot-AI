import mongoose from "mongoose";

const practiceQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    questionType: {
      type: String,
      enum: [
        "mcq",
        "technical",
        "behavioral",
        "coding",
        "scenario",
      ],
      required: true,
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
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    targetRoles: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    options: {
      type: [String],
      default: [],
    },

    correctAnswer: {
      type: String,
      default: "",
      trim: true,
    },

    expectedAnswer: {
      type: String,
      default: "",
      trim: true,
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    hints: {
      type: [String],
      default: [],
    },

    evaluationCriteria: {
      type: [String],
      default: [],
    },

    source: {
      type: String,
      enum: ["system", "ai_generated", "admin"],
      default: "system",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

practiceQuestionSchema.index({
  category: 1,
  difficulty: 1,
});

practiceQuestionSchema.index({
  targetRoles: 1,
});

practiceQuestionSchema.index({
  skills: 1,
});

const PracticeQuestion = mongoose.model(
  "PracticeQuestion",
  practiceQuestionSchema
);

export default PracticeQuestion;