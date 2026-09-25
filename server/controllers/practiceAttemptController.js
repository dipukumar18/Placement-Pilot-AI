import PracticeAttempt from "../models/PracticeAttempt.js";
import PracticeQuestion from "../models/PracticeQuestion.js";
import evaluatePracticeAnswer from "../services/practiceEvaluationService.js";

export const submitPracticeAttempt = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { answer, selectedOption, timeTaken } = req.body;

    if (!answer && !selectedOption) {
      return res.status(400).json({
        success: false,
        message: "Please provide an answer",
        errors: [],
      });
    }

    const question = await PracticeQuestion.findOne({
      _id: questionId,
      isActive: true,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Practice question not found",
        errors: [],
      });
    }

    let isCorrect = null;
    let score = 0;
    let evaluationStatus = "pending";

    if (question.questionType === "mcq") {
      const submittedAnswer = selectedOption || answer;

      isCorrect =
        submittedAnswer.trim().toLowerCase() ===
        question.correctAnswer.trim().toLowerCase();

      score = isCorrect ? 100 : 0;
      evaluationStatus = "completed";
    }

    const practiceAttempt = await PracticeAttempt.create({
      user: req.user.userId,
      question: question._id,
      answer: answer || selectedOption || "",
      selectedOption: selectedOption || "",
      isCorrect,
      score,
      timeTaken: Number(timeTaken) || 0,
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

    return res.status(201).json({
      success: true,
      message: "Practice attempt submitted successfully",
      data: {
        attemptId: practiceAttempt._id,
        questionId: question._id,
        questionType: question.questionType,
        isCorrect,
        score,
        evaluationStatus: practiceAttempt.evaluationStatus,
        submittedAt: practiceAttempt.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const evaluatePracticeAttempt = async (
  req,
  res,
  next
) => {
  try {
    const { attemptId } = req.params;

    const attempt = await PracticeAttempt.findOne({
      _id: attemptId,
      user: req.user.userId,
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Practice attempt not found",
        errors: [],
      });
    }

    if (attempt.evaluationStatus === "completed") {
      return res.status(200).json({
        success: true,
        message: "Practice attempt is already evaluated",
        data: {
          attemptId: attempt._id,
          score: attempt.score,
          isCorrect: attempt.isCorrect,
          evaluationStatus: attempt.evaluationStatus,
          feedback: attempt.feedback,
          strengths: attempt.strengths,
          improvementAreas: attempt.improvementAreas,
        },
      });
    }

    if (!attempt.answer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cannot evaluate an empty answer",
        errors: [],
      });
    }

    const evaluation = await evaluatePracticeAnswer({
      questionId: attempt.question,
      answer: attempt.answer,
    });

    attempt.score = evaluation.score;
    attempt.feedback = evaluation.feedback;
    attempt.strengths = evaluation.strengths;
    attempt.improvementAreas =
      evaluation.improvementAreas;
    attempt.evaluationStatus = "completed";

    if (attempt.questionType === "mcq") {
      attempt.isCorrect =
        evaluation.score === 100;
    }

    await attempt.save();

    return res.status(200).json({
      success: true,
      message: "Practice attempt evaluated successfully",
      data: {
        attemptId: attempt._id,
        questionId: attempt.question,
        score: attempt.score,
        isCorrect: attempt.isCorrect,
        evaluationStatus: attempt.evaluationStatus,
        feedback: attempt.feedback,
        strengths: attempt.strengths,
        improvementAreas: attempt.improvementAreas,
        evaluatedAt: attempt.updatedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getPracticeAttempts = async (
  req,
  res,
  next
) => {
  try {
    const attempts = await PracticeAttempt.find({
      user: req.user.userId,
    })
      .populate(
        "question",
        "question questionType category difficulty skills"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Practice attempts retrieved successfully",
      data: {
        total: attempts.length,
        attempts,
      },
    });
  } catch (error) {
    return next(error);
  }
};