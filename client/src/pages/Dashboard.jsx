
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { apiRequest } from "../services/api";

const navigation = [
  { icon: "⌂", label: "Dashboard", href: "/dashboard", active: true },
  { icon: "◎", label: "My Profile", href: "/profile" },
  { icon: "✧", label: "Skill Analysis", href: "/skills" },
  { icon: "▥", label: "Resume Analysis", href: "/resume" },
  { icon: "▤", label: "My Roadmap", href: "/roadmap" },
  { icon: "◉", label: "Interview Practice", href: "/interview" },
  { icon: "✦", label: "Mock Interview", href: "/mock-interview" },
  { icon: "◌", label: "Peer Interview", href: "/peer-interview" },
  { icon: "▣", label: "Technical / Aptitude / Coding", href: "/practice" },
  { icon: "文", label: "Communication / English", href: "/practice" },
  { icon: "⚙", label: "Admin Panel", href: "/admin", adminOnly: true },
];

const quickActions = [
  {
    icon: "✧",
    title: "Analyze my skills",
    description: "Find strengths and skill gaps",
    color: "blue",
    href: "/skills",
  },
  {
    icon: "▤",
    title: "View my roadmap",
    description: "Plan your next learning steps",
    color: "violet",
    href: "/roadmap",
  },
  {
    icon: "◉",
    title: "Practice interviews",
    description: "Prepare for technical and HR rounds",
    color: "emerald",
    href: "/practice",
  },
];

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  const storedUser = (() => {
    try {
      const value = localStorage.getItem("user");
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  })();

  const studentName = storedUser?.fullName?.trim() || "Student";
  const firstName = studentName.split(" ")[0];
  const readinessScore = Number(dashboardData?.readinessScore);
  const hasReadinessScore = Number.isFinite(readinessScore);
  const skills = Array.isArray(storedUser?.skills) ? storedUser.skills : [];
  const profileCompleted = Boolean(storedUser?.profileCompleted);

  useEffect(() => {
    apiRequest("/dashboard")
      .then((response) => setDashboardData(response.data))
      .catch(() => setDashboardData(null));
  }, []);

  function handleLogout() {
    logoutUser();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/[0.07] bg-[#080c1a] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[84px] items-center justify-between border-b border-white/[0.07] px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-black shadow-lg shadow-blue-950/40">
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

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg px-2 py-1 text-slate-400 hover:bg-white/5 lg:hidden"
          >
            ✕
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.2em] text-slate-600">
            WORKSPACE
          </p>

          <nav className="space-y-1">
            {navigation.filter((item) => !item.adminOnly || storedUser?.role === "admin").map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition ${
                  item.active
                    ? "border border-blue-400/15 bg-blue-500/10 font-semibold text-blue-300"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <span className="w-5 text-center text-lg">{item.icon}</span>
                {item.label}
                {item.active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-500/10 to-violet-500/[0.06] p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-lg text-blue-300">
              ✦
            </div>
            <p className="mt-3 text-sm font-semibold">Small steps, big goals.</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Keep learning and build confidence with consistent practice.
            </p>
            <Link
              to="/practice"
              className="mt-4 block rounded-lg bg-blue-600 px-3 py-2.5 text-center text-xs font-semibold transition hover:bg-blue-500"
            >
              Start practicing →
            </Link>
          </div>

          <Link
            to="/"
            className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
          >
            <span className="text-lg">↗</span>
            Back to home
          </Link>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex h-[84px] items-center justify-between border-b border-white/[0.07] bg-[#050816]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-lg text-slate-300 lg:hidden"
            >
              ☰
            </button>
            <div>
              <p className="text-sm font-semibold">Student Dashboard</p>
              <p className="mt-1 text-xs text-slate-500">
                Your placement preparation workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-blue-400/15 bg-blue-400/[0.07] px-3 py-1.5 text-xs text-blue-300 sm:inline-flex">
              Free plan
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-sm font-bold text-blue-200">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#101b38] via-[#11132c] to-[#15102c] p-6 sm:p-9 lg:p-10">
            <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-[90px]" />
            <div className="pointer-events-none absolute bottom-[-100px] right-1/3 h-52 w-52 rounded-full bg-violet-500/10 blur-[80px]" />

            <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-400/[0.07] px-3 py-1.5 text-xs text-blue-300">
                  <span>✦</span>
                  YOUR NEXT CHAPTER STARTS HERE
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                  Welcome back, {firstName}!
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                  Every great career starts with preparation. Review your
                  progress, strengthen your skills and take your next step
                  towards placement readiness.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/practice"
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500"
                  >
                    Start practicing →
                  </Link>
                  <Link
                    to="/profile"
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.07]"
                  >
                    Complete profile
                  </Link>
                  {storedUser?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="rounded-xl border border-violet-400/25 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20"
                    >
                      Admin Panel →
                    </Link>
                  )}
                </div>
              </div>

              <div className="relative flex min-w-[190px] items-center gap-4 rounded-2xl border border-white/10 bg-black/15 p-5 md:min-w-[210px] md:flex-col md:items-start">
                <div>
                  <p className="text-xs text-slate-400">Placement readiness</p>
                  <p className="mt-2 text-4xl font-bold">
                    {hasReadinessScore ? readinessScore : "—"}
                    <span className="text-lg text-slate-500">/100</span>
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-400/40 bg-blue-400/10 text-xl text-blue-300 md:absolute md:right-4 md:top-4">
                  ✦
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
                    style={{
                      width: `${hasReadinessScore ? Math.min(100, Math.max(0, readinessScore)) : 0}%`,
                    }}
                  />
                </div>
                <p className="text-xs leading-5 text-slate-400">
                  {!hasReadinessScore
                    ? "Complete an evaluated practice or mock interview to calculate your score."
                    : "Keep practicing to strengthen your readiness."}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Profile status</span>
                <span className="text-lg text-blue-300">◎</span>
              </div>
              <p className="mt-4 text-2xl font-bold">
                {profileCompleted ? "Completed" : "In progress"}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {profileCompleted
                  ? "Your profile is marked complete"
                  : "Add your details to personalize your plan"}
              </p>
              <Link
                to="/profile"
                className="mt-4 inline-flex text-xs font-semibold text-blue-300 hover:text-blue-200"
              >
                {profileCompleted ? "View profile" : "Complete profile"} →
              </Link>
            </article>

            <article className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Skills added</span>
                <span className="text-lg text-violet-300">✧</span>
              </div>
              <p className="mt-4 text-2xl font-bold">{skills.length}</p>
              <p className="mt-2 text-xs text-slate-500">
                {skills.length
                  ? "Skills saved to your account"
                  : "Your skills will appear here"}
              </p>
              <Link
                to="/skills"
                className="mt-4 inline-flex text-xs font-semibold text-blue-300 hover:text-blue-200"
              >
                Manage skills →
              </Link>
            </article>

            <article className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Learning roadmap</span>
                <span className="text-lg text-emerald-300">▤</span>
              </div>
              <p className="mt-4 text-2xl font-bold">Your next steps</p>
              <p className="mt-2 text-xs text-slate-500">
                Follow a plan tailored to your goals
              </p>
              <Link
                to="/roadmap"
                className="mt-4 inline-flex text-xs font-semibold text-blue-300 hover:text-blue-200"
              >
                View roadmap →
              </Link>
            </article>

            <article className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Interview practice</span>
                <span className="text-lg text-amber-300">◉</span>
              </div>
              <p className="mt-4 text-2xl font-bold">Keep improving</p>
              <p className="mt-2 text-xs text-slate-500">
                Build confidence with regular practice
              </p>
              <Link
                to="/practice"
                className="mt-4 inline-flex text-xs font-semibold text-blue-300 hover:text-blue-200"
              >
                Explore practice →
              </Link>
            </article>
          </section>

          <section className="mt-8 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
            <article className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">ANALYTICS</p>
                  <h2 className="mt-2 text-xl font-bold">Real performance</h2>
                </div>
                <Link to="/practice" className="text-xs font-semibold text-blue-300">Practice →</Link>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {[
                  ["Attempts", dashboardData?.analytics?.attempts?.total ?? "—"],
                  ["Evaluated", dashboardData?.analytics?.attempts?.evaluated ?? "—"],
                  ["Pending", dashboardData?.analytics?.attempts?.pending ?? "—"],
                  ["Avg score", dashboardData?.analytics?.attempts?.averageScore == null ? "—" : `${dashboardData.analytics.attempts.averageScore}/100`],
                ].map(([label, value]) => <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-lg font-bold text-slate-200">{value}</p></div>)}
              </div>
              <h3 className="mt-6 text-sm font-semibold">Category performance</h3>
              {dashboardData?.analytics?.categoryPerformance?.length ? <div className="mt-3 grid gap-2 sm:grid-cols-2">{dashboardData.analytics.categoryPerformance.map((item) => <div key={item.category} className="flex items-center justify-between rounded-xl border border-white/[0.07] p-3 text-sm"><span className="capitalize text-slate-300">{item.category}</span><span className="text-blue-300">{item.averageScore}/100</span></div>)}</div> : <p className="mt-3 text-sm text-slate-500">No evaluated practice data yet.</p>}
            </article>

            <article className="rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/10 to-blue-500/[0.06] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">PROGRESS REWARDS</p>
              <h2 className="mt-2 text-xl font-bold">Keep your streak</h2>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div><p className="text-2xl font-bold text-blue-200">{dashboardData?.gamification?.points ?? 0}</p><p className="mt-1 text-xs text-slate-400">Points</p></div>
                <div><p className="text-2xl font-bold text-amber-200">{dashboardData?.gamification?.streak ?? 0}</p><p className="mt-1 text-xs text-slate-400">Day streak</p></div>
                <div><p className="text-2xl font-bold text-emerald-200">{dashboardData?.gamification?.badges?.length ?? 0}</p><p className="mt-1 text-xs text-slate-400">Badges</p></div>
              </div>
              {dashboardData?.gamification?.badges?.length ? <div className="mt-5 flex flex-wrap gap-2">{dashboardData.gamification.badges.map((badge) => <span key={badge} className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs text-violet-200">{badge.replaceAll("_", " ")}</span>)}</div> : <p className="mt-5 text-sm text-slate-400">Complete an evaluated activity to unlock your first badge.</p>}
            </article>
          </section>

          <section className="mt-10">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  YOUR WORKSPACE
                </p>
                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  What would you like to work on?
                </h2>
              </div>
              <p className="text-xs text-slate-500">Choose your next step</p>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {quickActions.map((action) => {
                const colorClasses = {
                  blue: "bg-blue-500/10 text-blue-300 border-blue-400/15",
                  violet:
                    "bg-violet-500/10 text-violet-300 border-violet-400/15",
                  emerald:
                    "bg-emerald-500/10 text-emerald-300 border-emerald-400/15",
                };

                return (
                  <Link
                    key={action.title}
                    to={action.href}
                    className="group rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-[#0e1528] sm:p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border text-xl ${colorClasses[action.color]}`}
                      >
                        {action.icon}
                      </div>
                      <span className="text-lg text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-300">
                        →
                      </span>
                    </div>
                    <h3 className="mt-5 text-base font-semibold">
                      {action.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {action.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-white/[0.08] bg-[#0b1020] p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                  YOUR STARTING POINT
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  Build your preparation foundation
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Complete your profile, add your skills and choose a target
                  role to make your preparation more relevant.
                </p>
              </div>
              <Link
                to="/profile"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold transition hover:border-blue-400/30 hover:bg-white/[0.04]"
              >
                Set up profile →
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Complete your profile",
                  description: "Add education and career goals.",
                },
                {
                  number: "02",
                  title: "Add your skills",
                  description: "Tell us what you already know.",
                },
                {
                  number: "03",
                  title: "Start practicing",
                  description: "Build confidence with questions.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-bold text-blue-300">
                    {item.number}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-10 flex flex-col gap-2 border-t border-white/[0.07] py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Placement Pilot AI</p>
            <p>Your Placement Assistant · Keep learning, keep growing.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
