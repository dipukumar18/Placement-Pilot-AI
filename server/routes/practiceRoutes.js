import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getPracticeQuestions,
  getPracticeQuestionById,
  createPracticeQuestion,
} from "../controllers/practiceController.js";

const router = express.Router();

// All practice routes require authentication
router.use(authMiddleware);

// Get practice questions
router.get("/questions", getPracticeQuestions);

// Get one practice question
router.get("/questions/:id", getPracticeQuestionById);

// Create a practice question
router.post("/questions", createPracticeQuestion);

export default router;