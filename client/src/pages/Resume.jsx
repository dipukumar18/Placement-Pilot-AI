
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

const cardClass =
  "rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5 sm:p-7";

function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function Resume() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const uploadSectionRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadResume() {
      try {
        const [result, historyResult] = await Promise.all([
          apiRequest("/resume"),
          apiRequest("/resume/history"),
        ]);
        if (active) {
          setResume(result.data);
          setHistory(historyResult.data.resumes || []);
        }
      } catch (err) {
        const message = err.message?.toLowerCase() || "";

        if (
          message.includes("token") ||
          message.includes("unauthorized")
        ) {
          navigate("/login", { replace: true });
          return;
        }

        // A 404 means the student has not uploaded a resume yet.
        if (active && !message.includes("no resume found")) {
          setError(err.message || "Unable to check your saved resume.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadResume();

    return () => {
      active = false;
    };
  }, [navigate]);

  function chooseFile(event) {
    const file = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setSelectedFile(null);
      setError("Please select a PDF resume.");
      event.target.value = "";
      return;
    }

    if (file.size === 0) {
      setSelectedFile(null);
      setError("The selected file is empty. Please choose another PDF.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  async function uploadResume(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please choose a PDF resume first.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);

      const result = await apiRequest("/resume/upload", {
        method: "POST",
        body: formData,
      });

      setResume(result.data);
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess(
        result.message ||
          "Resume uploaded and analyzed successfully."
      );
    } catch (err) {
      setError(err.message || "Resume upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#050816]/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-black">
              P
            </div>
            <div>
              <p className="text-sm font-bold">
                Placement <span className="text-blue-400">Pilot AI</span>
              </p>
              <p className="mt-1 text-[9px] tracking-[0.16em] text-slate-500">
                YOUR PLACEMENT ASSISTANT
              </p>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.05]"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#101b38] via-[#11132c] to-[#15102c] p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[90px]" />

          <div className="relative">
            <span className="inline-flex rounded-full border border-blue-400/15 bg-blue-400/[0.07] px-3 py-1.5 text-xs text-blue-300">
              RESUME WORKSPACE
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Resume Analysis
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Upload your PDF resume to extract your skills, review your
              experience, and identify areas to improve for your target role.
            </p>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-300"
          >
            <p className="font-semibold">Something needs your attention</p>
            <p className="mt-1 break-words">{error}</p>
          </div>
        )}

        {success && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200"
          >
            <p className="font-bold text-emerald-300">
              ✓ Resume processed successfully
            </p>
            <p className="mt-1">{success}</p>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className={cardClass}>
            <div ref={uploadSectionRef} className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Upload Your Resume</h2>{resume && <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-200">Upload a new version anytime</span>}</div>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Choose a readable PDF file. Your backend extracts its text and
              runs the existing resume and skill-gap analysis services.
            </p>

            <form onSubmit={uploadResume} className="mt-6">
              <label
                htmlFor="resume-file"
                className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-blue-400/30 bg-blue-500/[0.04] px-5 py-7 text-center transition hover:border-blue-400/60 hover:bg-blue-500/[0.08]"
              >
                <span className="text-3xl" aria-hidden="true">↑</span>
                <span className="mt-3 font-semibold">
                  Choose a PDF resume
                </span>
                <span className="mt-2 text-xs text-slate-400">
                  PDF format only
                </span>

                <input
                  ref={fileInputRef}
                  id="resume-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={chooseFile}
                  disabled={uploading}
                  className="sr-only"
                />
              </label>

              {selectedFile && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <span className="text-xl" aria-hidden="true">📄</span>
                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm font-semibold">
                      {selectedFile.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="text-sm text-slate-400 hover:text-white disabled:opacity-50"
                    aria-label="Remove selected file"
                  >
                    ✕
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedFile || uploading}
                className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold shadow-lg shadow-blue-950/30 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "Uploading and Analyzing..."
                  : "Upload & Analyze Resume →"}
              </button>
            </form>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Only upload your own resume or a document you have permission
              to share. Avoid including unnecessary sensitive information.
            </p>
          </section>

          <section className={cardClass}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Resume Overview</h2>
              {resume && (
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300">
                  {resume.analysisStatus || "Uploaded"}
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-400/20 border-t-blue-400" />
                <p className="mt-4 text-sm text-slate-400">
                  Checking your saved resume...
                </p>
              </div>
            ) : resume ? (
              <div className="mt-5 space-y-5">
                <div className="rounded-xl border border-white/[0.07] bg-black/10 p-4">
                  <p className="text-xs text-slate-400">Uploaded file</p>
                  <p className="mt-2 break-all text-sm font-semibold">
                    {resume.originalFileName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatFileSize(resume.fileSize)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/[0.07] p-4">
                    <p className="text-xs text-slate-400">Extracted text</p>
                    <p className="mt-2 text-lg font-bold">
                      {Number(resume.extractedTextLength || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">characters</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] p-4">
                    <p className="text-xs text-slate-400">Detected skills</p>
                    <p className="mt-2 text-lg font-bold text-blue-300">
                      {resume.analysis?.skills?.length || 0}
                    </p>
                    <p className="text-xs text-slate-500">skills found</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold">Resume Summary</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {resume.analysis?.summary ||
                      "No summary was returned by the resume analyzer."}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold">Detected Skills</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {resume.analysis?.skills?.length ? (
                      resume.analysis.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-3 py-2 text-xs text-blue-200"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        No skills were detected. Check that your PDF contains
                        selectable text.
                      </p>
                    )}
                  </div>
                </div>

                {resume.skillGap && (
                  <div className="rounded-xl border border-white/[0.07] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold">
                        Target Role Skill Match
                      </h3>
                      <span className="text-lg font-bold text-emerald-300">
                        {resume.skillGap.matchPercentage ?? 0}%
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      {resume.targetRole
                        ? `Target role: ${resume.targetRole}`
                        : "Set a target role in your profile for a more relevant skill-gap analysis."}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/profile"
                    className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.04]"
                  >
                    Check Target Role
                  </Link>
                  <Link
                    to="/roadmap"
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold"
                  >
                    Open Roadmap →
                  </Link>
                  <button type="button" onClick={() => uploadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })} className="rounded-xl border border-blue-400/20 px-4 py-3 text-sm font-semibold text-blue-200 hover:bg-blue-500/10">Upload New Resume</button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-2xl">
                  📄
                </div>
                <h3 className="mt-5 font-semibold">No resume uploaded yet</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  Upload a PDF to see your extracted skills, summary, and
                  target-role skill match here.
                </p>
              </div>
            )}
          </section>
        </div>

        {resume?.skillGap && (
          <section className={`mt-6 ${cardClass}`}>
            <h2 className="text-xl font-bold">Skill Gap Analysis</h2>
            <p className="mt-2 text-sm text-slate-400">
              Compare the skills found in your resume with the requirements
              identified for your target role.
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.07] p-4">
                <p className="text-xs text-slate-400">Required Skills</p>
                <p className="mt-2 text-2xl font-bold">
                  {resume.skillGap.totalRequiredSkills ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-400/15 bg-emerald-500/[0.04] p-4">
                <p className="text-xs text-slate-400">Matched</p>
                <p className="mt-2 text-2xl font-bold text-emerald-300">
                  {resume.skillGap.totalMatchedSkills ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-amber-400/15 bg-amber-500/[0.04] p-4">
                <p className="text-xs text-slate-400">Missing</p>
                <p className="mt-2 text-2xl font-bold text-amber-300">
                  {resume.skillGap.totalMissingSkills ?? 0}
                </p>
              </div>
            </div>

            {resume.skillGap.missingSkills?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold">Recommended Focus Areas</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resume.skillGap.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-amber-400/20 bg-amber-500/[0.07] px-3 py-2 text-xs text-amber-200"
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {history.length > 1 && (
          <section className={`mt-6 ${cardClass}`}>
            <h2 className="text-xl font-bold">Resume history</h2>
            <p className="mt-2 text-sm text-slate-400">Each uploaded version is analyzed separately. The latest version powers the current overview.</p>
            <div className="mt-5 space-y-3">{history.map((item) => <div key={`${item._id || item.originalFileName}-${item.createdAt}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] p-4"><div><p className="text-sm font-semibold">{item.originalFileName}</p><p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()} · {formatFileSize(item.fileSize)}</p></div><span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300">{item.analysisStatus}</span></div>)}</div>
          </section>
        )}

        <footer className="mt-10 border-t border-white/[0.07] py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Placement Pilot AI · Your Placement Assistant
        </footer>
      </main>
    </div>
  );
}

export default Resume;
