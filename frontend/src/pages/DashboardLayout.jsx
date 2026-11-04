import { Link, NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "◈" },
  { path: "/expenses", label: "Expenses", icon: "↗" },
  { path: "/budgets", label: "Budgets", icon: "◎" },
  { path: "/insights", label: "Insights", icon: "▥" },
  { path: "/profile", label: "Profile", icon: "♙" },
  { path: "/settings", label: "Settings", icon: "⚙" },
];

const navLinkStyle =
  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-600 transition hover:bg-emerald-50 hover:text-[#087F5B]";

const activeLinkStyle =
  "border border-emerald-800/10 bg-emerald-50 font-semibold text-[#087F5B]";

function DashboardLayout({ children }) {
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("financeai_access_token");
    sessionStorage.removeItem("financeai_user");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-slate-800">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 flex-col overflow-y-auto border-r border-emerald-900/10 bg-white/95 shadow-sm md:flex">
        <div className="border-b border-emerald-900/10 p-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#087F5B] text-lg font-black text-white shadow-lg shadow-emerald-900/15">
              F
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Finance<span className="text-[#087F5B]">AI</span>
              </h1>
              <p className="text-xs text-slate-500">Your money, smarter.</p>
            </div>
          </Link>
        </div>

        <nav className="space-y-1 px-3 py-4" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive ? activeLinkStyle : ""}`
              }
            >
              <span className="w-5 text-center" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className={`${navLinkStyle} mx-3 mb-4 w-auto text-left`}
        >
          <span className="w-5 text-center" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </span>
          Log Out
        </button>

        <div className="mx-3 mb-4 mt-auto rounded-xl border border-emerald-800/10 bg-gradient-to-br from-emerald-50 to-[#FAF9F4] p-3">
          <p className="text-sm font-semibold text-slate-800">
            Smart money habits
          </p>
          <p className="mt-1 text-xs leading-4 text-slate-600">
            Track your spending and make every naira count.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="relative min-w-0 p-4 pb-24 sm:p-6 sm:pb-24 md:ml-64 md:p-8 lg:p-10">
        <div className="mb-6 flex items-center justify-between gap-3 md:hidden">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#087F5B] font-black text-white">
              F
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Finance<span className="text-[#087F5B]">AI</span>
            </h1>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="rounded-lg border border-emerald-900/10 bg-white p-3 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </button>
        </div>

        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-emerald-900/10 bg-white/95 px-1 py-2 shadow-lg backdrop-blur md:hidden"
      >
        <div className="mx-auto flex max-w-lg items-center justify-around gap-1">
          {navItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] transition ${
                  isActive
                    ? "bg-emerald-50 font-bold text-[#087F5B]"
                    : "text-slate-500 hover:bg-emerald-50"
                }`
              }
            >
              <span className="text-lg" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default DashboardLayout;