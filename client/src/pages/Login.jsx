import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-black shadow-lg shadow-blue-950/40">
            P
          </div>
          <div>
            <p className="text-base font-bold tracking-tight">
              Placement <span className="text-blue-400">Pilot AI</span>
            </p>
            <p className="mt-0.5 text-[11px] tracking-wide text-slate-400">
              YOUR PLACEMENT ASSISTANT
            </p>
          </div>
        </Link>

        <Link
          to="/register"
          className="rounded-xl border border-slate-700/80 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-blue-500/60 hover:text-white"
        >
          Create account <span className="ml-1 text-blue-400">→</span>
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-14 pt-6 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:pb-20 lg:pt-10">
        <div className="hidden lg:block">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.07] px-4 py-2 text-sm text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Welcome back to your journey
          </div>

          <h1 className="max-w-xl text-5xl font-bold leading-[1.15] tracking-tight xl:text-6xl">
            Your goals.
            <br />
            Your growth.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Your next chapter.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">
            Pick up where you left off. Keep learning, sharpen your interview
            skills and move one step closer to your dream role.
          </p>

          <div className="mt-10 space-y-4">
            {[
              {
                number: "01",
                title: "Your preparation, organized",
                description: "Keep your skills and career goals in one place.",
              },
              {
                number: "02",
                title: "A roadmap built around you",
                description: "Focus on the skills your target role requires.",
              },
              {
                number: "03",
                title: "Progress you can track",
                description: "Practice regularly and learn from every attempt.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-blue-400/20 hover:bg-white/[0.04]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-300">
                  {item.number}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-slate-500">
            Every step forward counts.
          </p>
        </div>

        <div className="mx-auto w-full max-w-lg">
          <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">
            <div className="mb-8">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-xl text-blue-300">
                ✦
              </div>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Sign in to continue your placement preparation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-slate-500 hover:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-slate-500 hover:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-sm font-semibold shadow-lg shadow-blue-950/30 transition duration-200 hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-900/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in to your account"}
                {!loading && (
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>

              <p className="pt-1 text-center text-sm text-slate-400">
                New to Placement Pilot AI?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-400 transition hover:text-blue-300"
                >
                  Create an account
                </Link>
              </p>
            </form>
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            Your placement journey continues here.
          </p>

          <Link
            to="/"
            className="mt-5 block text-center text-sm text-slate-500 transition hover:text-slate-300"
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Login;