import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function AdminPanel() {
  let user = null;
  try { user = JSON.parse(localStorage.getItem("user") || "null"); } catch { /* Treat unreadable session data as unauthenticated. */ }
  const [form, setForm] = useState({ question: "", questionType: "mcq", category: "technical", difficulty: "medium", options: "", correctAnswer: "", explanation: "", starterCode: "", functionSignature: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const loadQuestions = async () => {
    try { const response = await apiRequest("/practice/admin/questions"); setQuestions(response.data.questions || []); } catch (requestError) { setError(requestError.message); }
  };
  useEffect(() => {
    let active = true;
    apiRequest("/practice/admin/questions")
      .then((response) => { if (active) setQuestions(response.data.questions || []); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, []);
  const update = (event) => setForm((old) => ({ ...old, [event.target.name]: event.target.value }));
  const create = async (event) => {
    event.preventDefault(); setMessage(""); setError("");
    try {
      const response = await apiRequest("/practice/questions", { method: "POST", body: JSON.stringify({ ...form, options: form.options.split("\n").map((item) => item.trim()).filter(Boolean), source: "admin" }) });
      setMessage(response.message || "Question created successfully.");
      loadQuestions();
      setForm((old) => ({ ...old, question: "", options: "", correctAnswer: "", explanation: "", starterCode: "", functionSignature: "" }));
    } catch (requestError) { setError(requestError.message); }
  };
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <div className="min-h-screen bg-[#050816] text-white"><header className="border-b border-white/[0.07] bg-[#080c1a] px-5 py-6 sm:px-8"><div className="mx-auto max-w-5xl"><Link to="/dashboard" className="text-sm text-blue-300">← Dashboard</Link><h1 className="mt-3 text-3xl font-bold">Admin Panel</h1><p className="mt-2 text-sm text-slate-400">Manage the practice question bank. Server authorization is required.</p></div></header><main className="mx-auto max-w-5xl px-5 py-8 sm:px-8"><section className="rounded-3xl border border-white/[0.08] bg-[#0b1020] p-6"><h2 className="text-xl font-bold">Create practice question</h2>{message && <p className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</p>}{error && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}<form onSubmit={create} className="mt-6 grid gap-4"><textarea name="question" value={form.question} onChange={update} required rows={3} placeholder="Question" className="rounded-xl border border-white/10 bg-[#070b17] p-3 text-sm" /><div className="grid gap-4 sm:grid-cols-3"><select name="questionType" value={form.questionType} onChange={update} className="rounded-xl border border-white/10 bg-[#070b17] p-3 text-sm"><option value="mcq">MCQ</option><option value="technical">Technical descriptive</option><option value="coding">Coding</option></select><select name="category" value={form.category} onChange={update} className="rounded-xl border border-white/10 bg-[#070b17] p-3 text-sm"><option value="technical">Technical</option><option value="aptitude">Aptitude</option><option value="coding">Coding</option><option value="communication">Communication / English</option><option value="behavioral">Behavioral</option></select><select name="difficulty" value={form.difficulty} onChange={update} className="rounded-xl border border-white/10 bg-[#070b17] p-3 text-sm"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div><textarea name="options" value={form.options} onChange={update} rows={4} placeholder="MCQ options, one per line" className="rounded-xl border border-white/10 bg-[#070b17] p-3 text-sm" /><div className="grid gap-4 sm:grid-cols-2"><input name="correctAnswer" value={form.correctAnswer} onChange={update} placeholder="Correct answer (MCQ)" className="rounded-xl border border-white/10 bg-[#070b17] p-3 text-sm" /><input name="functionSignature" value={form.functionSignature} onChange={update} placeholder="Function signature (coding)" className="rounded-xl border border-white/10 bg-[#070b17] p-3 text-sm" /></div><textarea name="starterCode" value={form.starterCode} onChange={update} rows={5} placeholder="Starter code (coding)" className="rounded-xl border border-white/10 bg-[#070b17] p-3 font-mono text-sm" /><textarea name="explanation" value={form.explanation} onChange={update} rows={3} placeholder="Explanation shown after submission" className="rounded-xl border border-white/10 bg-[#070b17] p-3 text-sm" /><button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold">Create question</button></form></section><section className="mt-6 rounded-3xl border border-white/[0.08] bg-[#0b1020] p-6"><h2 className="text-xl font-bold">Question bank</h2>{questions.length ? <div className="mt-4 space-y-3">{questions.map((item) => <div key={item._id} className="flex flex-col gap-3 rounded-xl border border-white/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-slate-200">{item.question}</p><p className="mt-1 text-xs capitalize text-slate-500">{item.category} · {item.questionType} · {item.difficulty} · used {item.usageCount}</p></div><button type="button" onClick={async () => { try { await apiRequest(`/practice/admin/questions/${item._id}`, { method: "PATCH", body: JSON.stringify({ isActive: !item.isActive }) }); loadQuestions(); } catch (requestError) { setError(requestError.message); } }} className={`rounded-lg px-3 py-2 text-xs font-semibold ${item.isActive ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-500/15 text-slate-300"}`}>{item.isActive ? "Active" : "Inactive"}</button></div>)}</div> : <p className="mt-4 text-sm text-slate-500">No practice questions found.</p>}</section></main></div>;
}

export default AdminPanel;
