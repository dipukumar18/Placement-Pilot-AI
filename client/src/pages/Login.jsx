import { Link } from "react-router-dom";

function Login() {
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
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Login to continue your placement preparation.
            </p>

            <form className="mt-8 space-y-5">

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
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-200">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              {/* Login */}
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold transition hover:bg-blue-500"
              >
                Login
              </button>

            </form>

            <p className="mt-7 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                Create account
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

export default Login;