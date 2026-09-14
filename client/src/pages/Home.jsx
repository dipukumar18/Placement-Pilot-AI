import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link to="/" className="text-2xl font-bold">
            Placement <span className="text-blue-400">Pilot AI</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-slate-300 hover:text-white">
              Features
            </a>

            <a href="#how-it-works" className="text-sm text-slate-300 hover:text-white">
              How It Works
            </a>

            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500"
            >
              Get Started
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="mx-auto max-w-4xl text-center">

            <div className="mb-6 inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
              AI-Powered Placement Preparation
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Prepare Smarter.
              <br />
              <span className="text-blue-400">Get Placement Ready.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Placement Pilot AI helps students prepare for placements through
              AI mock interviews, skill-gap analysis, personalized learning
              recommendations and progress tracking.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold transition hover:bg-blue-500"
              >
                Start Preparing Free
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 font-semibold transition hover:bg-white/10"
              >
                Student Login
              </Link>

            </div>

          </div>

          {/* Dashboard Preview */}
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl">
              <div className="rounded-xl bg-slate-900 p-6">

                <div className="grid gap-5 md:grid-cols-3">

                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">
                      Placement Readiness
                    </p>

                    <p className="mt-3 text-4xl font-bold text-blue-400">
                      78
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Placement Ready
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">
                      AI Interviews
                    </p>

                    <p className="mt-3 text-4xl font-bold">
                      24
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Completed interviews
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">
                      Preparation Progress
                    </p>

                    <p className="mt-3 text-4xl font-bold text-emerald-400">
                      72%
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-700">
                      <div className="h-full w-[72%] rounded-full bg-emerald-400" />
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/10 bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Powerful Features
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Everything you need for placement preparation
            </h2>

            <p className="mt-4 text-slate-400">
              One platform to practice, analyze and improve your placement
              preparation.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            <FeatureCard
              title="AI Mock Interviews"
              description="Practice technical, HR and mixed placement interviews with an AI interviewer."
            />

            <FeatureCard
              title="Skill Gap Analysis"
              description="Identify your strong topics, weak topics and concepts that need improvement."
            />

            <FeatureCard
              title="Personalized Roadmap"
              description="Get personalized learning tasks and recommendations based on your performance."
            />

            <FeatureCard
              title="Readiness Score"
              description="Track your placement readiness with a dynamic score from 0 to 100."
            />

            <FeatureCard
              title="Progress Analytics"
              description="Monitor interview scores, skill progress, practice history and improvement."
            />

            <FeatureCard
              title="Peer Practice"
              description="Practice interviews with other students and improve your confidence."
            />

          </div>

        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Simple Process
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Your preparation journey
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-4">

            <StepCard
              number="01"
              title="Create Profile"
              description="Tell Placement Pilot AI about your education, skills and career goals."
            />

            <StepCard
              number="02"
              title="Practice"
              description="Take AI interviews and practice topics according to your skill level."
            />

            <StepCard
              number="03"
              title="Analyze"
              description="Understand your performance, mistakes, strong topics and weak areas."
            />

            <StepCard
              number="04"
              title="Improve"
              description="Follow your personalized recommendations and become placement ready."
            />

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-blue-600">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">

          <h2 className="text-3xl font-bold md:text-5xl">
            Ready to start your placement preparation?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-blue-100">
            Build your skills, practice interviews and track your journey with
            Placement Pilot AI.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Create Free Account
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-8">

          <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 md:flex-row">

            <p>
              © 2026 Placement Pilot AI. All rights reserved.
            </p>

            <p>
              Your Placement Assistant
            </p>

          </div>

        </div>
      </footer>

    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/[0.07]">

      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
        ✦
      </div>

      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-400">
        {description}
      </p>

    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 font-bold text-blue-400">
        {number}
      </div>

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-400">
        {description}
      </p>

    </div>
  );
}

export default Home;