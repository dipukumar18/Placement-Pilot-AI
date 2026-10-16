import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

const rtcConfig = { iceServers: [
  ...(import.meta.env.VITE_STUN_URL ? [{ urls: import.meta.env.VITE_STUN_URL }] : []),
  ...(import.meta.env.VITE_TURN_URL ? [{ urls: import.meta.env.VITE_TURN_URL, username: import.meta.env.VITE_TURN_USERNAME, credential: import.meta.env.VITE_TURN_CREDENTIAL }] : []),
] };

function PeerInterview() {
  const [roomCode, setRoomCode] = useState("");
  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");
  const [connectionState, setConnectionState] = useState("not_connected");
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const streamRef = useRef(null);
  const peerRef = useRef(null);
  const seenCandidates = useRef(new Set());

  const sendSignal = useCallback((payload) => apiRequest(`/interviews/peer/rooms/${room?.sessionId}/signal`, { method: "POST", body: JSON.stringify(payload) }), [room?.sessionId]);

  const preparePeer = async (isOwner) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = stream;
    if (localVideo.current) localVideo.current.srcObject = stream;
    const peer = new RTCPeerConnection(rtcConfig);
    peerRef.current = peer;
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    peer.ontrack = (event) => { if (remoteVideo.current) remoteVideo.current.srcObject = event.streams[0]; };
    peer.onconnectionstatechange = () => setConnectionState(peer.connectionState);
    peer.onicecandidate = (event) => { if (event.candidate) sendSignal({ candidate: event.candidate.toJSON() }).catch(() => {}); };
    if (isOwner) {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      await sendSignal({ offer });
    }
  };

  const createRoom = async () => {
    try { const response = await apiRequest("/interviews/peer/rooms", { method: "POST" }); setRoom({ ...response.data, owner: true }); setRoomCode(response.data.roomCode); await preparePeer(true); }
    catch (requestError) { setError(requestError.message || "Camera/microphone permission or room creation failed."); }
  };

  const joinRoom = async () => {
    try { const response = await apiRequest("/interviews/peer/rooms/join", { method: "POST", body: JSON.stringify({ roomCode }) }); setRoom({ ...response.data, owner: false }); await preparePeer(false); }
    catch (requestError) { setError(requestError.message || "Unable to join peer room."); }
  };

  useEffect(() => {
    if (!room) return undefined;
    let active = true;
    const poll = async () => {
      if (!active || !peerRef.current) return;
      try {
        const response = await apiRequest(`/interviews/peer/rooms/${room.sessionId}/signal`);
        const signal = response.data;
        const peer = peerRef.current;
        if (!room.owner && signal.offer && !peer.currentRemoteDescription) {
          await peer.setRemoteDescription(signal.offer);
          const answer = await peer.createAnswer(); await peer.setLocalDescription(answer); await sendSignal({ answer });
        }
        if (room.owner && signal.answer && !peer.currentRemoteDescription) await peer.setRemoteDescription(signal.answer);
        for (const candidate of signal.candidates || []) {
          const key = JSON.stringify(candidate);
          if (!seenCandidates.current.has(key) && peer.remoteDescription) { seenCandidates.current.add(key); await peer.addIceCandidate(candidate); }
        }
      } catch (pollError) { if (active) setError(pollError.message); }
    };
    const timer = window.setInterval(poll, 1500); poll();
    return () => { active = false; window.clearInterval(timer); };
  }, [room, sendSignal]);

  const leaveRoom = async () => {
    if (room) await apiRequest(`/interviews/peer/rooms/${room.sessionId}/leave`, { method: "POST" }).catch(() => {});
    streamRef.current?.getTracks().forEach((track) => track.stop()); peerRef.current?.close();
    peerRef.current = null; streamRef.current = null; setRoom(null); setConnectionState("closed");
  };

  const toggleTrack = (kind) => {
    const track = streamRef.current?.getTracks().find((item) => item.kind === kind);
    if (!track) return;
    track.enabled = !track.enabled;
    if (kind === "audio") setMicEnabled(track.enabled); else setCameraEnabled(track.enabled);
  };

  useEffect(() => () => { streamRef.current?.getTracks().forEach((track) => track.stop()); peerRef.current?.close(); }, []);

  return <div className="min-h-screen bg-[#050816] text-white"><header className="border-b border-white/[0.07] bg-[#080c1a] px-5 py-6 sm:px-8"><div className="mx-auto max-w-5xl"><Link to="/dashboard" className="text-sm text-blue-300">← Dashboard</Link><h1 className="mt-3 text-3xl font-bold">Peer-to-peer interview</h1><p className="mt-2 text-sm text-slate-400">Create a private room or join a room using a secure code.</p></div></header><main className="mx-auto max-w-5xl px-5 py-8 sm:px-8"><section className="rounded-3xl border border-white/[0.08] bg-[#0b1020] p-6"><h2 className="text-xl font-bold">Video interview room</h2>{error && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}{!room ? <div className="mt-6 grid gap-5 md:grid-cols-2"><div className="rounded-2xl border border-violet-400/20 bg-violet-500/[0.05] p-5"><h3 className="font-semibold">Create new room</h3><p className="mt-2 text-sm text-slate-400">Create a code and share it with one authenticated peer.</p><button type="button" onClick={createRoom} className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold">Create room</button></div><div className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.05] p-5"><h3 className="font-semibold">Join existing room</h3><p className="mt-2 text-sm text-slate-400">Enter the room code shared by the room owner.</p><div className="mt-5 flex gap-2"><input value={roomCode} onChange={(event) => setRoomCode(event.target.value.toUpperCase().replace(/[^A-F0-9]/g, "").slice(0, 8))} placeholder="8-character code" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#070b17] p-3 text-sm" /><button type="button" onClick={joinRoom} disabled={roomCode.length < 4} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold disabled:opacity-50">Join</button></div></div></div> : <div className="mt-6"><div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200"><span>Room: <b>{room.roomCode || roomCode}</b></span><span>Connection: <b>{connectionState}</b></span></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><video ref={localVideo} autoPlay muted playsInline className="min-h-56 w-full rounded-2xl bg-black" /><video ref={remoteVideo} autoPlay playsInline className="min-h-56 w-full rounded-2xl bg-black" /></div><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => toggleTrack("audio")} className="rounded-xl border border-white/10 px-4 py-2 text-sm">{micEnabled ? "Mute microphone" : "Unmute microphone"}</button><button type="button" onClick={() => toggleTrack("video")} className="rounded-xl border border-white/10 px-4 py-2 text-sm">{cameraEnabled ? "Turn camera off" : "Turn camera on"}</button><button type="button" onClick={leaveRoom} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold">Leave room</button></div></div>}</section></main></div>;
}

export default PeerInterview;
