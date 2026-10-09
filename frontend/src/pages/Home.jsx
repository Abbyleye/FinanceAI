import { Link } from "react-router-dom"
function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white px-8 py-5 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">
          FinanceAI
        </h1>

        <div className="flex gap-4">
          <Link
          to="/login"
          className="rounded-lg px-5 py-2 text-gray-600 hover:bg-gray-100"
          >
          Login
          </Link>

          <Link
          to="/register"
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
          Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">

        <p className="mb-4 font-semibold text-blue-600">
          SMARTER MONEY MANAGEMENT
        </p>

        <h2 className="max-w-4xl text-5xl font-bold leading-tight text-gray-900">
          Take Control of Your Money
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Track your expenses, understand your spending,
          and make smarter financial decisions with AI.
        </p>

        <Link
        to="/register"
        className="mt-8 rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700"
        >
        Start Tracking
        </Link>

      </main>

    </div>
  )
}

export default Home