
import PracticeSession from "../models/PracticeSession.js";
import PracticeQuestion from "../models/PracticeQuestion.js";
import PracticeAttempt from "../models/PracticeAttempt.js";

const submitSessionAnswer = async ({
  userId,
  sessionId,
  questionId,
  answer = "",
  selectedOption = "",
  timeTaken = 0,
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

  if (!answer?.trim() && !selectedOption?.trim()) {
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
      isCorrect,
      score,
      timeTaken:
        Number(timeTaken) || 0,
      evaluationStatus,
    });

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

  await practiceSession.save();

  return {
    sessionId: practiceSession._id,
    questionId: question._id,
    attemptId: practiceAttempt._id,
    questionType:
      question.questionType,
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
    totalQuestions:
      practiceSession.totalQuestions,
    averageScore:
      practiceSession.averageScore,
    submittedAt:
      practiceAttempt.createdAt,
  };
};

export default submitSessionAnswer;

