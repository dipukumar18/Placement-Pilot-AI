import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addSkill, getSkills, removeSkill } from "../controllers/skillsController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getSkills);
router.post("/", addSkill);
router.delete("/:skill", removeSkill);

export default router;
