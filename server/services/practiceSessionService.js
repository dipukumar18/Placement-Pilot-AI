import PracticeSession from "../models/PracticeSession.js";
import PracticeQuestion from "../models/PracticeQuestion.js";

const createPracticeSession = async ({
  userId,
  targetRole = "",
  category,
  difficulty = "medium",
  questionLimit = 5,
}) => {
  if (!userId) {
    const error = new Error(
      "User ID is required to create a practice session"
    );

    error.statusCode = 400;
    error.isOperational = true;

    throw error;
  }

  if (!category) {
    const error = new Error(
      "Practice category is required"
    );

    error.statusCode = 400;
    error.isOperational = true;

    throw error;
  }

  const allowedCategories = [
    "technical",
    "coding",
    "aptitude",
    "behavioral",
    "hr",
    "communication",
  ];

  if (!allowedCategories.includes(category)) {
    const error = new Error(
      "Invalid practice category"
    );

    error.statusCode = 400;
    error.isOperational = true;

    throw error;
  }

  const allowedDifficulties = [
    "easy",
    "medium",
    "hard",
  ];

  if (!allowedDifficulties.includes(difficulty)) {
    const error = new Error(
      "Invalid practice difficulty"
    );

    error.statusCode = 400;
    error.isOperational = true;

    throw error;
  }

  const parsedLimit = Math.min(
    Math.max(Number(questionLimit) || 5, 1),
    20
  );

  const query = {
    isActive: true,
    category,
    difficulty,
  };

  if (targetRole?.trim()) {
    query.targetRoles = {
      $in: [targetRole.trim()],
    };
  }

  let questions = await PracticeQuestion.find(query)
    .select("_id")
    .sort({ usageCount: 1, createdAt: -1 })
    .limit(parsedLimit)
    .lean();

  /*
   * If role-specific questions are not available,
   * fall back to category + difficulty questions.
   */
  if (questions.length < parsedLimit) {
    const existingQuestionIds =
      questions.map((item) => item._id);

    const fallbackQuery = {
      isActive: true,
      category,
      difficulty,
      _id: {
        $nin: existingQuestionIds,
      },
    };

    const remainingQuestions =
      await PracticeQuestion.find(fallbackQuery)
        .select("_id")
        .sort({
          usageCount: 1,
          createdAt: -1,
        })
        .limit(
          parsedLimit - questions.length
        )
        .lean();

    questions = [
      ...questions,
      ...remainingQuestions,
    ];
  }

  if (!questions.length) {
    const error = new Error(
      "No practice questions are available for the selected criteria"
    );

    error.statusCode = 404;
    error.isOperational = true;

    throw error;
  }

  const sessionQuestions = questions.map(
    (question, index) => ({
      question: question._id,
      attempt: null,
      order: index + 1,
      status: "not_answered",
      score: 0,
    })
  );

  const practiceSession =
    await PracticeSession.create({
      user: userId,
      targetRole: targetRole.trim(),
      category,
      difficulty,
      questions: sessionQuestions,
      totalQuestions: sessionQuestions.length,
      answeredQuestions: 0,
      evaluatedQuestions: 0,
      averageScore: 0,
      status: "not_started",
      startedAt: null,
      completedAt: null,
    });

  return practiceSession;
};

export default createPracticeSession;