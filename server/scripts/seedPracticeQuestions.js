import dotenv from "dotenv";
import mongoose from "mongoose";
import PracticeQuestion from "../models/PracticeQuestion.js";

dotenv.config();

const questions = [
  ["Which data structure follows LIFO order?", ["Queue", "Stack", "Heap", "Graph"], "Stack", "A stack removes the most recently added item first."],
  ["What is the average lookup complexity of a hash table?", ["O(1)", "O(n)", "O(log n)", "O(n log n)"], "O(1)", "Hash tables provide constant average-time lookup with a good hash function."],
  ["Which SQL clause filters grouped results?", ["WHERE", "GROUP BY", "HAVING", "ORDER BY"], "HAVING", "HAVING filters groups after aggregation."],
  ["Which HTTP status means the request succeeded?", ["200", "301", "404", "500"], "200", "HTTP 200 indicates a successful request."],
  ["Which React hook stores local component state?", ["useEffect", "useState", "useMemo", "useRef"], "useState", "useState adds state to a function component."],
  ["What does normalization reduce in a relational database?", ["Duplication", "Security", "Latency only", "Indexes"], "Duplication", "Normalization organizes data to reduce unnecessary duplication and update anomalies."],
  ["Which protocol is used for secure HTTP?", ["FTP", "SSH", "HTTPS", "SMTP"], "HTTPS", "HTTPS is HTTP protected by TLS."],
  ["What is the entry point of a Node.js application commonly called?", ["index.js", "style.css", "schema.sql", "vite.svg"], "index.js", "index.js is a common Node.js application entry file."],
  ["Which OOP principle hides internal implementation details?", ["Inheritance", "Encapsulation", "Polymorphism", "Overloading"], "Encapsulation", "Encapsulation exposes a controlled interface while hiding internal details."],
  ["Which MongoDB operation adds a document?", ["find", "insertOne", "aggregate", "deleteOne"], "insertOne", "insertOne creates a document in a MongoDB collection."],
].map(([question, options, correctAnswer, explanation]) => ({
  question,
  questionType: "mcq",
  category: "technical",
  difficulty: "medium",
  options,
  correctAnswer,
  explanation,
  source: "system",
}));

const aptitude = [
  ["If 20% of a number is 40, what is the number?", ["100", "150", "200", "250"], "200", "40 / 0.20 = 200."],
  ["What is the next number: 2, 4, 8, 16, ?", ["20", "24", "30", "32"], "32", "Each number is multiplied by 2."],
  ["A train travels 120 km in 2 hours. What is its speed?", ["40 km/h", "50 km/h", "60 km/h", "80 km/h"], "60 km/h", "Speed = distance / time = 120 / 2 = 60 km/h."],
  ["If A is taller than B and B is taller than C, who is shortest?", ["A", "B", "C", "Cannot determine"], "C", "The ordering is A > B > C."],
  ["What is the probability of getting heads on a fair coin?", ["1/4", "1/2", "2/3", "1"], "1/2", "A fair coin has two equally likely outcomes."],
  ["Choose the synonym of 'rapid'.", ["Slow", "Fast", "Weak", "Late"], "Fast", "Rapid means fast or quick."],
  ["If 5 workers finish a task in 10 days, at the same rate 10 workers take how many days?", ["2", "5", "10", "20"], "5", "Doubling workers halves the time."],
  ["Find the odd one out.", ["Apple", "Mango", "Carrot", "Banana"], "Carrot", "Carrot is a vegetable; the others are fruits."],
  ["What is 15% of 200?", ["15", "20", "30", "35"], "30", "0.15 × 200 = 30."],
  ["A clock shows 3:00. What is the angle between the hands?", ["0°", "45°", "90°", "180°"], "90°", "At 3:00 the hands are perpendicular."],
].map(([question, options, correctAnswer, explanation]) => ({
  question,
  questionType: "mcq",
  category: "aptitude",
  difficulty: "medium",
  options,
  correctAnswer,
  explanation,
  source: "system",
}));

const coding = [
  ["Reverse a string", "Given a string, return the string reversed.", "function reverseString(value) {\n  // write your solution\n}", "function reverseString(value)"],
  ["Find the maximum number", "Given an array of numbers, return the largest value.", "function findMax(numbers) {\n  // write your solution\n}", "function findMax(numbers)"],
  ["Count vowels", "Return the number of vowels in a string.", "function countVowels(value) {\n  // write your solution\n}", "function countVowels(value)"],
  ["Remove duplicates", "Return an array containing each value only once.", "function removeDuplicates(values) {\n  // write your solution\n}", "function removeDuplicates(values)"],
  ["Check palindrome", "Return true when a string reads the same forward and backward.", "function isPalindrome(value) {\n  // write your solution\n}", "function isPalindrome(value)"],
].map(([title, question, starterCode, functionSignature]) => ({
  question: `${title}: ${question}`,
  questionType: "coding",
  category: "coding",
  difficulty: "medium",
  starterCode,
  functionSignature,
  evaluationCriteria: ["Uses a correct algorithm", "Handles normal input", "Returns the requested result"],
  source: "system",
}));

const communication = [
  ["Choose the grammatically correct sentence.", ["He go to college daily.", "He goes to college daily.", "He going college daily.", "He gone to college daily."], "He goes to college daily.", "The singular subject 'He' takes 'goes'."],
  ["Choose the closest meaning of 'concise'.", ["Very long", "Clear and brief", "Confusing", "Informal"], "Clear and brief", "Concise means expressing something clearly in few words."],
  ["Complete: She is good ___ communication.", ["in", "on", "at", "for"], "at", "The standard phrase is 'good at communication'."],
  ["Choose the professional email opening.", ["Hey dude", "Yo", "Dear Hiring Manager", "Listen"], "Dear Hiring Manager", "Dear Hiring Manager is a professional neutral opening."],
  ["What should an interview answer include?", ["Only yes/no", "A clear structure and example", "Unrelated jokes", "No details"], "A clear structure and example", "Structured answers with evidence are easier to understand."],
  ["Choose the antonym of 'expand'.", ["Increase", "Extend", "Contract", "Explain"], "Contract", "Contract means to become smaller or reduce."],
  ["Which is a polite request?", ["Give me that now.", "Could you please share the details?", "You must send it.", "Send it."], "Could you please share the details?", "Could you please is a polite request form."],
  ["Choose the correct word: The results ___ ready.", ["is", "are", "be", "am"], "are", "Results is plural, so the verb is 'are'."],
  ["What is active listening?", ["Interrupting often", "Ignoring the speaker", "Understanding and responding thoughtfully", "Changing the topic"], "Understanding and responding thoughtfully", "Active listening involves attention, understanding, and relevant response."],
  ["Choose the best interview closing.", ["Bye.", "Whatever.", "Thank you for your time and consideration.", "I am leaving."], "Thank you for your time and consideration.", "This is a polite and professional closing."],
].map(([question, options, correctAnswer, explanation]) => ({ question, questionType: "mcq", category: "communication", difficulty: "medium", options, correctAnswer, explanation, source: "system" }));

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const allQuestions = [...questions, ...aptitude, ...coding, ...communication];
  let inserted = 0;
  for (const question of allQuestions) {
    const existing = await PracticeQuestion.findOne({
      question: question.question,
      source: "system",
    });
    if (!existing) {
      await PracticeQuestion.create(question);
      inserted += 1;
    }
  }
  console.log(`Practice seed complete. Added ${inserted} sample questions.`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Practice seed failed:", error.message);
  await mongoose.disconnect().catch(() => {});
  process.exitCode = 1;
});
