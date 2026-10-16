
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8001").replace(/\/$/, "");

const categories = [
  "Airtime",
  "Clothing",
  "Education",
  "Entertainment",
  "Food",
  "Giving",
  "Healthcare",
  "Housing",
  "Personal Care",
  "Savings",
  "Transport",
  "Utilities",
  "Others",
];

const chartColors = [
  "#087F5B", "#0EA5A4", "#65A30D", "#D97706", "#DB2777",
  "#7C3AED", "#64748B", "#2563EB", "#9333EA", "#DC2626",
  "#0891B2", "#CA8A04", "#4F46E5",
];

const cardStyle =
  "rounded-2xl border border-emerald-900/10 bg-white/90 p-6 shadow-sm shadow-emerald-950/5";

const inputStyle =
  "w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#087F5B] focus:ring-2 focus:ring-emerald-600/15";

const numberInputStyle =
  `${inputStyle} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;

const buttonStyle =
  "rounded-xl bg-[#087F5B] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#066749] disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButtonStyle =
  "rounded-xl border border-emerald-900/15 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60";

const navLinkStyle =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition hover:bg-emerald-50 hover:text-[#087F5B]";

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("financeai_balance");
    return saved !== null && saved !== "" ? Number(saved) : 250000;
  });

  const [editingBalance, setEditingBalance] = useState(false);

  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem("financeai_budget");
    return saved !== null && saved !== "" ? Number(saved) : 100000;
  });

  const [budgetInput, setBudgetInput] = useState("");
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(getToday());
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Attach the user's access token to protected API requests.
  async function apiFetch(url, options = {}) {
    const token = sessionStorage.getItem("financeai_access_token");
    const headers = new Headers(options.headers || {});

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      sessionStorage.removeItem("financeai_access_token");
      sessionStorage.removeItem("financeai_user");
      navigate("/login", { replace: true });
      throw new Error("Your login session has expired. Please log in again.");
    }

    return response;
  }

  async function loadExpenses() {
    try {
      setError("");

      const response = await apiFetch(`${API_URL}/expenses`);

      if (!response.ok) {
        throw new Error("FinanceAI could not load your expenses. Please try again.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The server returned an unexpected expenses response.");
      }

      setExpenses(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to FinanceAI. Check that your backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("financeai_budget", String(monthlyBudget));
  }, [monthlyBudget]);

  const now = new Date();

  const money = (value) =>
    `₦${Number(value || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  const monthlySpending = expenses.reduce((total, expense) => {
    if (!expense.date) return total;

    const expenseDate = new Date(`${expense.date}T12:00:00`);

    if (
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear()
    ) {
      return total + Number(expense.amount || 0);
    }

    return total;
  }, 0);

  const budgetRemaining = monthlyBudget - monthlySpending;

  const categorySpending = expenses.reduce((result, expense) => {
    const expenseCategory = expense.category || "Others";
    result[expenseCategory] =
      (result[expenseCategory] || 0) + Number(expense.amount || 0);
    return result;
  }, {});

  const categoryChartData = Object.entries(categorySpending).map(
    ([name, value]) => ({ name, value })
  );

  const filteredExpenses = expenses.filter((expense) => {
    const name = String(expense.name || "");
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" ||
      (expense.category || "Others") === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const resetExpenseForm = () => {
    setExpenseName("");
    setAmount("");
    setCategory("");
    setDate(getToday());
    setEditingExpenseId(null);
    setShowExpenseForm(false);
  };

  const handleBalanceSubmit = (event) => {
    event.preventDefault();

    const value = event.currentTarget.elements.balanceAmount.value;

    if (
      value.trim() === "" ||
      !Number.isFinite(Number(value)) ||
      Number(value) < 0
    ) {
      setError("Please enter a valid available balance.");
      return;
    }

    const newBalance = Number(value);
    setBalance(newBalance);
    localStorage.setItem("financeai_balance", String(newBalance));
    setEditingBalance(false);
    setError("");
  };

  const handleBudgetSubmit = (event) => {
    event.preventDefault();

    if (
      budgetInput.trim() === "" ||
      !Number.isFinite(Number(budgetInput)) ||
      Number(budgetInput) < 0
    ) {
      setError("Please enter a valid monthly budget.");
      return;
    }

    setMonthlyBudget(Number(budgetInput));
    setBudgetInput("");
    setShowBudgetForm(false);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!expenseName.trim() || amount.trim() === "" || !category || !date) {
      setError("Please complete all expense fields.");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("The amount must be greater than zero.");
      return;
    }

    const expenseData = {
      name: expenseName.trim(),
      amount: numericAmount,
      category,
      date,
    };

    setSaving(true);

    try {
      const isEditing = editingExpenseId !== null;
      const url = isEditing
        ? `${API_URL}/expenses/${editingExpenseId}`
        : `${API_URL}/expenses`;

      const response = await apiFetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        let message = "FinanceAI could not save the expense.";

        try {
          const details = await response.json();

          if (typeof details.detail === "string") {
            message = details.detail;
          } else if (Array.isArray(details.detail)) {
            message = details.detail.map((item) => item.msg).join(" ");
          }
        } catch {
          // Keep the default error message.
        }

        throw new Error(message);
      }

      resetExpenseForm();
      await loadExpenses();
    } catch (err) {
      setError(err.message || "Unable to save your expense. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete || deleting) return;

    setDeleting(true);
    setError("");

    try {
      const response = await apiFetch(
        `${API_URL}/expenses/${expenseToDelete.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        let message = "FinanceAI could not delete the expense.";

        try {
          const details = await response.json();
          if (typeof details.detail === "string") {
            message = details.detail;
          }
        } catch {
          // Keep the default error message.
        }

        throw new Error(message);
      }

      if (editingExpenseId === expenseToDelete.id) {
        resetExpenseForm();
      }

      setExpenseToDelete(null);
      await loadExpenses();
    } catch (err) {
      setError(err.message || "Unable to delete your expense. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleEditExpense = (expense) => {
    setExpenseName(expense.name || "");
    setAmount(String(expense.amount ?? ""));
    setCategory(expense.category || "Others");
    setDate(expense.date || getToday());
    setEditingExpenseId(expense.id);
    setShowExpenseForm(true);
    setError("");

    document.getElementById("transactions")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const openExpenseForm = () => {
    resetExpenseForm();
    setError("");
    setShowExpenseForm(true);

    window.setTimeout(() => {
      document.getElementById("expense-form")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  };

  const budgetUsed =
    monthlyBudget > 0
      ? (monthlySpending / monthlyBudget) * 100
      : monthlySpending > 0
        ? 100
        : 0;

  const getCategoryColor = (categoryName) => {
    const index = categories.indexOf(categoryName);
    return chartColors[index >= 0 ? index % chartColors.length : 0];
  };

  const preventWheelChange = (event) => event.currentTarget.blur();

  const openDatePicker = (event) => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      // The browser may not allow opening the picker programmatically.
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("financeai_access_token");
    sessionStorage.removeItem("financeai_user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-slate-800">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 border-r border-emerald-900/10 bg-white/95 shadow-sm md:block">
        <div className="border-b border-emerald-900/10 p-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#087F5B] text-xl font-black text-white shadow-lg shadow-emerald-900/15">
              F
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Finance<span className="text-[#087F5B]">AI</span>
              </h1>
              <p className="text-xs text-slate-500">Your money, smarter.</p>
            </div>
          </Link>
        </div>

        <nav className="space-y-2 px-4 py-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-xl border border-emerald-800/10 bg-emerald-50 px-4 py-3 font-semibold text-[#087F5B]"
          >
            <span>◈</span> Dashboard
          </Link>

          <a href="#transactions" className={navLinkStyle}>
            <span>↗</span> Expenses
          </a>

          <a href="#budget" className={navLinkStyle}>
            <span>◎</span> Budgets
          </a>

          <a href="#insights" className={navLinkStyle}>
            <span>▥</span> Insights
          </a>

          {/* New Profile link */}
          <Link to="/profile" className={navLinkStyle}>
            <span>♙</span> Profile
          </Link>

          {/* New Settings link */}
          <Link to="/settings" className={navLinkStyle}>
            <span>⚙</span> Settings
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={`${navLinkStyle} w-full text-left`}
          >
            <span>↪</span> Log Out
          </button>
        </nav>

        <div className="absolute bottom-6 left-4 right-4 rounded-2xl border border-emerald-800/10 bg-gradient-to-br from-emerald-50 to-[#FAF9F4] p-4">
          <p className="text-sm font-semibold text-slate-800">
            Smart money habits
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            Track your spending and make every naira count.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="relative min-w-0 p-4 sm:p-6 md:ml-64 md:p-8 lg:p-10">
        <div className="mb-8 flex items-center justify-between gap-3 md:hidden">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#087F5B] font-black text-white">
              F
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Finance<span className="text-[#087F5B]">AI</span>
            </h1>
          </Link>
          <div className="flex gap-2">
            <Link
              to="/profile"
              aria-label="Profile"
              className="rounded-lg border border-emerald-900/10 bg-white px-3 py-2 text-sm"
            >
              ♙
            </Link>
            <Link
              to="/settings"
              aria-label="Settings"
              className="rounded-lg border border-emerald-900/10 bg-white px-3 py-2 text-sm"
            >
              ⚙
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#087F5B]">
              Your financial overview
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Dashboard<span className="text-[#087F5B]">.</span>
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Welcome back! Here&apos;s an overview of your finances.
            </p>
          </div>

          <button type="button" onClick={openExpenseForm} className={buttonStyle}>
            + Add Expense
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Summary cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-800/15 bg-gradient-to-br from-[#087F5B] via-[#087F5B] to-[#065F46] p-6 text-white shadow-lg shadow-emerald-950/10">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-emerald-50">Available Balance</p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-lg">
                  ◈
                </span>
              </div>
              <p className="mt-2 text-xs text-emerald-100">
                Manually entered · Not connected to your bank
              </p>
              <h3 className="mt-5 break-words text-2xl font-extrabold">
                {money(balance)}
              </h3>

              {editingBalance ? (
                <form className="mt-4 space-y-3" onSubmit={handleBalanceSubmit}>
                  <label htmlFor="balance-amount" className="block text-sm font-medium text-emerald-50">
                    Available balance (₦)
                  </label>
                  <input
                    id="balance-amount"
                    type="number"
                    name="balanceAmount"
                    defaultValue={balance}
                    min="0"
                    step="any"
                    required
                    onWheel={preventWheelChange}
                    className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-slate-800 outline-none [appearance:textfield] focus:ring-2 focus:ring-emerald-200 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#087F5B]">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBalance(false)}
                      className="rounded-lg border border-white/30 px-3 py-2 text-sm text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingBalance(true)}
                  className="mt-4 rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
                >
                  Edit Balance
                </button>
              )}
            </div>
          </div>

          <div className={`${cardStyle} relative overflow-hidden`}>
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-teal-100 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">Total Expenses</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl text-[#087F5B]">
                  ↗
                </span>
              </div>
              <h3 className="mt-6 break-words text-2xl font-extrabold text-slate-900">
                {money(totalExpenses)}
              </h3>
              <p className="mt-2 text-xs text-[#087F5B]">Across all recorded expenses</p>
            </div>
          </div>

          <div className={`${cardStyle} relative overflow-hidden`}>
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-100 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">Monthly Spending</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-700">
                  ◷
                </span>
              </div>
              <h3 className="mt-6 break-words text-2xl font-extrabold text-slate-900">
                {money(monthlySpending)}
              </h3>
              <p className="mt-2 text-xs text-amber-700">Spending this month</p>
            </div>
          </div>

          <div className={`${cardStyle} relative overflow-hidden`}>
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">Budget Remaining</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl text-[#087F5B]">
                  ✓
                </span>
              </div>
              <h3 className={`mt-6 break-words text-2xl font-extrabold ${budgetRemaining < 0 ? "text-red-600" : "text-[#087F5B]"}`}>
                {money(budgetRemaining)}
              </h3>
              <p className="mt-2 text-xs text-slate-500">Based on your monthly budget</p>
            </div>
          </div>
        </div>

        {/* Monthly budget */}
        <section id="budget" className={`${cardStyle} mt-8 scroll-mt-6`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#087F5B]">YOUR SPENDING PLAN</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Monthly Budget</h3>
              <p className="mt-2 text-sm text-slate-500">
                Your current budget is {money(monthlyBudget)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setBudgetInput(String(monthlyBudget));
                setShowBudgetForm(!showBudgetForm);
              }}
              className={buttonStyle}
            >
              {showBudgetForm ? "Close" : "Set Budget"}
            </button>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between gap-4 text-sm">
              <span className="text-slate-500">Monthly budget used</span>
              <span className={`font-semibold ${budgetRemaining < 0 ? "text-red-600" : "text-[#087F5B]"}`}>
                {monthlyBudget > 0
                  ? `${Math.round(budgetUsed)}%`
                  : monthlySpending > 0
                    ? "Over budget"
                    : "0%"}
              </span>
            </div>
            <div
              className="h-3 overflow-hidden rounded-full bg-emerald-50"
              role="progressbar"
              aria-label="Monthly budget used"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={monthlyBudget > 0 ? Math.min(100, Math.round(budgetUsed)) : 0}
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${budgetRemaining < 0 ? "bg-gradient-to-r from-red-500 to-rose-400" : "bg-gradient-to-r from-[#087F5B] to-emerald-400"}`}
                style={{ width: `${monthlyBudget > 0 ? Math.min(100, budgetUsed) : 0}%` }}
              />
            </div>
            {budgetRemaining < 0 && (
              <p className="mt-3 text-sm font-medium text-red-600">
                You have exceeded your monthly budget by {money(Math.abs(budgetRemaining))}.
              </p>
            )}
          </div>

          {showBudgetForm && (
            <form onSubmit={handleBudgetSubmit} className="mt-6 rounded-xl border border-emerald-900/10 bg-[#FAF9F4] p-5">
              <label htmlFor="monthly-budget" className="mb-2 block text-sm font-medium text-slate-700">
                Monthly Budget (₦)
              </label>
              <input
                id="monthly-budget"
                type="number"
                min="0"
                step="any"
                value={budgetInput}
                onChange={(event) => setBudgetInput(event.target.value)}
                onWheel={preventWheelChange}
                placeholder="e.g. 100000"
                required
                className={numberInputStyle}
              />
              <button type="submit" className={`${buttonStyle} mt-4 w-full`}>
                Save Budget
              </button>
            </form>
          )}
        </section>

        {/* Spending by category */}
        <section id="insights" className={`${cardStyle} mt-8 scroll-mt-6`}>
          <p className="text-sm font-semibold text-[#087F5B]">UNDERSTAND YOUR MONEY</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Spending by Category</h3>
          <p className="mt-2 text-sm text-slate-500">
            See how much you have spent in each category.
          </p>

          {Object.keys(categorySpending).length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(categorySpending).map(([categoryName, categoryAmount]) => {
                const color = getCategoryColor(categoryName);
                return (
                  <div key={categoryName} className="rounded-xl border border-emerald-900/10 bg-[#FAF9F4] p-5 transition hover:border-emerald-700/30 hover:bg-emerald-50/50">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-sm font-medium text-slate-600">{categoryName}</p>
                    </div>
                    <h4 className="mt-3 break-words text-2xl font-bold text-slate-900">
                      {money(categoryAmount)}
                    </h4>
                  </div>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="mt-8 flex h-72 flex-col items-center justify-center gap-3 text-slate-500">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" role="status" aria-label="Loading spending chart" />
              <p>Loading spending chart...</p>
            </div>
          ) : categoryChartData.length > 0 ? (
            <div className="mt-8 h-80 rounded-xl border border-emerald-900/10 bg-[#FAF9F4] p-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} paddingAngle={3} label>
                    {categoryChartData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={getCategoryColor(entry.name)} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => money(value)}
                    contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #D1E7D9", borderRadius: "12px", color: "#1E293B" }}
                    itemStyle={{ color: "#334155" }}
                  />
                  <Legend formatter={(value) => <span style={{ color: "#475569" }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-6 rounded-xl bg-[#FAF9F4] p-5 text-sm text-slate-500">
              Add an expense to see your category chart.
            </p>
          )}
        </section>

        {/* Recent transactions */}
        <section id="transactions" className={`${cardStyle} mt-8 scroll-mt-6`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#087F5B]">YOUR MONEY ACTIVITY</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Recent Transactions</h3>
              <p className="mt-2 text-sm text-slate-500">
                Your latest expenses saved in the database.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (showExpenseForm) {
                  resetExpenseForm();
                } else {
                  setError("");
                  setExpenseName("");
                  setAmount("");
                  setCategory("");
                  setDate(getToday());
                  setEditingExpenseId(null);
                  setShowExpenseForm(true);
                }
              }}
              className={buttonStyle}
            >
              {showExpenseForm ? "Close Form" : "+ Add Expense"}
            </button>
          </div>

          {showExpenseForm && (
            <div id="expense-form" className="mt-6 scroll-mt-6 rounded-2xl border border-emerald-800/15 bg-[#FAF9F4] p-5 sm:p-6">
              <h4 className="text-lg font-bold text-slate-900">
                {editingExpenseId !== null ? "Edit Expense" : "Add New Expense"}
              </h4>
              <p className="mt-2 text-sm text-slate-500">Enter your expense details below.</p>

              <form onSubmit={handleSubmit} className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="expense-name" className="mb-2 block text-sm font-medium text-slate-700">Expense Name</label>
                  <input
                    id="expense-name"
                    type="text"
                    value={expenseName}
                    onChange={(event) => setExpenseName(event.target.value)}
                    placeholder="e.g. Groceries"
                    required
                    maxLength={100}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="expense-amount" className="mb-2 block text-sm font-medium text-slate-700">Amount (₦)</label>
                  <input
                    id="expense-amount"
                    type="number"
                    min="0.01"
                    step="any"
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    onWheel={preventWheelChange}
                    placeholder="e.g. 2000"
                    required
                    className={numberInputStyle}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Scrolling the page over this field will not change your amount.
                  </p>
                </div>

                <div>
                  <label htmlFor="expense-category" className="mb-2 block text-sm font-medium text-slate-700">Category</label>
                  <select id="expense-category" value={category} onChange={(event) => setCategory(event.target.value)} required className={inputStyle}>
                    <option value="">Select a category</option>
                    {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="expense-date" className="mb-2 block text-sm font-medium text-slate-700">Date</label>
                  <input id="expense-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} onClick={openDatePicker} required className={`${inputStyle} min-h-[48px] cursor-pointer`} />
                  <p className="mt-2 text-xs text-slate-500">
                    Defaults to today. Use the calendar to choose another date.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
                  <button type="submit" disabled={saving} className={`${buttonStyle} flex-1`}>
                    {saving ? "Saving..." : editingExpenseId !== null ? "Update Expense" : "Save Expense"}
                  </button>
                  <button type="button" onClick={resetExpenseForm} disabled={saving} className={secondaryButtonStyle}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search expenses..."
              aria-label="Search expenses"
              className={inputStyle}
            />
            <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)} aria-label="Filter expenses by category" className={inputStyle}>
              <option value="">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="mt-6 divide-y divide-emerald-900/10">
            {loading ? (
              <div className="flex items-center gap-3 py-8 text-slate-500">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" role="status" aria-label="Loading expenses" />
                <p>Loading your expenses from FinanceAI...</p>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <p className="rounded-xl bg-[#FAF9F4] py-8 text-center text-slate-500">
                No expenses found. Add an expense to get started.
              </p>
            ) : (
              filteredExpenses.map((expense) => {
                const color = getCategoryColor(expense.category || "Others");
                return (
                  <div key={expense.id} className="flex flex-wrap items-center justify-between gap-4 py-5 transition hover:bg-emerald-50/40">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold" style={{ backgroundColor: `${color}18`, color }}>
                        {String(expense.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="break-words font-semibold text-slate-900">{expense.name}</h4>
                        <p className="mt-1 text-sm text-slate-600">{expense.category || "Others"}</p>
                        <p className="mt-1 text-xs text-slate-500">{expense.date}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <p className="font-bold text-slate-900">-{money(expense.amount)}</p>
                      <button type="button" onClick={() => handleEditExpense(expense)} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#087F5B] transition hover:bg-emerald-50">
                        Edit
                      </button>
                      <button type="button" onClick={() => { setExpenseToDelete(expense); setError(""); }} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <footer className="py-8 text-center text-xs text-slate-500">
          FinanceAI · Make smarter decisions with your money.
        </footer>
      </main>

      {/* Delete confirmation */}
      {expenseToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setExpenseToDelete(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
            className="w-full max-w-md rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
              <span aria-hidden="true">!</span>
            </div>
            <h3 id="delete-modal-title" className="mt-5 text-xl font-extrabold text-slate-900">
              Delete this expense?
            </h3>
            <p id="delete-modal-description" className="mt-3 text-sm leading-6 text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">{expenseToDelete.name}</span>{" "}
              ({money(expenseToDelete.amount)})? This action cannot be undone.
            </p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" disabled={deleting} onClick={() => setExpenseToDelete(null)} className={secondaryButtonStyle}>
                Cancel
              </button>
              <button type="button" disabled={deleting} onClick={handleDeleteExpense} className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
                {deleting ? "Deleting..." : "Delete Expense"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;