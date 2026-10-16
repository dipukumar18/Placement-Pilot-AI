import mongoose from "mongoose";

const gamificationEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  activityKey: { type: String, required: true, trim: true },
  type: { type: String, enum: ["practice_evaluated", "mock_completed"], required: true },
  points: { type: Number, required: true, min: 0 },
  occurredAt: { type: Date, required: true, default: Date.now },
}, { timestamps: true });

gamificationEventSchema.index({ user: 1, activityKey: 1 }, { unique: true });
gamificationEventSchema.index({ user: 1, occurredAt: -1 });

export default mongoose.model("GamificationEvent", gamificationEventSchema);
