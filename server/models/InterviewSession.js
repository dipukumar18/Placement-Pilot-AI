import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  score: { type: Number, min: 0, max: 100, default: null },
  feedback: { type: String, default: "" },
  submittedAt: { type: Date, default: Date.now },
}, { _id: true });

const interviewSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  mode: { type: String, enum: ["mock", "peer"], required: true },
  status: { type: String, enum: ["waiting", "in_progress", "completed"], default: "waiting" },
  targetRole: { type: String, default: "" },
  interviewType: { type: String, enum: ["technical", "hr", "mixed"], default: "mixed" },
  questions: { type: [String], default: [] },
  answers: { type: [answerSchema], default: [] },
  currentQuestion: { type: Number, default: 0 },
  roomCode: { type: String, unique: true, sparse: true },
  peer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  offer: { type: Object, default: null },
  answer: { type: Object, default: null },
  candidates: { type: [Object], default: [] },
  createdAt: { type: Date, default: Date.now },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
});

export default mongoose.model("InterviewSession", interviewSessionSchema);
