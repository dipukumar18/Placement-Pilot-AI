import PracticeAttempt from "../models/PracticeAttempt.js";
import InterviewSession from "../models/InterviewSession.js";

const average = (values) => values.length
  ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
  : null;

export const calculatePlacementReadiness = async (userId) => {
  const [attempts, mockSessions] = await Promise.all([
    PracticeAttempt.find({ user: userId, evaluationStatus: "completed" })
      .select("score")
      .lean(),
    InterviewSession.find({ user: userId, mode: "mock", status: "completed" })
      .select("answers")
      .lean(),
  ]);
  const practiceScores = attempts.map((item) => Number(item.score))
    .filter((score) => Number.isFinite(score) && score >= 0 && score <= 100);
  const mockScores = mockSessions.flatMap((session) => Array.isArray(session.answers) ? session.answers : [])
    .map((item) => Number(item.score))
    .filter((score) => Number.isFinite(score) && score >= 0 && score <= 100);
  const components = [];
  const practiceAverage = average(practiceScores);
  const mockAverage = average(mockScores);
  if (practiceAverage !== null) components.push({ name: "practice", score: practiceAverage, weight: 70, sampleCount: practiceScores.length });
  if (mockAverage !== null) components.push({ name: "mock_interview", score: mockAverage, weight: 30, sampleCount: mockScores.length });
  const totalWeight = components.reduce((sum, item) => sum + item.weight, 0);
  const score = totalWeight ? Math.round(components.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight) : null;
  return {
    score,
    evaluated: components.length > 0,
    components,
    evaluatedPracticeAttempts: practiceScores.length,
    evaluatedMockAnswers: mockScores.length,
    message: components.length ? "Based only on completed evaluations." : "No completed evaluations are available yet.",
  };
};

export default calculatePlacementReadiness;
