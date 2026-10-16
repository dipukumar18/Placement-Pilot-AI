import crypto from "crypto";
import InterviewSession from "../models/InterviewSession.js";
import { evaluateInterviewAnswer } from "../services/interviewEvaluationService.js";
import { awardActivity } from "../services/gamificationService.js";

const mockQuestions = {
  technical: [
    "Explain how Express.js middleware works and give one practical example.",
    "What is the difference between SQL JOIN types?",
    "Explain time complexity and give an example of O(n).",
    "How would you secure a JWT-protected API?",
    "Explain one React performance optimization you have used.",
  ],
  hr: [
    "Tell me about yourself and your strongest project.",
    "Describe a difficult problem you solved.",
    "How do you handle feedback?",
    "Why do you want this role?",
    "Where do you want to improve professionally?",
  ],
  mixed: [],
};
mockQuestions.mixed = [...mockQuestions.technical.slice(0, 3), ...mockQuestions.hr.slice(0, 2)];


export const createMockInterview = async (req, res, next) => {
  try {
    const { targetRole = "", interviewType = "mixed" } = req.body;
    const session = await InterviewSession.create({ user: req.user.userId, mode: "mock", status: "in_progress", targetRole, interviewType, questions: mockQuestions[interviewType] || mockQuestions.mixed, startedAt: new Date() });
    return res.status(201).json({ success: true, message: "Mock interview started", data: session });
  } catch (error) { return next(error); }
};

export const submitMockAnswer = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.sessionId, user: req.user.userId, mode: "mock" });
    if (!session) return res.status(404).json({ success: false, message: "Interview session not found" });
    const answer = String(req.body.answer || "").trim();
    if (!answer) return res.status(400).json({ success: false, message: "Answer is required" });
    const question = session.questions[session.currentQuestion];
    if (!question) return res.status(409).json({ success: false, message: "Interview is already complete" });
    const evaluation = await evaluateInterviewAnswer({ question, answer });
    session.answers.push({ question, answer, ...evaluation });
    session.currentQuestion += 1;
    if (session.currentQuestion >= session.questions.length) {
      session.status = "completed";
      session.completedAt = new Date();
      await awardActivity({ userId: req.user.userId, activityKey: `mock_session:${session._id}`, type: "mock_completed", occurredAt: session.completedAt });
    }
    await session.save();
    return res.status(201).json({ success: true, message: evaluation.isAi ? "Answer evaluated by configured AI provider" : "Answer evaluated with clearly labelled local rubric", data: { ...evaluation, question, currentQuestion: session.currentQuestion, totalQuestions: session.questions.length, status: session.status, answers: session.answers, finalReport: session.status === "completed" ? buildFinalReport(session) : null } });
  } catch (error) { return next(error); }
};

const buildFinalReport = (session) => ({
  totalAnswers: session.answers.length,
  averageScore: session.answers.length ? Math.round(session.answers.reduce((sum, item) => sum + (item.score || 0), 0) / session.answers.length) : 0,
  completedAt: session.completedAt,
});

export const getMockInterview = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.sessionId, user: req.user.userId, mode: "mock" }).lean();
    if (!session) return res.status(404).json({ success: false, message: "Interview session not found" });
    return res.json({ success: true, message: "Mock interview retrieved", data: { ...session, finalReport: session.status === "completed" ? buildFinalReport(session) : null } });
  } catch (error) { return next(error); }
};

export const createPeerRoom = async (req, res, next) => {
  try {
    const roomCode = crypto.randomBytes(4).toString("hex").toUpperCase();
    const session = await InterviewSession.create({ user: req.user.userId, mode: "peer", status: "waiting", roomCode });
    return res.status(201).json({ success: true, message: "Peer interview room created", data: { sessionId: session._id, roomCode } });
  } catch (error) { return next(error); }
};

export const joinPeerRoom = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ roomCode: String(req.body.roomCode || "").toUpperCase(), mode: "peer" });
    if (!session) return res.status(404).json({ success: false, message: "Peer room not found" });
    if (String(session.user) === String(req.user.userId)) return res.status(400).json({ success: false, message: "Room owner cannot join as peer" });
    if (session.peer && String(session.peer) !== String(req.user.userId)) return res.status(409).json({ success: false, message: "Room is full" });
    session.peer = req.user.userId; session.status = "in_progress"; await session.save();
    return res.json({ success: true, message: "Joined peer interview room", data: { sessionId: session._id, roomCode: session.roomCode } });
  } catch (error) { return next(error); }
};

export const signalPeer = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.sessionId, $or: [{ user: req.user.userId }, { peer: req.user.userId }], mode: "peer" });
    if (!session) return res.status(404).json({ success: false, message: "Peer room not found" });
    const { offer, answer, candidate } = req.body;
    if (offer) session.offer = offer;
    if (answer) session.answer = answer;
    if (candidate) session.candidates.push(candidate);
    await session.save();
    return res.json({ success: true, message: "Signal saved", data: { offer: session.offer, answer: session.answer, candidates: session.candidates } });
  } catch (error) { return next(error); }
};

export const getPeerSignal = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.sessionId, $or: [{ user: req.user.userId }, { peer: req.user.userId }], mode: "peer" }).select("offer answer candidates status peer").lean();
    if (!session) return res.status(404).json({ success: false, message: "Peer room not found" });
    return res.json({ success: true, message: "Peer signal retrieved", data: session });
  } catch (error) { return next(error); }
};

export const leavePeerRoom = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.sessionId, $or: [{ user: req.user.userId }, { peer: req.user.userId }], mode: "peer" });
    if (!session) return res.status(404).json({ success: false, message: "Peer room not found" });
    if (String(session.user) === String(req.user.userId)) session.status = "completed";
    else session.peer = null;
    await session.save();
    return res.json({ success: true, message: "You left the peer room" });
  } catch (error) { return next(error); }
};
