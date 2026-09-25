
import PracticeSession from "../models/PracticeSession.js";

import createPracticeSession from "../services/practiceSessionService.js";

import submitSessionAnswerService from "../services/practiceSessionAnswerService.js";

export const createSession = async (
  req,
  res,
  next
) => {
  try {
    const {
      targetRole,
      category,
      difficulty,
      questionLimit,
    } = req.body;

    const practiceSession =
      await createPracticeSession({
        userId: req.user.userId,
        targetRole,
        category,
        difficulty,
        questionLimit,
      });

    return res.status(201).json({
      success: true,
      message:
        "Practice session created successfully",
      data: {
        sessionId: practiceSession._id,
        targetRole:
          practiceSession.targetRole,
        category:
          practiceSession.category,
        difficulty:
          practiceSession.difficulty,
        totalQuestions:
          practiceSession.totalQuestions,
        answeredQuestions:
          practiceSession.answeredQuestions,
        evaluatedQuestions:
          practiceSession.evaluatedQuestions,
        averageScore:
          practiceSession.averageScore,
        status:
          practiceSession.status,
        questions:
          practiceSession.questions.map(
            (item) => ({
              questionId: item.question,
              order: item.order,
              status: item.status,
            })
          ),
        createdAt:
          practiceSession.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const startSession = async (
  req,
  res,
  next
) => {
  try {
    const { sessionId } = req.params;

    const practiceSession =
      await PracticeSession.findOne({
        _id: sessionId,
        user: req.user.userId,
      }).populate(
        "questions.question",
        "question questionType category difficulty targetRoles skills options hints"
      );

    if (!practiceSession) {
      return res.status(404).json({
        success: false,
        message:
          "Practice session not found",
        errors: [],
      });
    }

    if (
      practiceSession.status ===
      "completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This practice session has already been completed",
        errors: [],
      });
    }

    if (
      practiceSession.status ===
      "in_progress"
    ) {
      return res.status(200).json({
        success: true,
        message:
          "Practice session is already in progress",
        data: {
          sessionId:
            practiceSession._id,
          targetRole:
            practiceSession.targetRole,
          category:
            practiceSession.category,
          difficulty:
            practiceSession.difficulty,
          totalQuestions:
            practiceSession.totalQuestions,
          answeredQuestions:
            practiceSession.answeredQuestions,
          evaluatedQuestions:
            practiceSession.evaluatedQuestions,
          averageScore:
            practiceSession.averageScore,
          status:
            practiceSession.status,
          startedAt:
            practiceSession.startedAt,
          questions:
            practiceSession.questions.map(
              (item) => ({
                questionId:
                  item.question?._id,
                order: item.order,
                status: item.status,
                question:
                  item.question?.question ||
                  "",
                questionType:
                  item.question?.questionType ||
                  "",
                category:
                  item.question?.category ||
                  "",
                difficulty:
                  item.question?.difficulty ||
                  "",
                skills:
                  item.question?.skills || [],
                options:
                  item.question?.options || [],
                hints:
                  item.question?.hints || [],
              })
            ),
        },
      });
    }

    practiceSession.status =
      "in_progress";

    practiceSession.startedAt =
      new Date();

    await practiceSession.save();

    return res.status(200).json({
      success: true,
      message:
        "Practice session started successfully",
      data: {
        sessionId:
          practiceSession._id,
        targetRole:
          practiceSession.targetRole,
        category:
          practiceSession.category,
        difficulty:
          practiceSession.difficulty,
        totalQuestions:
          practiceSession.totalQuestions,
        answeredQuestions:
          practiceSession.answeredQuestions,
        evaluatedQuestions:
          practiceSession.evaluatedQuestions,
        averageScore:
          practiceSession.averageScore,
        status:
          practiceSession.status,
        startedAt:
          practiceSession.startedAt,
        questions:
          practiceSession.questions.map(
            (item) => ({
              questionId:
                item.question?._id,
              order: item.order,
              status: item.status,
              question:
                item.question?.question ||
                "",
              questionType:
                item.question?.questionType ||
                "",
              category:
                item.question?.category ||
                "",
              difficulty:
                item.question?.difficulty ||
                "",
              skills:
                item.question?.skills || [],
              options:
                item.question?.options || [],
              hints:
                item.question?.hints || [],
            })
          ),
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const submitSessionAnswer = async (
  req,
  res,
  next
) => {
  try {
    const {
      sessionId,
      questionId,
    } = req.params;

    const {
      answer,
      selectedOption,
      timeTaken,
    } = req.body;

    const result =
      await submitSessionAnswerService({
        userId: req.user.userId,
        sessionId,
        questionId,
        answer,
        selectedOption,
        timeTaken,
      });

    return res.status(201).json({
      success: true,
      message:
        "Session answer submitted successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

