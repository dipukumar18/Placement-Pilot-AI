import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import uploadResume from "../middleware/uploadMiddleware.js";

import {
  uploadResume as uploadResumeController,
  getResume,
} from "../controllers/resumeController.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/upload",
  uploadResume.single("resume"),
  uploadResumeController
);

router.get("/", getResume);

export default router;