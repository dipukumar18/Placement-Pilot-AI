import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    education: {
      college: {
        type: String,
        default: "",
      },

      degree: {
        type: String,
        default: "",
      },

      branch: {
        type: String,
        default: "",
      },

      graduationYear: {
        type: Number,
        default: null,
      },
    },

    targetRole: {
      type: String,
      default: "",
      trim: true,
    },

    readinessScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;