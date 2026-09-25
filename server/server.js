import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import skillsRoutes from "./routes/skillsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import practiceRoutes from "./routes/practiceRoutes.js";
import practiceAttemptRoutes from "./routes/practiceAttemptRoutes.js";
import practiceSessionRoutes from "./routes/practiceSessionRoutes.js";

import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/practice", practiceAttemptRoutes);
app.use("/api/practice-sessions", practiceSessionRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Placement Pilot AI API is running 🚀",
  });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});