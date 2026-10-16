import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function Interview() {
  const [mode, setMode] = useState("mock");
  const [type, setType] = useState("mixed");
  const [role, setRole] = useState("");
  const [session, setSession] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerConnection = useRef(null);

  const startMock = async () => {
    setBusy(true); setMessage("");
    try { const response = await apiRequest("/interviews/mock", { method: "POST", body: JSON.stringify({ targetRole: role, interviewType: type }) }); setSession(response.data); }
    catch (error) { setMessage(error.message); } finally { setBusy(false); }
  };

  const submitAnswer = async (event) => {
    event.preventDefault(); if (!answer.trim() || !session) return;
    setBusy(true);
    try { const response = await apiRequest(`/interviews/mock/${session._id}/answers`, { method: "POST", body: JSON.stringify({ answer }) }); setResult(response.data); setAnswer(""); setSession((old) => ({ ...old, answers: response.data.answers || [...(old.answers || []), response.data], currentQuestion: response.data.currentQuestion, status: response.data.status, finalReport: response.data.finalReport })); }
    catch (error) { setMessage(error.message); } finally { setBusy(false); }
  };

  const createRoom = async () => {
    const response = await apiRequest("/interviews/peer/rooms", { method: "POST" });
    setRoomCode(response.data.roomCode); setSession({ ...response.data, owner: true });
  };

  const joinRoom = async () => {
    const response = await apiRequest("/interviews/peer/rooms/join", { method: "POST", body: JSON.stringify({ roomCode }) });
    setSession({ ...response.data, owner: false });
  };

  useEffect(() => () => { peerConnection.current?.close(); }, []);

  return <div className="min-h-screen bg-[#050816] text-white"><header className="border-b border-white/[0.07] bg-[#080c1a] px-5 py-6 sm:px-8"><div className="mx-auto max-w-7xl"><Link to="/dashboard" className="text-sm text-blue-300">← Dashboard</Link><h1 className="mt-3 text-3xl font-bold">Interview practice</h1><p className="mt-2 text-sm text-slate-400">Practice with a local rubric or meet a peer securely.</p></div></header><main className="mx-auto max-w-5xl px-5 py-8 sm:px-8"><div className="flex gap-2"><button type="button" onClick={() => { setMode("mock"); setSession(null); setResult(null); }} className={`rounded-xl px-4 py-2 text-sm font-semibold ${mode === "mock" ? "bg-blue-600" : "border border-white/10 text-slate-400"}`}>Mock interview</button><button type="button" onClick={() => { setMode("peer"); setSession(null); }} className={`rounded-xl px-4 py-2 text-sm font-semibold ${mode === "peer" ? "bg-violet-600" : "border border-white/10 text-slate-400"}`}>Peer video interview</button></div>{message && <p className="mt-5 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300">{message}</p>}{mode === "mock" ? <section className="mt-6 rounded-3xl border border-white/[0.08] bg-[#0b1020] p-6"><h2 className="text-xl font-bold">AI mock interview</h2><p className="mt-2 text-sm text-slate-400">Current evaluation uses a clearly labelled local rubric. No external AI provider is configured yet.</p>{!session ? <div className="mt-6 grid gap-4 sm:grid-cols-3"><input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Target role" className="rounded-xl border border-white/10 bg-[#070b17] p-3 text-sm" /><select value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border border-white/10 bg-[#070b17] p-3 text-sm"><option value="mixed">Mixed</option><option value="technical">Technical</option><option value="hr">HR</option></select><button type="button" onClick={startMock} disabled={busy} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold">{busy ? "Starting..." : "Start mock interview"}</button></div> : session.status === "completed" ? <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5"><h3 className="font-semibold">Interview complete</h3><p className="mt-2 text-sm text-slate-300">Your answers were evaluated with the local rubric. Average score: {session.answers?.length ? Math.round(session.answers.reduce((sum, item) => sum + item.score, 0) / session.answers.length) : result?.score || 0}/100</p></div> : <form onSubmit={submitAnswer} className="mt-6"><p className="text-xs text-slate-500">Question {session.currentQuestion + 1} of {session.questions.length}</p><h3 className="mt-3 text-lg font-semibold leading-8">{session.questions[session.currentQuestion]}</h3><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows={7} placeholder="Type your answer..." className="mt-5 w-full rounded-xl border border-white/10 bg-[#070b17] p-4 text-sm" /><button disabled={busy || !answer.trim()} className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold">{busy ? "Evaluating..." : "Submit answer"}</button>{result && <div className="mt-5 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4"><p className="font-semibold">Score: {result.score}/100</p><p className="mt-2 text-sm text-slate-300">{result.feedback}</p><p className="mt-2 text-xs text-slate-500">Evaluation provider: {result.provider}</p></div>}</form>}</section> : <section className="mt-6 rounded-3xl border border-white/[0.08] bg-[#0b1020] p-6"><h2 className="text-xl font-bold">Peer-to-peer video interview</h2><p className="mt-2 text-sm text-slate-400">Rooms use authenticated REST signaling and browser WebRTC. STUN/TURN configuration is required for difficult networks.</p>{!session ? <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={createRoom} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold">Create room</button><input value={roomCode} onChange={(event) => setRoomCode(event.target.value.toUpperCase())} placeholder="Room code" className="rounded-xl border border-white/10 bg-[#070b17] p-3 text-sm" /><button type="button" onClick={joinRoom} disabled={!roomCode} className="rounded-xl border border-violet-400/30 px-5 py-3 text-sm text-violet-200">Join room</button></div> : <div className="mt-6"><p className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">Room code: {session.roomCode || roomCode}. Share this code with your peer.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><video ref={localVideo} autoPlay muted playsInline className="min-h-48 rounded-2xl bg-black" /><video ref={remoteVideo} autoPlay playsInline className="min-h-48 rounded-2xl bg-black" /></div><p className="mt-4 text-sm text-slate-500">Camera and signaling controls are connected in the next WebRTC integration step; no recording is enabled.</p></div>}</section>}</main></div>;
}

export default Interview;
