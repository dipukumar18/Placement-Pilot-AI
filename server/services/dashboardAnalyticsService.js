import PracticeAttempt from "../models/PracticeAttempt.js";
import InterviewSession from "../models/InterviewSession.js";

const average = (scores) => scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null;

export const getDashboardAnalytics = async (userId) => {
  const [attempts, mockSessions] = await Promise.all([
    PracticeAttempt.find({ user: userId }).select("score evaluationStatus question createdAt").populate("question", "category skills").lean(),
    InterviewSession.find({ user: userId, mode: "mock" }).select("status answers completedAt").lean(),
  ]);
  const evaluatedAttempts = attempts.filter((item) => item.evaluationStatus === "completed" && Number.isFinite(Number(item.score)));
  const evaluatedScores = evaluatedAttempts.map((item) => Number(item.score));
  const completedMocks = mockSessions.filter((item) => item.status === "completed");
  const mockScores = completedMocks.flatMap((session) => session.answers || []).map((item) => Number(item.score)).filter((score) => Number.isFinite(score));
  const categoryMap = new Map();
  evaluatedAttempts.forEach((attempt) => {
    const category = attempt.question?.category || "unknown";
    const entry = categoryMap.get(category) || { category, evaluated: 0, scores: [] };
    entry.evaluated += 1;
    entry.scores.push(Number(attempt.score));
    categoryMap.set(category, entry);
  });
  const skillMap = new Map();
  evaluatedAttempts.forEach((attempt) => (attempt.question?.skills || []).forEach((skill) => {
    const entry = skillMap.get(skill) || { skill, evaluated: 0, scores: [] };
    entry.evaluated += 1;
    entry.scores.push(Number(attempt.score));
    skillMap.set(skill, entry);
  }));
  return {
    attempts: { total: attempts.length, evaluated: evaluatedAttempts.length, pending: attempts.length - evaluatedAttempts.length, averageScore: average(evaluatedScores) },
    mockInterviews: { total: mockSessions.length, completed: completedMocks.length, pending: mockSessions.length - completedMocks.length, evaluatedAnswers: mockScores.length, averageScore: average(mockScores) },
    categoryPerformance: [...categoryMap.values()].map((item) => ({ category: item.category, evaluated: item.evaluated, averageScore: average(item.scores) })),
    skillPerformance: [...skillMap.values()].map((item) => ({ skill: item.skill, evaluated: item.evaluated, averageScore: average(item.scores) })).sort((a, b) => a.averageScore - b.averageScore),
  };
};

export default getDashboardAnalytics;
