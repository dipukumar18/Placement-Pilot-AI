
import PracticeSession from "../models/PracticeSession.js";
import PracticeQuestion from "../models/PracticeQuestion.js";
import PracticeAttempt from "../models/PracticeAttempt.js";
import { awardActivity } from "./gamificationService.js";

const submitSessionAnswer = async ({
  userId,
  sessionId,
  questionId,
  answer = "",
  selectedOption = "",
  timeTaken = 0,
  language = "",
  skipped = false,
}) => {
  if (!userId) {
    const error = new Error(
      "User ID is required"
    );

    error.statusCode = 400;
    error.isOperational = true;

    throw error;
  }

  if (!sessionId || !questionId) {
    const error = new Error(
      "Session ID and question ID are required"
    );

    error.statusCode = 400;
    error.isOperational = true;

    throw error;
  }

  if (!skipped && !answer?.trim() && !selectedOption?.trim()) {
    const error = new Error(
      "Please provide an answer"
    );

    error.statusCode = 400;
    error.isOperational = true;

    throw error;
  }

  const practiceSession =
    await PracticeSession.findOne({
      _id: sessionId,
      user: userId,
    });

  if (!practiceSession) {
    const error = new Error(
      "Practice session not found"
    );

    error.statusCode = 404;
    error.isOperational = true;

    throw error;
  }

  if (practiceSession.status !== "in_progress") {
    const error = new Error(
      "Practice session is not currently in progress"
    );

    error.statusCode = 400;
    error.isOperational = true;

    throw error;
  }

  practiceSession.totalTimeSeconds = Math.max(
    practiceSession.totalTimeSeconds || 0,
    Number(timeTaken) || 0
  );

  const sessionQuestion =
    practiceSession.questions.find(
      (item) =>
        item.question.toString() ===
        questionId.toString()
    );

  if (!sessionQuestion) {
    const error = new Error(
      "This question does not belong to the practice session"
    );

    error.statusCode = 400;
    error.isOperational = true;

    throw error;
  }

  if (
    sessionQuestion.status !==
    "not_answered"
  ) {
    const error = new Error(
      "This question has already been answered in this session"
    );

    error.statusCode = 409;
    error.isOperational = true;

    throw error;
  }

  const question =
    await PracticeQuestion.findOne({
      _id: questionId,
      isActive: true,
    });

  if (!question) {
    const error = new Error(
      "Practice question not found"
    );

    error.statusCode = 404;
    error.isOperational = true;

    throw error;
  }

  if (skipped) {
    sessionQuestion.status = "skipped";
    sessionQuestion.score = 0;
    practiceSession.answeredQuestions = practiceSession.questions.filter(
      (item) => item.status !== "not_answered"
    ).length;
    practiceSession.skippedQuestions = practiceSession.questions.filter(
      (item) => item.status === "skipped"
    ).length;
    if (practiceSession.answeredQuestions === practiceSession.totalQuestions) {
      practiceSession.status = "completed";
      practiceSession.completedAt = new Date();
    }
    await practiceSession.save();
    return {
      sessionId: practiceSession._id,
      questionId: question._id,
      questionType: question.questionType,
      questionStatus: "skipped",
      skipped: true,
      answeredQuestions: practiceSession.answeredQuestions,
      evaluatedQuestions: practiceSession.evaluatedQuestions,
      skippedQuestions: practiceSession.skippedQuestions,
      totalQuestions: practiceSession.totalQuestions,
      averageScore: practiceSession.averageScore,
      totalTimeSeconds: practiceSession.totalTimeSeconds,
      submittedAt: new Date(),
    };
  }

  let isCorrect = null;
  let score = 0;
  let evaluationStatus = "pending";

  /*
   * MCQ questions can be evaluated immediately.
   * Technical and other descriptive questions
   * remain pending for the evaluation service.
   */
  if (question.questionType === "mcq") {
    const submittedAnswer =
      selectedOption || answer;

    isCorrect =
      submittedAnswer
        .trim()
        .toLowerCase() ===
      question.correctAnswer
        .trim()
        .toLowerCase();

    score = isCorrect ? 100 : 0;
    evaluationStatus = "completed";
  }

  const practiceAttempt =
    await PracticeAttempt.create({
      user: userId,
      question: question._id,
      answer:
        answer || selectedOption || "",
      selectedOption:
        selectedOption || "",
      language,
      isCorrect,
      score,
      timeTaken:
        Number(timeTaken) || 0,
      evaluationStatus,
    });

  if (practiceAttempt.evaluationStatus === "completed") {
    await awardActivity({ userId, activityKey: `practice_attempt:${practiceAttempt._id}`, type: "practice_evaluated", occurredAt: practiceAttempt.createdAt });
  }

  await PracticeQuestion.findByIdAndUpdate(
    question._id,
    {
      $inc: {
        usageCount: 1,
      },
    }
  );

  sessionQuestion.attempt =
    practiceAttempt._id;

  sessionQuestion.status =
    evaluationStatus === "completed"
      ? "evaluated"
      : "answered";

  sessionQuestion.score = score;

  practiceSession.answeredQuestions =
    practiceSession.questions.filter(
      (item) =>
        item.status !== "not_answered"
    ).length;

  practiceSession.evaluatedQuestions =
    practiceSession.questions.filter(
      (item) =>
        item.status === "evaluated"
    ).length;
  practiceSession.skippedQuestions = practiceSession.questions.filter(
    (item) => item.status === "skipped"
  ).length;

  const evaluatedScores =
    practiceSession.questions
      .filter(
        (item) =>
          item.status === "evaluated"
      )
      .map(
        (item) =>
          Number(item.score) || 0
      );

  if (evaluatedScores.length > 0) {
    const totalScore =
      evaluatedScores.reduce(
        (sum, item) => sum + item,
        0
      );

    practiceSession.averageScore =
      Math.round(
        totalScore /
          evaluatedScores.length
      );
  } else {
    practiceSession.averageScore = 0;
  }

  if (practiceSession.answeredQuestions === practiceSession.totalQuestions) {
    practiceSession.status = "completed";
    practiceSession.completedAt = new Date();
  }

  await practiceSession.save();

  return {
    sessionId: practiceSession._id,
    questionId: question._id,
    attemptId: practiceAttempt._id,
    questionType:
      question.questionType,
    resultLabel: question.questionType === "mcq" ? (isCorrect ? "correct" : "incorrect") : "pending",
    correctAnswer: question.questionType === "mcq" ? question.correctAnswer : "",
    order: sessionQuestion.order,
    isCorrect,
    score,
    evaluationStatus,
    questionStatus:
      sessionQuestion.status,
    answeredQuestions:
      practiceSession.answeredQuestions,
    evaluatedQuestions:
      practiceSession.evaluatedQuestions,
    skippedQuestions: practiceSession.skippedQuestions,
    totalQuestions:
      practiceSession.totalQuestions,
    averageScore:
      practiceSession.averageScore,
    totalTimeSeconds: practiceSession.totalTimeSeconds,
    explanation:
      question.questionType === "mcq" ? question.explanation : "",
    submittedAt:
      practiceAttempt.createdAt,
  };
};

