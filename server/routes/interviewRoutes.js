import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createMockInterview, submitMockAnswer, getMockInterview, createPeerRoom, joinPeerRoom, signalPeer, getPeerSignal, leavePeerRoom } from "../controllers/interviewController.js";

const router = express.Router();
router.use(authMiddleware);
router.post("/mock", createMockInterview);
router.post("/mock/:sessionId/answers", submitMockAnswer);
router.get("/mock/:sessionId", getMockInterview);
router.post("/peer/rooms", createPeerRoom);
router.post("/peer/rooms/join", joinPeerRoom);
router.post("/peer/rooms/:sessionId/signal", signalPeer);
router.get("/peer/rooms/:sessionId/signal", getPeerSignal);
router.post("/peer/rooms/:sessionId/leave", leavePeerRoom);
export default router;
