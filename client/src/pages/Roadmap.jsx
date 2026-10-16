
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

const statusLabels = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
};

const statusStyles = {
  not_started: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  in_progress: "border-blue-400/30 bg-blue-500/10 text-blue-300",
  completed: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
};

function Roadmap() {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expanded, setExpanded] = useState({});

  const loadRoadmap = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await apiRequest("/roadmap");
      setRoadmap(result.data);
    } catch (err) {
      setError(err.message || "Unable to load your roadmap.");
      const message = err.message?.toLowerCase() || "";

      if (message.includes("token") || message.includes("unauthorized")) {
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadRoadmap();
  }, [loadRoadmap]);

  async function updateItem(item, nextProgress) {
    if (!item?._id || updatingId) return;

    const progress = Math.max(0, Math.min(100, Number(nextProgress)));

    const status =
      progress === 100
        ? "completed"
        : progress > 0
          ? "in_progress"
          : "not_started";

    setUpdatingId(item._id);
    setError("");
    setSuccess("");

    try {
      const result = await apiRequest(`/roadmap/items/${item._id}`, {
        method: "PATCH",
        body: JSON.stringify({ progress, status }),
      });

      setRoadmap(result.data);
      setSuccess("Your learning progress has been saved.");
    } catch (err) {
      setError(err.message || "Unable to save progress.");
    } finally {
      setUpdatingId("");
    }
  }

  function toggleExpanded(id) {
    setExpanded((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  }

  const items = roadmap?.roadmap || [];
  const overallProgress = Number(roadmap?.overallProgress || 0);

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
              PERSONALIZED LEARNING PLAN
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              My Learning Roadmap
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Follow your learning plan, practice important skills, and track
              your progress toward your target job role.
            </p>

            {roadmap && (
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs text-slate-400">Target Role</p>
                  <p className="mt-2 font-semibold">
                    {roadmap.targetRole || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs text-slate-400">Resume Skill Match</p>
                  <p className="mt-2 text-2xl font-bold text-blue-300">
                    {roadmap.matchPercentage ?? 0}%
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs text-slate-400">Overall Progress</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-300">
                    {overallProgress}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-300"
          >
            <p className="font-semibold">Unable to complete the request</p>
            <p className="mt-1">{error}</p>
            <button
              type="button"
              onClick={loadRoadmap}
              className="mt-3 rounded-lg border border-red-300/20 px-3 py-2 text-xs hover:bg-red-500/10"
            >
              Try Again
            </button>
          </div>
        )}

        {success && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200"
          >
            ✓ {success}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0b1020] p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-400/20 border-t-blue-400" />
            <p className="mt-4 text-sm text-slate-400">
              Preparing your roadmap...
            </p>
          </div>
        ) : !roadmap ? (
          <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0b1020] p-7 sm:p-10">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-2xl">
                ✦
              </div>
              <h2 className="mt-5 text-xl font-bold">
                Your roadmap is not available yet
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Set your target job role and upload a resume with its analysis
                before generating your personalized learning plan.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/profile"
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.05]"
                >
                  Check Profile
                </Link>
                <Link
                  to="/resume"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold"
                >
                  Go to Resume
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Your Preparation Progress</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {items.filter((item) => item.status === "completed").length}
                    {" "}of {items.length} learning areas completed
                  </p>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-300">
                  {statusLabels[roadmap.status] || roadmap.status}
                </span>
              </div>

              <div
                className="mt-5 h-3 overflow-hidden rounded-full bg-white/[0.07]"
                role="progressbar"
                aria-label="Overall roadmap progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={overallProgress}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <p className="mt-2 text-right text-xs text-slate-400">
                {overallProgress}% completed
              </p>
            </section>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5 sm:p-6">
                <h2 className="text-lg font-bold">Skills You Already Match</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Skills detected in your resume that match your target role.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {roadmap.matchedSkills?.length ? (
                    roadmap.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-emerald-400/20 bg-emerald-500/[0.07] px-3 py-2 text-xs text-emerald-200"
                      >
                        ✓ {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No matched skills were returned by the analysis.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5 sm:p-6">
                <h2 className="text-lg font-bold">Skills to Develop</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Focus areas identified by your skill-gap analysis.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {roadmap.missingSkills?.length ? (
                    roadmap.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-amber-400/20 bg-amber-500/[0.07] px-3 py-2 text-xs text-amber-200"
                      >
                        + {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No missing skills were returned by the analysis.
                    </p>
                  )}
                </div>
              </section>
            </div>

            <section className="mt-8">
              <div className="mb-5">
                <span className="text-xs font-semibold tracking-[0.15em] text-blue-300">
                  YOUR LEARNING PATH
                </span>
                <h2 className="mt-2 text-2xl font-bold">Roadmap Topics</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Expand a topic to review its learning tasks and update your
                  progress. Changes are saved to your account.
                </p>
              </div>

              {items.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-7 text-sm text-slate-400">
                  Your roadmap currently has no learning items.
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const isExpanded = Boolean(expanded[item._id]);
                    const progress = Number(item.progress || 0);

                    return (
                      <article
                        key={item._id || item.skill}
                        className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1020]"
                      >
                        <button
                          type="button"
                          onClick={() => toggleExpanded(item._id)}
                          aria-expanded={isExpanded}
                          className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-white/[0.02] sm:p-6"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-sm font-bold text-blue-300">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold">{item.skill}</h3>
                              <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${statusStyles[item.status] || statusStyles.not_started}`}
                              >
                                {statusLabels[item.status] || item.status}
                              </span>
                              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase text-slate-400">
                                {item.priority || "medium"} priority
                              </span>
                            </div>

                            {item.reason && (
                              <p className="mt-2 text-sm leading-6 text-slate-400">
                                {item.reason}
                              </p>
                            )}

                            <div className="mt-4 flex items-center gap-3">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                                <div
                                  className="h-full rounded-full bg-blue-400 transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-400">
                                {progress}%
                              </span>
                            </div>
                          </div>

                          <span className="mt-1 text-slate-400" aria-hidden="true">
                            {isExpanded ? "−" : "+"}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-white/[0.07] p-5 sm:p-6">
                            {item.learningTopics?.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-blue-200">
                                  Learning Topics
                                </h4>
                                <ul className="mt-3 space-y-2">
                                  {item.learningTopics.map((topic, topicIndex) => (
                                    <li
                                      key={`${item._id}-learning-${topicIndex}`}
                                      className="flex gap-2 text-sm leading-6 text-slate-300"
                                    >
                                      <span className="text-blue-400">•</span>
                                      <span>{topic}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {item.practiceTasks?.length > 0 && (
                              <div className="mt-6">
                                <h4 className="font-semibold text-blue-200">
                                  Practice Tasks
                                </h4>
                                <ul className="mt-3 space-y-2">
                                  {item.practiceTasks.map((task, taskIndex) => (
                                    <li
                                      key={`${item._id}-practice-${taskIndex}`}
                                      className="flex gap-2 text-sm leading-6 text-slate-300"
                                    >
                                      <span className="text-blue-400">•</span>
                                      <span>{task}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {item.projectTask && (
                              <div className="mt-6 rounded-xl border border-violet-400/15 bg-violet-500/[0.06] p-4">
                                <h4 className="text-sm font-semibold text-violet-200">
                                  Mini Project
                                </h4>
                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                  {item.projectTask}
                                </p>
                              </div>
                            )}

                            {item.interviewTopics?.length > 0 && (
                              <div className="mt-6">
                                <h4 className="font-semibold text-blue-200">
                                  Interview Topics
                                </h4>
                                <ul className="mt-3 space-y-2">
                                  {item.interviewTopics.map((topic, topicIndex) => (
                                    <li
                                      key={`${item._id}-interview-${topicIndex}`}
                                      className="flex gap-2 text-sm leading-6 text-slate-300"
                                    >
                                      <span className="text-blue-400">•</span>
                                      <span>{topic}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="mt-6 border-t border-white/[0.07] pt-5">
                              <label
                                htmlFor={`progress-${item._id}`}
                                className="flex items-center justify-between gap-3 text-sm font-semibold"
                              >
                                <span>Update your progress</span>
                                <span className="text-blue-300">{progress}%</span>
                              </label>

                              <input
                                id={`progress-${item._id}`}
                                type="range"
                                min="0"
                                max="100"
                                step="10"
                                value={progress}
                                disabled={Boolean(updatingId)}
                                onChange={(event) => {
                                  const value = Number(event.target.value);
                                  setRoadmap((previous) => ({
                                    ...previous,
                                    roadmap: previous.roadmap.map((entry) =>
                                      entry._id === item._id
                                        ? {
                                            ...entry,
                                            progress: value,
                                            status:
                                              value === 100
                                                ? "completed"
                                                : value > 0
                                                  ? "in_progress"
                                                  : "not_started",
                                          }
                                        : entry
                                    ),
                                  }));
                                }}
                                onPointerUp={(event) => {
                                  updateItem(item, Number(event.currentTarget.value));
                                }}
                                onKeyUp={(event) => {
                                  if (
                                    ["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                                      event.key
                                    )
                                  ) {
                                    updateItem(item, Number(event.currentTarget.value));
                                  }
                                }}
                                className="mt-4 w-full accent-blue-500 disabled:opacity-50"
                              />

                              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                                <span>0% — Not started</span>
                                <span>100% — Completed</span>
                              </div>

                              {updatingId === item._id && (
                                <p className="mt-3 text-xs text-blue-300">
                                  Saving your progress...
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        <footer className="mt-10 border-t border-white/[0.07] py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Placement Pilot AI · Your Placement Assistant
        </footer>
      </main>
    </div>
  );
}

export default Roadmap;
