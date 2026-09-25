import PracticeAttempt from "../models/PracticeAttempt.js";

const calculateAverage = (scores) => {
  if (!scores.length) {
    return 0;
  }

  const total = scores.reduce(
    (sum, score) => sum + score,
    0
  );

  return Math.round(total / scores.length);
};

const getPerformanceLevel = (score) => {
  if (score >= 80) {
    return "strong";
  }

  if (score >= 60) {
    return "developing";
  }

  if (score >= 40) {
    return "needs_improvement";
  }

  return "weak";
};

const buildCategoryStats = (attempts) => {
  const categoryMap = new Map();

  attempts.forEach((attempt) => {
    const category =
      attempt.question?.category || "unknown";

    if (!categoryMap.has(category)) {
      categoryMap.set(category, {
        category,
        attempts: 0,
        evaluated: 0,
        scores: [],
      });
    }

    const categoryStats = categoryMap.get(category);

    categoryStats.attempts += 1;

    if (attempt.evaluationStatus === "completed") {
      categoryStats.evaluated += 1;
      categoryStats.scores.push(
        Number(attempt.score) || 0
      );
    }
  });

  return [...categoryMap.values()].map((item) => {
    const averageScore = calculateAverage(item.scores);

    return {
      category: item.category,
      attempts: item.attempts,
      evaluated: item.evaluated,
      averageScore,
      performanceLevel:
        getPerformanceLevel(averageScore),
    };
  });
};

const buildSkillStats = (attempts) => {
  const skillMap = new Map();

  attempts.forEach((attempt) => {
    const skills = attempt.question?.skills || [];

    skills.forEach((skill) => {
      if (!skillMap.has(skill)) {
        skillMap.set(skill, {
          skill,
          attempts: 0,
          scores: [],
        });
      }

      const skillStats = skillMap.get(skill);

      skillStats.attempts += 1;

      if (
        attempt.evaluationStatus ===
        "completed"
      ) {
        skillStats.scores.push(
          Number(attempt.score) || 0
        );
      }
    });
  });

  return [...skillMap.values()]
    .map((item) => {
      const averageScore = calculateAverage(
        item.scores
      );

      return {
        skill: item.skill,
        attempts: item.attempts,
        averageScore,
        performanceLevel:
          getPerformanceLevel(averageScore),
      };
    })
    .sort(
      (a, b) =>
        a.averageScore - b.averageScore
    );
};

export const getPracticeProgress = async (
  userId
) => {
  const attempts = await PracticeAttempt.find({
    user: userId,
  })
    .populate(
      "question",
      "question questionType category difficulty skills"
    )
    .sort({ createdAt: -1 })
    .lean();

  const totalAttempts = attempts.length;

  const evaluatedAttempts = attempts.filter(
    (attempt) =>
      attempt.evaluationStatus ===
      "completed"
  );

  const pendingAttempts = attempts.filter(
    (attempt) =>
      attempt.evaluationStatus ===
      "pending"
  );

  const scores = evaluatedAttempts.map(
    (attempt) =>
      Number(attempt.score) || 0
  );

  const averageScore =
    calculateAverage(scores);

  const categoryStats =
    buildCategoryStats(attempts);

  const skillStats =
    buildSkillStats(attempts);

  const weakAreas = skillStats
    .filter(
      (item) =>
        item.attempts > 0 &&
        item.averageScore < 60
    )
    .slice(0, 5);

  const recentAttempts = attempts
    .slice(0, 10)
    .map((attempt) => ({
      attemptId: attempt._id,
      questionId: attempt.question?._id,
      question:
        attempt.question?.question || "",
      questionType:
        attempt.question?.questionType || "",
      category:
        attempt.question?.category || "",
      difficulty:
        attempt.question?.difficulty || "",
      score:
        Number(attempt.score) || 0,
      evaluationStatus:
        attempt.evaluationStatus,
      feedback:
        attempt.feedback || "",
      createdAt: attempt.createdAt,
    }));

  return {
    overview: {
      totalAttempts,
      evaluatedAttempts: evaluatedAttempts.length,
      pendingAttempts: pendingAttempts.length,
      averageScore,
      performanceLevel:
        getPerformanceLevel(averageScore),
    },

    categoryStats,

    skillStats,

    weakAreas,

    recentAttempts,
  };
};

export default getPracticeProgress;