import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getPlacementReadiness } from "../controllers/readinessController.js";

const router = express.Router();
router.get("/", authMiddleware, getPlacementReadiness);
export default router;
