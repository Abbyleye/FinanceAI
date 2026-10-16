import { Link } from "react-router-dom";

function ForgotPassword() {
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
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-[#087F5B]">
              ?
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
              Forgot Password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Password recovery is not available yet. You can return to the
              login page or create an account if you are new to FinanceAI.
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-emerald-900/10 bg-[#FAF9F4] p-4">
            <p className="text-sm leading-6 text-slate-600">
              We have not connected a password-reset service to the backend
              yet. No reset email will be sent from this page.
            </p>
          </div>

          <Link
            to="/login"
            className="mt-6 block w-full rounded-xl bg-[#087F5B] py-3.5 text-center font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-[#066749]"
          >
            Back to Log In
          </Link>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-[#087F5B] transition hover:text-[#066749]"
            >
              Create Account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          FinanceAI · Thoughtful money management.
        </p>
      </div>
    </main>
  );
}

export default ForgotPassword;