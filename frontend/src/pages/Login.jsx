import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8001").replace(/\/$/, "");

const inputStyle =
  "mt-2 w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-[#087F5B] focus:ring-2 focus:ring-emerald-600/15";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Login failed. Please check your details."
        );
      }

      if (!data.access_token || !data.user) {
        throw new Error(
          "Login response was incomplete. Please try again."
        );
      }

      sessionStorage.setItem(
        "financeai_access_token",
        data.access_token
      );

      sessionStorage.setItem(
        "financeai_user",
        JSON.stringify(data.user)
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to FinanceAI. Please check that the backend is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">

        {/* FinanceAI heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#087F5B]">
            FinanceAI
          </h1>

          <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-500">
            Smarter Money Management
          </p>

          <h2 className="mt-7 text-2xl font-bold text-slate-900">
            Welcome Back
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Login to manage your finances.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              autoComplete="email"
              className={inputStyle}
              required
            />
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[#087F5B] transition hover:text-emerald-800 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative mt-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 pr-12 text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-[#087F5B] focus:ring-2 focus:ring-emerald-600/15"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-3 flex items-center justify-center text-[#087F5B] transition hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 rounded-md"
              >
                {showPassword ? (
                  <EyeOff size={20} aria-hidden="true" />
                ) : (
                  <Eye size={20} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#087F5B] px-4 py-3 font-semibold text-white shadow-md transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-7 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#087F5B] hover:underline"
          >
            Create one
          </Link>
        </p>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-400">
          FinanceAI — Take Control of Your Money
        </p>

      </div>
    </div>
  );
}

export default Login;