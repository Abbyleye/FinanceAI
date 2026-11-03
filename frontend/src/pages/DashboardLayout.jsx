import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinkStyle =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-emerald-50 hover:text-[#087F5B]";

function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const activeLink = (path) =>
    location.pathname === path
      ? "border border-emerald-800/10 bg-emerald-50 font-semibold text-[#087F5B]"
      : "";

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

        <nav className="space-y-1 px-3 py-4">
          <Link to="/dashboard" className={`${navLinkStyle} ${activeLink("/dashboard")}`}>
            <span>◈</span> Dashboard
          </Link>
          <Link to="/dashboard#transactions" className={navLinkStyle}>
            <span>↗</span> Expenses
          </Link>
          <Link to="/dashboard#budget" className={navLinkStyle}>
            <span>◎</span> Budgets
          </Link>
          <Link to="/dashboard#insights" className={navLinkStyle}>
            <span>▥</span> Insights
          </Link>
          <Link to="/profile" className={`${navLinkStyle} ${activeLink("/profile")}`}>
            <span>♙</span> Profile
          </Link>
          <Link to="/settings" className={`${navLinkStyle} ${activeLink("/settings")}`}>
            <span>⚙</span> Settings
          </Link>
          <button type="button" onClick={handleLogout} className={`${navLinkStyle} w-full text-left`}>
            <span>↪</span> Log Out
          </button>
        </nav>

        <div className="mx-3 mb-4 mt-auto rounded-xl border border-emerald-800/10 bg-gradient-to-br from-emerald-50 to-[#FAF9F4] p-3">
          <p className="text-sm font-semibold text-slate-800">Smart money habits</p>
          <p className="mt-1 text-xs leading-4 text-slate-600">
            Track your spending and make every naira count.
          </p>
        </div>
      </aside>

      <main className="relative min-w-0 p-4 sm:p-6 md:ml-64 md:p-8 lg:p-10">
        <div className="mb-6 flex items-center justify-between gap-3 md:hidden">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#087F5B] font-black text-white">
              F
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Finance<span className="text-[#087F5B]">AI</span>
            </h1>
          </Link>
          <div className="flex gap-2">
            <Link to="/profile" aria-label="Profile" className="rounded-lg border border-emerald-900/10 bg-white px-3 py-2 text-sm">♙</Link>
            <Link to="/settings" aria-label="Settings" className="rounded-lg border border-emerald-900/10 bg-white px-3 py-2 text-sm">⚙</Link>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;