const localEvaluate = (answer) => {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  if (words < 10) return { score: 35, feedback: "Partially answered. Add structure, details, and a concrete example." };
  if (words < 25) return { score: 65, feedback: "Reasonable answer. Add more specific reasoning or evidence." };
  return { score: 85, feedback: "Clear and detailed answer. Keep the structure concise and evidence-based." };
};

export const evaluateInterviewAnswer = async ({ question, answer }) => {
  const endpoint = process.env.AI_EVALUATION_URL;
  const apiKey = process.env.AI_EVALUATION_API_KEY;
  if (!endpoint || !apiKey) return { ...localEvaluate(answer), provider: "local_rubric", isAi: false };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ question, answer }),
    });
    if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
    const data = await response.json();
    if (!Number.isFinite(Number(data.score)) || typeof data.feedback !== "string") throw new Error("AI provider returned an invalid evaluation");
    return { score: Math.max(0, Math.min(100, Number(data.score))), feedback: data.feedback, provider: "configured_ai", isAi: true };
  } catch (error) {
    return { ...localEvaluate(answer), provider: "local_rubric_fallback", isAi: false, providerError: error.message };
  }
};
