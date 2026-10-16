import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    title: "AI Mock Interviews",
    description:
      "Practice technical, HR and mixed interviews to build confidence before the real thing.",
    tag: "INTERVIEW PRACTICE",
  },
  {
    number: "02",
    title: "Skill Gap Analysis",
    description:
      "Discover the skills you already know and the topics you should focus on next.",
    tag: "SMART ANALYSIS",
  },
  {
    number: "03",
    title: "Personalized Roadmap",
    description:
      "Get a structured preparation plan that aligns with your target role and learning goals.",
    tag: "YOUR LEARNING PLAN",
  },
  {
    number: "04",
    title: "Placement Readiness",
    description:
      "Understand your preparation progress with a readiness score based on available results.",
    tag: "READINESS TRACKING",
  },
  {
    number: "05",
    title: "Progress Analytics",
    description:
      "Review practice history, evaluate your performance and identify areas to improve.",
    tag: "YOUR PROGRESS",
  },
  {
    number: "06",
    title: "Practice & Improve",
    description:
      "Strengthen your concepts through focused questions, consistent practice and feedback.",
    tag: "DAILY IMPROVEMENT",
  },
];

const steps = [
  {
    number: "01",
    title: "Build your profile",
    description:
      "Add your education, skills and the role you want to prepare for.",
  },
  {
    number: "02",
    title: "Find your gaps",
    description:
      "Understand your strengths and identify areas that need more practice.",
  },
  {
    number: "03",
    title: "Practice with purpose",
    description:
      "Work through questions, interview practice and your learning roadmap.",
  },
  {
    number: "04",
    title: "Track your growth",
    description:
      "Review your progress and keep improving one step at a time.",
  },
];

function Brand({ footer = false }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-black text-white shadow-lg shadow-blue-950/40">
        P
      </div>
      <div>
        <p className="text-base font-bold tracking-tight text-white">
          Placement <span className="text-blue-400">Pilot AI</span>
        </p>
        <p
          className={`mt-0.5 text-[10px] tracking-[0.14em] ${
            footer ? "text-slate-500" : "text-slate-400"
          }`}
        >
          YOUR PLACEMENT ASSISTANT
        </p>
      </div>
    </Link>
  );
}

function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Navbar */}
      <header className="relative z-20 border-b border-white/[0.07] bg-[#050816]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
          <Brand />

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              How it works
            </a>
            <Link
              to="/login"
              className="text-sm font-medium text-slate-200 transition hover:text-blue-400"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500"
            >
              Get started <span className="ml-1">→</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-300"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold"
            >
              Join free
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute -left-48 top-16 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="pointer-events-none absolute -right-40 top-24 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[130px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-20 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-12 lg:pb-28 lg:pt-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.07] px-4 py-2 text-xs font-medium text-blue-300 sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Your career journey starts here
            </div>

            <h1 className="mt-7 max-w-3xl text-4xl font-bold leading-[1.13] tracking-tight sm:text-5xl md:text-6xl xl:text-[68px]">
              Prepare smarter.
              <br />
              Build confidence.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Get placement ready.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Turn your placement preparation into a clear plan. Understand
              your skill gaps, practice interviews and track your progress
              with Placement Pilot AI.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-sm font-semibold shadow-xl shadow-blue-950/30 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500"
              >
                Start preparing free <span>→</span>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-slate-200 transition hover:border-blue-400/30 hover:bg-white/[0.06]"
              >
                Student sign in
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-500 sm:text-sm">
              <span className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                Personalized learning
              </span>
              <span className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                Practice at your pace
              </span>
            </div>
          </div>

          {/* Product preview: illustrative, not live student data */}
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="pointer-events-none absolute -inset-5 rounded-[36px] bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10 blur-2xl" />

            <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-5">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-2 pb-4">
                <div>
                  <p className="text-sm font-semibold">Your preparation space</p>
                  <p className="mt-1 text-xs text-slate-500">
                    A preview of your learning journey
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="rounded-2xl border border-blue-400/15 bg-blue-500/[0.07] p-4 sm:p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-lg text-blue-300">
                    ✦
                  </div>
                  <p className="mt-4 text-xs text-slate-400">
                    Skill analysis
                  </p>
                  <p className="mt-1 text-base font-semibold sm:text-lg">
                    Know your gaps
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Discover what to learn next
                  </p>
                </div>

                <div className="rounded-2xl border border-violet-400/15 bg-violet-500/[0.07] p-4 sm:p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-lg text-violet-300">
                    ↗
                  </div>
                  <p className="mt-4 text-xs text-slate-400">
                    Learning roadmap
                  </p>
                  <p className="mt-1 text-base font-semibold sm:text-lg">
                    Plan your growth
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Follow your next steps
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-white/[0.08] bg-[#080d1c] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Your weekly focus</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Example preparation plan
                    </p>
                  </div>
                  <span className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1.5 text-[10px] font-medium text-emerald-300">
                    KEEP LEARNING
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {[
                    { title: "Technical practice", width: "w-4/5" },
                    { title: "Interview preparation", width: "w-3/5" },
                    { title: "Core concepts", width: "w-2/3" },
                  ].map((item) => (
                    <div key={item.title}>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-slate-300">{item.title}</span>
                        <span className="text-slate-500">Example</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 ${item.width}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="px-1 pt-3 text-center text-[10px] text-slate-500">
                Illustrative preview · Not live account statistics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-20 border-y border-white/[0.07] bg-slate-900/40"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
              Everything in one place
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              A smarter way to prepare
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
              Build strong fundamentals, prepare for interviews and make
              progress with a structured approach.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/25 hover:bg-white/[0.045] sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-lg text-blue-300 transition group-hover:border-blue-400/30 group-hover:bg-blue-500/15">
                    ✦
                  </div>
                  <span className="text-xs font-medium text-slate-600">
                    {feature.number}
                  </span>
                </div>

                <p className="mt-6 text-[10px] font-semibold tracking-[0.16em] text-blue-400">
                  {feature.tag}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
                A clear path forward
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                From preparation to progress
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-400">
              Start with where you are today. Focus on the next step and keep
              building your confidence.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
            {steps.map((step) => (
              <article
                key={step.number}
                className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"
              >
                <p className="text-sm font-bold tracking-widest text-blue-400">
                  STEP {step.number}
                </p>
                <div className="my-5 h-px bg-gradient-to-r from-blue-500/50 to-transparent" />
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-violet-600/20 px-6 py-14 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[90px]" />

          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Your future starts with a step
            </p>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to take charge of your placement journey?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Create your account, define your goals and start building the
              skills you need for your next opportunity.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-4 text-sm font-semibold shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500"
            >
              Create your free account <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.07] bg-[#030611]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <Brand footer />
          <p className="text-xs leading-6 text-slate-500">
            © {new Date().getFullYear()} Placement Pilot AI. Your Placement
            Assistant.
          </p>
          <div className="flex gap-5 text-sm text-slate-400">
            <Link to="/login" className="transition hover:text-white">
              Sign in
            </Link>
            <Link to="/register" className="transition hover:text-white">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Home;