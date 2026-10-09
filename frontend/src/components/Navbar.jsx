import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white px-8 py-5 shadow-sm">
      <Link
        to="/"
        className="text-2xl font-bold text-blue-600"
      >
        FinanceAI
      </Link>

      <div className="flex items-center gap-6">
        <Link
          to="/login"
          className="text-gray-600 hover:text-blue-600"
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
  )
}

export default Navbar