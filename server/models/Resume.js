import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileType: {
      type: String,
      required: true,
      enum: ["application/pdf"],
    },

    fileSize: {
      type: Number,
      required: true,
      min: 1,
    },

    filePath: {
      type: String,
      required: true,
      trim: true,
    },

    extractedText: {
      type: String,
      default: "",
    },

    analysisStatus: {
      type: String,
      enum: ["not_started", "processing", "completed", "failed"],
      default: "not_started",
    },

    analysis: {
      summary: {
        type: String,
        default: "",
      },

      skills: {
        type: [String],
        default: [],
      },

      education: {
        type: [String],
        default: [],
      },

      experience: {
        type: [String],
        default: [],
      },

      projects: {
        type: [String],
        default: [],
      },

      missingSkills: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;