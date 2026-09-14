import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="flex min-h-screen items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Logo */}
          <Link to="/" className="block text-center text-2xl font-bold">
            Placement <span className="text-blue-400">Pilot AI</span>
          </Link>

          <p className="mt-2 text-center text-sm text-slate-400">
            Your Placement Assistant
          </p>

          {/* Card */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">

            <h1 className="text-2xl font-bold">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Start your personalized placement preparation journey.
            </p>

            <form className="mt-8 space-y-5">

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">

                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900"
                />

                <p className="text-sm leading-5 text-slate-400">
                  I agree to the platform terms and understand that my account
                  will start with the Free plan.
                </p>

              </div>

              {/* Register */}
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold transition hover:bg-blue-500"
              >
                Create Account
              </button>

            </form>

            <p className="mt-7 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                Login
              </Link>
            </p>

          </div>

          <Link
            to="/"
            className="mt-6 block text-center text-sm text-slate-500 hover:text-slate-300"
          >
            ← Back to home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;