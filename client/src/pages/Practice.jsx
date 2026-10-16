import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

const tracks = [
  { value: "technical", label: "Technical" },
  { value: "aptitude", label: "Aptitude" },
  { value: "coding", label: "Coding" },
  { value: "communication", label: "Communication / English" },
];

function Practice() {
  const [category, setCategory] = useState("technical");
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState(null);
  const [current, setCurrent] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState(null);
  const [sessionStarting, setSessionStarting] = useState(false);
  const [sessionReport, setSessionReport] = useState(null);
  const [questionCount, setQuestionCount] = useState("5");
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [language, setLanguage] = useState("javascript");

  const loadProgress = async () => {
    const response = await apiRequest("/practice/progress");
    setProgress(response.data);
  };

  useEffect(() => {
    let active = true;
    apiRequest("/practice/progress")
      .then((progressResponse) => {
        if (!active) return;
        setProgress(progressResponse.data);
      })
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [category, difficulty]);

  useEffect(() => {
    if (!sessionStartedAt || sessionReport) return undefined;
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - sessionStartedAt) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [sessionStartedAt, sessionReport]);

  const formatDuration = (seconds = 0) => `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

  const chooseQuestion = (question) => {
    setCurrent(question);
    setAnswer("");
    setResult(null);
  };

  const startSession = async () => {
    setSessionStarting(true);
    setError("");
    try {
      const created = await apiRequest("/practice-sessions", {
        method: "POST",
        body: JSON.stringify({
          category,
          difficulty: difficulty || "medium",
          questionLimit: Number(questionCount),
        }),
      });
      const started = await apiRequest(`/practice-sessions/${created.data.sessionId}/start`, { method: "POST" });
      const nextQuestions = started.data.questions || [];
      setSession({ ...started.data, sessionId: created.data.sessionId });
      const startedAt = started.data.startedAt ? new Date(started.data.startedAt).getTime() : Date.now();
      setSessionStartedAt(startedAt);
      setElapsedSeconds(0);
      setQuestions(nextQuestions);
      setCurrent(nextQuestions[0] || null);
      setAnswer("");
      setResult(null);
      setSessionReport(null);
    } catch (requestError) {
      setError(requestError.message || "Unable to start the practice session.");
    } finally {
      setSessionStarting(false);
    }
  };

  const nextQuestion = () => {
    const index = questions.findIndex((question) => (question._id || question.questionId) === (current?._id || current?.questionId));
    const next = questions.slice(index + 1).find((question) => question.status === "not_answered") || questions.slice(0, index).find((question) => question.status === "not_answered");
    if (next) {
      chooseQuestion(next);
    } else if (session) {
      setSessionReport({
        answered: session.answeredQuestions || questions.length,
        evaluated: session.evaluatedQuestions || 0,
        pending: session.skippedQuestions || 0,
        average: session.averageScore || 0,
      });
    }
  };

  const finishSession = () => {
    if (!session) return;
    const finalTime = elapsedSeconds;
    setSessionStartedAt(null);
    setSessionReport({
      answered: session.answeredQuestions || questions.filter((item) => item.status !== "not_answered").length,
      evaluated: session.evaluatedQuestions || questions.filter((item) => item.status === "evaluated").length,
      pending: session.skippedQuestions || questions.filter((item) => item.status === "skipped").length,
      average: session.averageScore || 0,
      timeSeconds: finalTime,
    });
  };

  const skipQuestion = async () => {
    if (!session || !current || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await apiRequest(`/practice-sessions/${session.sessionId}/questions/${current.questionId || current._id}/submit`, {
        method: "POST",
        body: JSON.stringify({ skipped: true, timeTaken: elapsedSeconds }),
      });
      const nextResult = response.data;
      const updatedQuestions = questions.map((item) =>
        (item.questionId || item._id) === (current.questionId || current._id)
          ? { ...item, status: "skipped" }
          : item
      );
      setQuestions(updatedQuestions);
      setSession((previous) => ({ ...previous, answeredQuestions: nextResult.answeredQuestions, skippedQuestions: nextResult.skippedQuestions, status: nextResult.status || previous.status }));
      const next = updatedQuestions.find((item) => item.status === "not_answered");
      if (next) {
        chooseQuestion(next);
      } else {
        setSessionStartedAt(null);
        setSessionReport({ answered: nextResult.answeredQuestions, evaluated: nextResult.evaluatedQuestions, pending: nextResult.skippedQuestions, average: nextResult.averageScore, timeSeconds: elapsedSeconds });
      }
      await loadProgress();
    } catch (requestError) {
      setError(requestError.message || "Unable to skip this question.");
    } finally {
      setSubmitting(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!current || !answer.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      const response = session
        ? await apiRequest(`/practice-sessions/${session.sessionId}/questions/${current.questionId || current._id}/submit`, {
          method: "POST",
          body: JSON.stringify({ answer: answer.trim(), selectedOption: current.questionType === "mcq" ? answer.trim() : "", language: current.questionType === "coding" ? language : "", timeTaken: elapsedSeconds }),
        })
        : await apiRequest(`/practice/questions/${current._id}/attempt`, {
          method: "POST",
          body: JSON.stringify({ answer: answer.trim(), selectedOption: current.questionType === "mcq" ? answer.trim() : "", timeTaken: 0 }),
        });
      let nextResult = response.data;
      if (current.questionType !== "mcq" && response.data.evaluationStatus === "pending") {
        try {
          const evaluationResponse = session
            ? await apiRequest(`/practice-sessions/${session.sessionId}/questions/${current.questionId || current._id}/evaluate`, { method: "POST" })
            : await apiRequest(`/practice/attempts/${response.data.attemptId}/evaluate`, { method: "POST" });
          nextResult = evaluationResponse.data;
        } catch (evaluationError) {
          nextResult = { ...response.data, feedback: evaluationError.message };
        }
      }
      setResult(nextResult);
      if (session) {
        setQuestions((items) => items.map((item) =>
          (item.questionId || item._id) === (current.questionId || current._id)
            ? { ...item, status: nextResult.questionStatus || "answered" }
            : item
        ));
        const answered = nextResult.answeredQuestions ?? 0;
        const total = nextResult.totalQuestions ?? session.totalQuestions ?? questions.length;
        setSession((previous) => ({
          ...previous,
          answeredQuestions: nextResult.answeredQuestions ?? previous.answeredQuestions,
          evaluatedQuestions: nextResult.evaluatedQuestions ?? previous.evaluatedQuestions,
          averageScore: nextResult.averageScore ?? previous.averageScore,
          status: nextResult.status || previous.status,
        }));
        if (answered >= total && total > 0) {
          setSessionReport({
            answered,
            evaluated: nextResult.evaluatedQuestions ?? 0,
            pending: Math.max(0, answered - (nextResult.evaluatedQuestions ?? 0)),
            average: nextResult.averageScore ?? 0,
            timeSeconds: elapsedSeconds,
          });
        }
      }
      await loadProgress();
    } catch (requestError) {
      setError(requestError.message || "Unable to submit the answer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <header className="border-b border-white/[0.07] bg-[#080c1a] px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <Link to="/dashboard" className="text-sm text-blue-300 hover:text-blue-200">← Dashboard</Link>
            <h1 className="mt-3 text-3xl font-bold">Practice workspace</h1>
            <p className="mt-2 text-sm text-slate-400">Technical and aptitude practice with honest results.</p>
          </div>
          <div className="hidden rounded-2xl border border-blue-400/15 bg-blue-400/[0.07] px-5 py-3 text-right sm:block">
            <p className="text-xs text-slate-400">Average score</p>
            <p className="mt-1 text-2xl font-bold text-blue-200">{progress?.overview?.averageScore || 0}/100</p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-white/[0.08] bg-[#0b1020] p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Question bank</p><h2 className="mt-2 text-xl font-bold">Choose a track</h2></div>
            <div className="flex flex-wrap gap-2">
              {tracks.map((track) => <button key={track.value} type="button" onClick={() => setCategory(track.value)} disabled={Boolean(session)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${category === track.value ? "bg-blue-600 text-white" : "border border-white/10 text-slate-400 hover:bg-white/[0.05]"} disabled:opacity-50`}>{track.label}</button>)}
              <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} disabled={Boolean(session)} className="rounded-xl border border-white/10 bg-[#070b17] px-3 py-2 text-sm text-slate-300"><option value="">All levels</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>
              <select value={questionCount} onChange={(event) => setQuestionCount(event.target.value)} disabled={Boolean(session)} className="rounded-xl border border-white/10 bg-[#070b17] px-3 py-2 text-sm text-slate-300"><option value="3">3 questions</option><option value="5">5 questions</option><option value="10">10 questions</option><option value="20">20 questions</option></select>
              {!session && <button type="button" onClick={startSession} disabled={sessionStarting} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500 disabled:opacity-50">{sessionStarting ? "Starting..." : "Start session"}</button>}
              {session && <span className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">Session time: {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s</span>}
            </div>
          </div>

          {error && <p className="mt-5 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
          {loading && <p className="mt-8 text-sm text-slate-400">Loading practice...</p>}
          {!loading && !session && <p className="mt-8 rounded-xl border border-blue-400/15 bg-blue-500/[0.06] p-4 text-sm text-slate-300">Select your track and question count, then start a session. Questions will appear only after the session starts.</p>}
          {!loading && session && !questions.length && <p className="mt-8 text-sm text-slate-400">No questions are available for this selection.</p>}
          {!!questions.length && <div className="mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="space-y-2">{questions.map((question, index) => <button key={question.questionId || question._id} type="button" onClick={() => chooseQuestion(question)} disabled={Boolean(session && question.status !== "not_answered")} className={`w-full rounded-xl border px-3 py-3 text-left text-sm ${current?._id === question._id || current?.questionId === question.questionId ? "border-blue-400/30 bg-blue-500/10 text-blue-200" : "border-white/[0.07] text-slate-400 hover:bg-white/[0.04]"}`}><span className="text-xs text-slate-500">Question {index + 1}{question.status === "evaluated" ? " · evaluated" : question.status === "answered" ? " · pending" : ""}</span><span className="mt-1 block line-clamp-2">{question.question}</span></button>)}</div>
            {current && <form onSubmit={submit} className="rounded-2xl border border-white/[0.08] bg-[#080c1a] p-5 sm:p-6">
              <div className="text-xs capitalize text-slate-500">{current.difficulty} · {current.questionType}</div>
              <h3 className="mt-5 text-lg font-semibold leading-8">{current.question}</h3>
              {current.questionType === "mcq" ? <div className="mt-6 space-y-3">{(current.options || []).map((option) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm ${answer === option ? "border-blue-400/30 bg-blue-500/10 text-blue-200" : "border-white/[0.08] text-slate-300 hover:bg-white/[0.04]"}`}><input type="radio" name="option" value={option} checked={answer === option} onChange={(event) => setAnswer(event.target.value)} />{option}</label>)}</div> : <div className="mt-6">{current.questionType === "coding" && <><div className="mb-3 flex items-center justify-between gap-3"><p className="text-xs text-slate-500">Choose language and write your solution.</p><select value={language} onChange={(event) => setLanguage(event.target.value)} className="rounded-lg border border-white/10 bg-[#070b17] px-3 py-2 text-xs text-slate-300"><option value="javascript">JavaScript</option><option value="python">Python</option><option value="java">Java</option><option value="cpp">C++</option></select></div>{current.functionSignature && <pre className="mb-3 overflow-x-auto rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-blue-200">{current.functionSignature}</pre>}</>}<textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows={current.questionType === "coding" ? 14 : 7} placeholder={current.questionType === "coding" ? (current.starterCode || "Write your solution...") : "Write your answer..."} className="w-full rounded-xl border border-white/10 bg-[#070b17] p-4 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400/40" /></div>}
              <button type="submit" disabled={!answer.trim() || Boolean(result) || submitting} className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold disabled:opacity-50">{submitting ? "Checking answer..." : result ? "Answer submitted" : "Submit answer"}</button>
              {session && !result && <button type="button" onClick={skipQuestion} disabled={submitting} className="ml-2 mt-6 rounded-xl border border-amber-400/20 px-5 py-3 text-sm font-semibold text-amber-200 hover:bg-amber-500/10 disabled:opacity-50">Skip / Mark for later</button>}
              {result && <div className={`mt-5 rounded-xl border p-4 ${result.evaluationStatus === "completed" ? "border-emerald-400/20 bg-emerald-500/10" : "border-amber-400/20 bg-amber-500/10"}`}><p className="font-semibold">{result.evaluationStatus === "completed" ? `${result.resultLabel === "correct" ? "Correct" : result.resultLabel === "partially_correct" ? "Partially correct" : "Incorrect"} · ${result.score}/100` : "Evaluation pending"}</p><p className="mt-2 text-sm text-slate-300">{result.feedback || (result.evaluationStatus === "completed" ? "Your answer was evaluated." : "This answer type is not currently supported by the evaluator.")}</p>{result.correctAnswer && <p className="mt-3 text-sm text-slate-300"><span className="font-semibold text-blue-200">Correct answer: </span>{result.correctAnswer}</p>}{result.strengths?.length > 0 && <p className="mt-3 text-sm text-emerald-200">What went well: {result.strengths.join(" ")}</p>}{result.improvementAreas?.length > 0 && <p className="mt-2 text-sm text-amber-200">Improve: {result.improvementAreas.join(" ")}</p>}{result.explanation && <p className="mt-3 border-t border-white/10 pt-3 text-sm text-slate-300"><span className="font-semibold text-blue-200">Explanation: </span>{result.explanation}</p>}<div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => { setAnswer(""); setResult(null); }} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/[0.05]">Retry</button>{questions.some((item) => item.status === "not_answered") ? <button type="button" onClick={nextQuestion} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500">Next question</button> : <button type="button" onClick={finishSession} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500">Finish session</button>}</div></div>}
            </form>}
          </div>}
        </section>

        <aside className="rounded-3xl border border-white/[0.08] bg-[#0b1020] p-5 sm:p-7"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Your progress</p><h2 className="mt-2 text-xl font-bold">Practice overview</h2><div className="mt-6 grid grid-cols-2 gap-3">{[["Attempts", progress?.overview?.totalAttempts || 0], ["Evaluated", progress?.overview?.evaluatedAttempts || 0], ["Pending", progress?.overview?.pendingAttempts || 0], ["Level", progress?.overview?.performanceLevel || "—"]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-lg font-bold text-slate-200">{value}</p></div>)}</div><h3 className="mt-8 text-sm font-semibold">Category performance</h3><div className="mt-3 space-y-3">{(progress?.categoryStats || []).map((item) => <div key={item.category} className="rounded-xl border border-white/[0.07] p-3"><div className="flex justify-between text-sm"><span className="capitalize text-slate-300">{item.category}</span><span className="text-blue-300">{item.averageScore}/100</span></div><p className="mt-1 text-xs text-slate-500">{item.evaluated} evaluated of {item.attempts} attempts</p></div>)}{!progress?.categoryStats?.length && <p className="text-sm text-slate-500">Complete a question to see your progress.</p>}</div></aside>
        {sessionReport && <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5"><h2 className="font-semibold">Session complete</h2><p className="mt-2 text-sm text-slate-300">Answered: {sessionReport.answered} · Evaluated: {sessionReport.evaluated} · Pending/unsupported: {sessionReport.pending}</p><p className="mt-2 text-sm text-slate-300">Evaluated average: {sessionReport.average}/100</p><p className="mt-2 text-sm font-semibold text-emerald-200">Time taken: {formatDuration(sessionReport.timeSeconds || 0)}</p></div>}
      </main>
    </div>
  );
}

export default Practice;
