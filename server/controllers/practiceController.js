import PracticeQuestion from "../models/PracticeQuestion.js";
import getPracticeProgressService from "../services/practiceProgressService.js";

export const getPracticeQuestions = async (req, res, next) => {
  try {
    const {
      category,
      difficulty,
      targetRole,
      skill,
      limit = 10,
    } = req.query;

    const query = {
      isActive: true,
    };

    if (category) {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (targetRole) {
      query.targetRoles = {
        $in: [targetRole],
      };
    }

    if (skill) {
      query.skills = {
        $in: [skill],
      };
    }

    const parsedLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      50
    );

    const questions = await PracticeQuestion.find(query)
      .select("-correctAnswer -expectedAnswer -explanation")
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .lean();

    return res.status(200).json({
      success: true,
      message: "Practice questions retrieved successfully",
      data: {
        total: questions.length,
        questions,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getPracticeQuestionById = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const question = await PracticeQuestion.findOne({
      _id: id,
      isActive: true,
    })
      .select("-correctAnswer -expectedAnswer -explanation")
      .lean();

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Practice question not found",
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Practice question retrieved successfully",
      data: question,
    });
  } catch (error) {
    return next(error);
  }
};

export const createPracticeQuestion = async (
  req,
  res,
  next
) => {
  try {
    const {
      question,
      questionType,
      category,
      difficulty,
      targetRoles,
      skills,
      options,
      correctAnswer,
      expectedAnswer,
      explanation,
      hints,
      evaluationCriteria,
      source,
    } = req.body;

    if (!question || !questionType || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Question, question type, and category are required",
        errors: [],
      });
    }

    if (
      ![
        "mcq",
        "technical",
        "behavioral",
        "coding",
        "scenario",
      ].includes(questionType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid question type",
        errors: [],
      });
    }

    if (
      ![
        "technical",
        "coding",
        "aptitude",
        "behavioral",
        "hr",
        "communication",
      ].includes(category)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid question category",
        errors: [],
      });
    }

    const practiceQuestion =
      await PracticeQuestion.create({
        question: question.trim(),
        questionType,
        category,
        difficulty: difficulty || "medium",
        targetRoles: Array.isArray(targetRoles)
          ? targetRoles
          : [],
        skills: Array.isArray(skills)
          ? skills
          : [],
        options: Array.isArray(options)
          ? options
          : [],
        correctAnswer: correctAnswer || "",
        expectedAnswer: expectedAnswer || "",
        explanation: explanation || "",
        hints: Array.isArray(hints)
          ? hints
          : [],
        evaluationCriteria: Array.isArray(
          evaluationCriteria
        )
          ? evaluationCriteria
          : [],
        source: source || "system",
      });

    return res.status(201).json({
      success: true,
      message:
        "Practice question created successfully",
      data: practiceQuestion,
    });
  } catch (error) {
    return next(error);
  }
};

export const getPracticeProgress = async (
  req,
  res,
  next
) => {
  try {
    const progress =
      await getPracticeProgressService(
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      message:
        "Practice progress retrieved successfully",
      data: progress,
    });
  } catch (error) {
    return next(error);
  }
};