export default submitSessionAnswer;

export const evaluateSessionAnswer = async ({ userId, sessionId, questionId, evaluator }) => {
  const session = await PracticeSession.findOne({ _id: sessionId, user: userId });
  if (!session) {
    const error = new Error("Practice session not found");
    error.statusCode = 404;
    error.isOperational = true;
    throw error;
  }

  const sessionQuestion = session.questions.find(
    (item) => item.question.toString() === questionId.toString()
  );
  if (!sessionQuestion?.attempt) {
    const error = new Error("This session answer has not been submitted");
    error.statusCode = 400;
    error.isOperational = true;
    throw error;
  }

  const [attempt, question] = await Promise.all([
    PracticeAttempt.findOne({ _id: sessionQuestion.attempt, user: userId }),
    PracticeQuestion.findOne({ _id: questionId, isActive: true }),
  ]);
  if (!attempt || !question) {
    const error = new Error("Practice answer could not be evaluated");
    error.statusCode = 404;
    error.isOperational = true;
    throw error;
  }

  const evaluation = await evaluator({ questionId: question._id, answer: attempt.answer });
  if (!evaluation.supported) {
    return {
      pending: true,
      sessionId: session._id,
      questionId: question._id,
      attemptId: attempt._id,
      questionType: question.questionType,
      evaluationStatus: attempt.evaluationStatus,
      questionStatus: sessionQuestion.status,
      feedback: evaluation.feedback,
      evaluatedQuestions: session.evaluatedQuestions,
      pendingQuestions: session.questions.filter((item) => item.status === "answered").length,
      averageScore: session.averageScore,
    };
  }

  attempt.score = evaluation.score;
  attempt.feedback = evaluation.feedback;
  attempt.strengths = evaluation.strengths;
  attempt.improvementAreas = evaluation.improvementAreas;
  attempt.evaluationStatus = "completed";
  await attempt.save();
  await awardActivity({ userId, activityKey: `practice_attempt:${attempt._id}`, type: "practice_evaluated", occurredAt: attempt.updatedAt });

  sessionQuestion.status = "evaluated";
  sessionQuestion.score = evaluation.score;
  session.evaluatedQuestions = session.questions.filter((item) => item.status === "evaluated").length;
  const scores = session.questions.filter((item) => item.status === "evaluated").map((item) => Number(item.score) || 0);
  session.averageScore = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  await session.save();

  return {
    pending: false,
    sessionId: session._id,
    questionId: question._id,
    attemptId: attempt._id,
    questionType: question.questionType,
    evaluationStatus: attempt.evaluationStatus,
    questionStatus: sessionQuestion.status,
    score: attempt.score,
    feedback: attempt.feedback,
    strengths: attempt.strengths,
    improvementAreas: attempt.improvementAreas,
    evaluatedQuestions: session.evaluatedQuestions,
    pendingQuestions: session.questions.filter((item) => item.status === "answered").length,
    averageScore: session.averageScore,
  };
};

