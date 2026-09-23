import PracticeAttempt from "../models/PracticeAttempt.js";
import PracticeQuestion from "../models/PracticeQuestion.js";

export const submitPracticeAttempt = async (
  req,
  res,
  next
) => {
  try {
    const { questionId } = req.params;

    const {
      answer,
      selectedOption,
      timeTaken,
    } = req.body;

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

    /*
     * MCQ questions can be evaluated immediately.
     * Technical, behavioral, coding, and scenario
     * questions will be evaluated later by the
     * evaluation system.
     */
    if (question.questionType === "mcq") {
      const submittedAnswer =
        selectedOption || answer;

      isCorrect =
        submittedAnswer.trim().toLowerCase() ===
        question.correctAnswer.trim().toLowerCase();

      score = isCorrect ? 100 : 0;
    }

    const practiceAttempt = await PracticeAttempt.create({
      user: req.user.userId,
      question: question._id,
      answer: answer || selectedOption || "",
      selectedOption: selectedOption || "",
      isCorrect,
      score,
      timeTaken: Number(timeTaken) || 0,
      evaluationStatus:
        question.questionType === "mcq"
          ? "completed"
          : "pending",
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
        evaluationStatus:
          practiceAttempt.evaluationStatus,
        submittedAt: practiceAttempt.createdAt,
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
      .sort({
        createdAt: -1,
      })
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