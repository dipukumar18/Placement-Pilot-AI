import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getRoadmap,
  updateRoadmapItem,
} from "../controllers/roadmapController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getRoadmap);

router.patch("/items/:itemId", updateRoadmapItem);

export default router;