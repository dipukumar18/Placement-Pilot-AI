import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  submitPracticeAttempt,
  evaluatePracticeAttempt,
  getPracticeAttempts,
} from "../controllers/practiceAttemptController.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/questions/:questionId/attempt",
  submitPracticeAttempt
);

router.post(
  "/attempts/:attemptId/evaluate",
  evaluatePracticeAttempt
);

router.get(
  "/attempts",
  getPracticeAttempts
);

export default router;