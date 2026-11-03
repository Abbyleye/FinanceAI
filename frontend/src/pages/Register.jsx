import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

const inputStyle =
  "w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-[#087F5B] focus:ring-2 focus:ring-emerald-600/15";

function EyeIcon({ visible }) {
  return visible ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A11.4 11.4 0 0 1 12 5c5.5 0 9 7 9 7a15 15 0 0 1-3.1 3.9" />
      <path d="M6.2 6.2C3.9 7.8 2 12 2 12s3.5 7 10 7a10.6 10.6 0 0 0 4-.8" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Registration failed. Please check your details."
        );
      }

      setMessage(
        "Your account was created successfully! You can now log in."
      );

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF9F4] px-4 py-10 text-slate-800">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-emerald-200/40 blur-[100px]" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-amber-100/60 blur-[110px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="mb-8 block text-center text-3xl font-extrabold tracking-tight text-slate-900"
        >
          Finance<span className="text-[#087F5B]">AI</span>
        </Link>

        <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-xl shadow-emerald-950/5 backdrop-blur-sm sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl font-bold text-[#087F5B]">
              +
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Start managing your money smarter, one day at a time.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label
                htmlFor="register-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>

              <input
                id="register-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                maxLength={100}
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  className={`${inputStyle} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-slate-500 transition hover:text-[#087F5B] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#087F5B]"
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Use at least 8 characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="register-confirm-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  className={`${inputStyle} pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  aria-pressed={showConfirmPassword}
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-slate-500 transition hover:text-[#087F5B] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#087F5B]"
                >
                  <EyeIcon visible={showConfirmPassword} />
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
              >
                {error}
              </p>
            )}

            {message && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-5 text-emerald-800"
              >
                {message}
                <Link
                  to="/login"
                  className="ml-1 font-bold text-[#087F5B] underline underline-offset-2"
                >
                  Log in now
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#087F5B] py-3.5 font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-[#066749] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#087F5B] transition hover:text-[#066749]"
            >
              Log In
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Thoughtful money management starts here.
        </p>
      </div>
    </main>
  );
}

export default Register;