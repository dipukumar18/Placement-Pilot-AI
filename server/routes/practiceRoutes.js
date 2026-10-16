import express from "express";

import authMiddleware, { requireRole } from "../middleware/authMiddleware.js";

import {
  getPracticeQuestions,
  getPracticeQuestionById,
  createPracticeQuestion,
  getPracticeProgress,
  getAdminPracticeQuestions,
  updateAdminPracticeQuestion,
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
  requireRole("admin"),
  createPracticeQuestion
);

router.get("/admin/questions", requireRole("admin"), getAdminPracticeQuestions);
router.patch("/admin/questions/:id", requireRole("admin"), updateAdminPracticeQuestion);

router.get(
  "/progress",
  getPracticeProgress
);

export default router;
