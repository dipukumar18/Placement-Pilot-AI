import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

const inputClass =
  "w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-slate-500 hover:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the platform terms to continue.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
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
          to="/login"
          className="rounded-xl border border-slate-700/80 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-blue-500/60 hover:text-white"
        >
          Sign in <span className="ml-1 text-blue-400">→</span>
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-14 pt-6 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:pb-20 lg:pt-10">
        <div className="hidden lg:block">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.07] px-4 py-2 text-sm text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Your career journey starts here
          </div>

          <h1 className="max-w-xl text-5xl font-bold leading-[1.15] tracking-tight xl:text-6xl">
            Your next big
            <br />
            opportunity
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              starts with you.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">
            Build your skills, improve your resume, practice interviews and
            prepare for your dream role — all in one place.
          </p>

          <div className="mt-10 space-y-4">
            {[
              {
                number: "01",
                title: "Understand your strengths",
                description: "Track your skills and identify areas to improve.",
              },
              {
                number: "02",
                title: "Prepare with a purpose",
                description: "Follow a roadmap tailored to your target role.",
              },
              {
                number: "03",
                title: "Practice with confidence",
                description: "Build interview skills and monitor your progress.",
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
            Learn at your pace. Improve every day.
          </p>
        </div>

        <div className="mx-auto w-full max-w-lg">
          <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">
            <div className="mb-8">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-xl text-blue-300">
                ✦
              </div>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Join Placement Pilot AI and start preparing for your future.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

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
                  className={inputClass}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
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
                    autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength={6}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-blue-500"
                />
                <span className="text-xs leading-5 text-slate-400">
                  I agree to the platform terms and understand that my account
                  starts with the free plan.
                </span>
              </label>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                >
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-sm font-semibold shadow-lg shadow-blue-950/30 transition duration-200 hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-900/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create your account"}
                {!loading && (
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>

              <p className="text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-400 transition hover:text-blue-300"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            By continuing, you agree to use the platform responsibly.
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

export default Register;