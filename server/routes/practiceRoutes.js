import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getPracticeQuestions,
  getPracticeQuestionById,
  createPracticeQuestion,
  getPracticeProgress,
} from "../controllers/practiceController.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/questions",
  getPracticeQuestions
);

router.get(
  "/questions/:id",
  getPracticeQuestionById
);

router.post(
  "/questions",
  createPracticeQuestion
);

router.get(
  "/progress",
  getPracticeProgress
);

export default router;