import PracticeQuestion from "../models/PracticeQuestion.js";

const normalizeText = (text) => {
  if (typeof text !== "string") {
    return "";
  }

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const calculateKeywordCoverage = (answer, criteria) => {
  if (!answer || !Array.isArray(criteria) || criteria.length === 0) {
    return 0;
  }

  const normalizedAnswer = normalizeText(answer);

  let matchedCriteria = 0;

  criteria.forEach((criterion) => {
    const words = normalizeText(criterion)
      .split(" ")
      .filter((word) => word.length >= 4);

    if (!words.length) {
      return;
    }

    const matchedWords = words.filter((word) =>
      normalizedAnswer.includes(word)
    );

    const coverage = matchedWords.length / words.length;

    if (coverage >= 0.4) {
      matchedCriteria += 1;
    }
  });

  return Math.round(
    (matchedCriteria / criteria.length) * 100
  );
};

const evaluateTechnicalAnswer = ({
  answer,
  question,
}) => {
  const normalizedAnswer = normalizeText(answer);

  if (!normalizedAnswer) {
    return {
      score: 0,
      feedback: "No answer was provided.",
      strengths: [],
      improvementAreas: [
        "Provide a complete answer.",
        "Explain the concept with relevant technical details.",
      ],
    };
  }

  const answerLength = normalizedAnswer.split(" ").length;

  const keywordCoverage = calculateKeywordCoverage(
    answer,
    question.evaluationCriteria
  );

  const criteriaCount = Array.isArray(
    question.evaluationCriteria
  )
    ? question.evaluationCriteria.length
    : 0;

  const completenessScore =
    answerLength >= 30
      ? 100
      : answerLength >= 15
        ? 70
        : 40;

  const finalScore = Math.min(
    100,
    Math.round(
      keywordCoverage * 0.7 +
      completenessScore * 0.3
    )
  );

  const strengths = [];
  const improvementAreas = [];

  if (keywordCoverage >= 70) {
    strengths.push(
      "The answer addresses several important evaluation criteria."
    );
  } else {
    improvementAreas.push(
      "Cover more of the important concepts expected in the question."
    );
  }

  if (completenessScore >= 70) {
    strengths.push(
      "The answer provides a reasonable amount of explanation."
    );
  } else {
    improvementAreas.push(
      "Provide a more detailed explanation with a relevant example."
    );
  }

  if (criteriaCount > 0 && keywordCoverage < 50) {
    improvementAreas.push(
      "Make sure to address the key points mentioned in the evaluation criteria."
    );
  }

  let feedback = "";

  if (finalScore >= 80) {
    feedback =
      "Good answer. You covered the major concepts expected for this question.";
  } else if (finalScore >= 60) {
    feedback =
      "Decent answer, but some important technical points could be explained more clearly.";
  } else if (finalScore >= 40) {
    feedback =
      "The basic idea is present, but the answer needs more technical depth and completeness.";
  } else {
    feedback =
      "The answer needs significant improvement. Focus on the core concept and explain it with a relevant example.";
  }

  return {
    score: finalScore,
    feedback,
    strengths,
    improvementAreas,
  };
};

export const evaluatePracticeAnswer = async ({
  questionId,
  answer,
}) => {
  const question = await PracticeQuestion.findOne({
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

  if (!answer || typeof answer !== "string") {
    const error = new Error(
      "Answer is required for evaluation"
    );

    error.statusCode = 400;
    error.isOperational = true;

    throw error;
  }

  if (question.questionType === "technical") {
    return evaluateTechnicalAnswer({
      answer,
      question,
    });
  }

  return {
    score: 0,
    feedback:
      "This question type is not yet supported by the evaluation engine.",
    strengths: [],
    improvementAreas: [
      "Evaluation support for this question type will be added in a future evaluation module.",
    ],
  };
};

export default evaluatePracticeAnswer;