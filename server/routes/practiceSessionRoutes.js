import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createSession,
  startSession,
  submitSessionAnswer,
  evaluateSessionAnswer,
} from "../controllers/practiceSessionController.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  createSession
);

router.post(
  "/:sessionId/start",
  startSession
);

router.post(
  "/:sessionId/questions/:questionId/submit",
  submitSessionAnswer
);

router.post(
  "/:sessionId/questions/:questionId/evaluate",
  evaluateSessionAnswer
);

export default router;
