
import { Link } from "react-router-dom";

const formatNaira = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

function Demo() {
  const balance = 350000;
  const totalSpent = 100000;
  const monthlyBudget = 150000;
  const remainingBudget = monthlyBudget - totalSpent;
  const budgetUsed = Math.round((totalSpent / monthlyBudget) * 100);

  const categories = [
    {
      name: "Food",
      amount: 45000,
      percentage: 45,
      color: "bg-emerald-500",
    },
    {
      name: "Transport",
      amount: 18000,
      percentage: 18,
      color: "bg-sky-500",
    },
    {
      name: "Education",
      amount: 15000,
      percentage: 15,
      color: "bg-violet-500",
    },
    {
      name: "Airtime & data",
      amount: 8000,
      percentage: 8,
      color: "bg-amber-500",
    },
    {
      name: "Others",
      amount: 14000,
      percentage: 14,
      color: "bg-rose-500",
    },
  ];

  const transactions = [
    {
      name: "Groceries",
      category: "Food",
      date: "Today",
      amount: 12000,
      color: "bg-emerald-100 text-emerald-700",
      symbol: "F",
    },
    {
      name: "Transport fare",
      category: "Transport",
      date: "Yesterday",
      amount: 3500,
      color: "bg-sky-100 text-sky-700",
      symbol: "T",
    },
    {
      name: "Internet data",
      category: "Airtime & data",
      date: "Yesterday",
      amount: 2500,
      color: "bg-amber-100 text-amber-700",
      symbol: "A",
    },
    {
      name: "Study materials",
      category: "Education",
      date: "Oct 12",
      amount: 8000,
      color: "bg-violet-100 text-violet-700",
      symbol: "E",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-800">
      {/* Navigation */}
      <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xl font-black text-white shadow-sm">
              F
            </div>

            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Finance<span className="text-emerald-600">AI</span>
            </span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-5">
            <Link
              to="/"
              className="hidden text-sm font-semibold text-slate-600 transition hover:text-emerald-700 sm:inline"
            >
              Home
            </Link>

            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Create account
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Demo introduction */}
        <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Interactive preview
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Your money, made clearer.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Explore how FinanceAI helps you understand your spending, track
              your budget, and make smarter money decisions.
            </p>
          </div>

          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-md transition hover:bg-emerald-700"
          >
            Start tracking your money
          </Link>
        </section>

        {/* Sample data notice */}
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 font-black text-amber-700">
            i
          </span>

          <div>
            <p className="font-bold text-amber-900">You are viewing demo data</p>
            <p className="mt-1 text-sm leading-6 text-amber-800">
              These figures are fictional examples for demonstration purposes.
              They are not connected to a bank account and will not change your
              personal financial records.
            </p>
          </div>
        </div>

        {/* Summary cards */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Available balance
            </p>
            <p className="mt-3 text-2xl font-black text-slate-900">
              {formatNaira(balance)}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Example balance for this demo
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Total spent
            </p>
            <p className="mt-3 text-2xl font-black text-rose-600">
              {formatNaira(totalSpent)}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Sample spending this month
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Monthly budget
            </p>
            <p className="mt-3 text-2xl font-black text-slate-900">
              {formatNaira(monthlyBudget)}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Your example spending limit
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Budget remaining
            </p>
            <p className="mt-3 text-2xl font-black text-emerald-700">
              {formatNaira(remainingBudget)}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Available before reaching your budget
            </p>
          </div>
        </section>

        {/* Spending and budget */}
        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-slate-900">
                Spending by category
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                See where your money goes in this sample month.
              </p>
            </div>

            <div className="space-y-5">
              {categories.map((category) => (
                <div key={category.name}>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      {category.name}
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {formatNaira(category.amount)}
                      <span className="ml-2 font-medium text-slate-500">
                        {category.percentage}%
                      </span>
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${category.color}`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-emerald-50 p-4">
              <p className="text-sm leading-6 text-emerald-900">
                <span className="font-bold">Demo insight:</span> Food accounts
                for the largest share of spending. Reviewing food purchases
                could help you find opportunities to save.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-slate-900">
                Budget overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep track of your monthly spending limit.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white sm:p-6">
              <p className="text-sm font-medium text-emerald-50">
                Monthly budget
              </p>

              <p className="mt-2 text-3xl font-black">
                {formatNaira(monthlyBudget)}
              </p>

              <div className="mt-6 flex items-center justify-between gap-3 text-sm">
                <span className="text-emerald-50">Amount spent</span>
                <span className="font-bold">{formatNaira(totalSpent)}</span>
              </div>

              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/25">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${budgetUsed}%` }}
                />
              </div>

              {/* Corrected spacing between the label and percentage */}
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm font-semibold text-emerald-50">
                  Monthly budget used:
                </span>

                <span className="ml-1 text-lg font-extrabold text-white">
                  {budgetUsed}%
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/20 pt-4">
                <span className="text-sm text-emerald-50">
                  Amount remaining
                </span>
                <span className="text-lg font-extrabold">
                  {formatNaira(remainingBudget)}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="font-bold text-emerald-900">
                You are within your budget.
              </p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                You have used {budgetUsed}% of your monthly limit. You have{" "}
                {formatNaira(remainingBudget)} left to spend before reaching
                your budget.
              </p>
            </div>
          </div>
        </section>

        {/* Recent transactions */}
        <section className="mb-8 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Recent transactions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                A preview of example expenses.
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
              Sample records
            </span>
          </div>

          <div className="space-y-1">
            {transactions.map((transaction) => (
              <div
                key={transaction.name}
                className="flex items-center justify-between gap-3 rounded-xl px-2 py-4 transition hover:bg-emerald-50/60 sm:px-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-extrabold ${transaction.color}`}
                  >
                    {transaction.symbol}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-800">
                      {transaction.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {transaction.category} · {transaction.date}
                    </p>
                  </div>
                </div>

                <p className="shrink-0 font-extrabold text-slate-900">
                  −{formatNaira(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FinanceAI insights */}
        <section className="mb-8 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <span className="inline-flex rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-700">
              Smart money tips
            </span>

            <h2 className="mt-3 text-xl font-extrabold text-slate-900">
              Your sample FinanceAI insights
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Examples of how FinanceAI can help you make more informed
              spending decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-lg">
                ↗
              </div>
              <h3 className="font-bold text-slate-900">
                Watch your food spending
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Food accounts for 45% of the example spending. Planning meals
                and shopping with a list may help reduce unnecessary purchases.
              </p>
            </div>

            <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-lg">
                ✓
              </div>
              <h3 className="font-bold text-slate-900">
                Stay within your limit
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The sample budget has {formatNaira(remainingBudget)} remaining.
                Check your spending regularly so you can adjust before
                overspending.
              </p>
            </div>

            <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-lg">
                ✦
              </div>
              <h3 className="font-bold text-slate-900">
                Build a saving habit
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Set a realistic savings goal and review your expenses each
                week to find an amount you can consistently put aside.
              </p>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-9 text-center text-white shadow-lg sm:px-8 sm:py-12">
          <h2 className="text-2xl font-black sm:text-3xl">
            Ready to take control of your money?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
            Create your free FinanceAI account to start recording expenses,
            monitoring your budget, and understanding your spending habits.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="rounded-xl bg-white px-6 py-3 font-extrabold text-emerald-700 transition hover:bg-emerald-50"
            >
              Create free account
            </Link>

            <Link
              to="/"
              className="rounded-xl border border-white/50 px-6 py-3 font-bold text-white transition hover:bg-white/10"
            >
              Back to home
            </Link>
          </div>
        </section>

        <footer className="py-8 text-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} FinanceAI. Smarter money management.
          </p>
          <p className="mt-1">
            This public demo uses fictional financial data.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default Demo;