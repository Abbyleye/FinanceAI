import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function Home() {
  const [backendStatus, setBackendStatus] = useState("Connecting...")

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((response) => {
        if (!response.ok) throw new Error("Backend request failed")
        return response.json()
      })
      .then((data) => setBackendStatus(data.status || "Connected"))
      .catch(() => setBackendStatus("Offline"))
  }, [])

  const features = [
    {
      icon: "↗",
      title: "Track expenses",
      description:
        "Keep your spending organized and see where your money goes.",
    },
    {
      icon: "◎",
      title: "Plan your budget",
      description:
        "Set a monthly budget and keep an eye on your spending progress.",
    },
    {
      icon: "▥",
      title: "Understand your habits",
      description:
        "Explore spending by category and make more informed decisions.",
    },
  ]

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-[#171338] to-slate-950 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 text-xl font-black">
            F
          </span>
          <span className="text-xl font-extrabold">
            Finance<span className="text-purple-400">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 font-semibold shadow-lg shadow-purple-950/30 transition hover:from-purple-500 hover:to-indigo-500"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:py-28 lg:grid-cols-2 lg:px-10">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Smarter money management
            </div>

            <h1 className="max-w-2xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Make every naira{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
                count.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Track expenses, set a budget, and understand your spending with
              one simple personal finance dashboard.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3.5 font-semibold shadow-lg shadow-purple-950/30 transition hover:from-purple-500 hover:to-indigo-500"
              >
                Start tracking free <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-white/15 px-6 py-3.5 font-semibold text-slate-200 transition hover:bg-white/5"
              >
                Sign in
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              Your finances, organized in one place.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-purple-600/20 blur-3xl" />
            <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-purple-950/30 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Your overview</p>
                  <h2 className="mt-1 text-xl font-bold">Monthly snapshot</h2>
                </div>
                <span className="rounded-xl bg-purple-400/10 px-3 py-2 text-sm font-semibold text-purple-300">
                  This month
                </span>
              </div>

              <div className="mt-8 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 p-6">
                <p className="text-sm text-purple-100">Monthly budget</p>
                <p className="mt-2 text-3xl font-extrabold">Stay on track</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-2/3 rounded-full bg-cyan-300" />
                </div>
                <p className="mt-3 text-sm text-purple-100">
                  Monitor your progress as you spend
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-5">
                  <p className="text-sm text-slate-400">Expenses</p>
                  <p className="mt-2 text-xl font-bold">By category</p>
                  <p className="mt-3 text-sm text-cyan-300">
                    See your spending clearly
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-5">
                  <p className="text-sm text-slate-400">Your plan</p>
                  <p className="mt-2 text-xl font-bold">Set a budget</p>
                  <p className="mt-3 text-sm text-emerald-300">
                    Build better habits
                  </p>
                </div>
              </div>

              <p className="mt-5 text-xs text-slate-500">
                Backend: {backendStatus}
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 bg-slate-950/30">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Everything in one place
              </p>
              <h2 className="mt-3 text-3xl font-extrabold">
                Take control of your finances.
              </h2>
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-400/10 text-xl text-purple-300">
                    {feature.icon}
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>
                  <p className="mt-2 leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 px-6 py-6 text-center text-sm text-slate-500">
        FinanceAI · Make smarter decisions with your money.
      </footer>
    </div>
  )
}

export default Home
