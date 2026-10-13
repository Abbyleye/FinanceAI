
import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const API_URL = "http://127.0.0.1:8000"

const chartColors = [
  "#A78BFA",
  "#22D3EE",
  "#34D399",
  "#FBBF24",
  "#F472B6",
  "#818CF8",
]

const categories = [
  "Food",
  "Transport",
  "Education",
  "Airtime",
  "Clothing",
  "Giving",
]

const cardStyle =
  "rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/10"

const inputStyle =
  "w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"

const buttonStyle =
  "rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-purple-950/30 transition hover:from-purple-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"

function Dashboard() {
  const [expenses, setExpenses] = useState([])

  const [balance, setBalance] = useState(() => {
    return Number(localStorage.getItem("financeai_balance")) || 250000
  })

  const [editingBalance, setEditingBalance] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showBudgetForm, setShowBudgetForm] = useState(false)

  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const savedBudget = localStorage.getItem("financeai_budget")
    return savedBudget ? Number(savedBudget) : 100000
  })

  const [budgetInput, setBudgetInput] = useState("")
  const [expenseName, setExpenseName] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState("")
  const [editingExpenseId, setEditingExpenseId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  async function loadExpenses() {
    try {
      setError("")

      const response = await fetch(`${API_URL}/expenses`)

      if (!response.ok) {
        throw new Error(
          "FinanceAI could not load your expenses. Please try again."
        )
      }

      const data = await response.json()
      setExpenses(data)
    } catch {
      setError(
        "Unable to connect to FinanceAI. Please check that your backend is running and try again."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [])

  useEffect(() => {
    localStorage.setItem("financeai_budget", String(monthlyBudget))
  }, [monthlyBudget])

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  )

  const now = new Date()

  const monthlySpending = expenses.reduce((total, expense) => {
    const expenseDate = new Date(`${expense.date}T12:00:00`)

    if (
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear()
    ) {
      return total + Number(expense.amount)
    }

    return total
  }, 0)

  const budgetRemaining = monthlyBudget - monthlySpending

  const categorySpending = expenses.reduce((result, expense) => {
    result[expense.category] =
      (result[expense.category] || 0) + Number(expense.amount)

    return result
  }, {})

  const categoryChartData = Object.entries(categorySpending).map(
    ([name, value]) => ({ name, value })
  )

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory =
      filterCategory === "" || expense.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const resetExpenseForm = () => {
    setExpenseName("")
    setAmount("")
    setCategory("")
    setDate("")
    setEditingExpenseId(null)
    setShowExpenseForm(false)
  }

  const handleBudgetSubmit = (event) => {
    event.preventDefault()

    if (
      budgetInput.trim() === "" ||
      !Number.isFinite(Number(budgetInput)) ||
      Number(budgetInput) < 0
    ) {
      return
    }

    setMonthlyBudget(Number(budgetInput))
    setBudgetInput("")
    setShowBudgetForm(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (!expenseName.trim() || !amount || !category || !date) {
      setError("Please complete all expense fields.")
      return
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError("The amount must be greater than zero.")
      return
    }

    const expenseData = {
      name: expenseName.trim(),
      amount: Number(amount),
      category,
      date,
    }

    setSaving(true)

    try {
      const isEditing = editingExpenseId !== null

      const url = isEditing
        ? `${API_URL}/expenses/${editingExpenseId}`
        : `${API_URL}/expenses`

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      })

      if (!response.ok) {
        let message = "FinanceAI could not save the expense."

        try {
          const details = await response.json()

          if (typeof details.detail === "string") {
            message = details.detail
          } else if (Array.isArray(details.detail)) {
            message = details.detail
              .map((item) => item.msg)
              .join(" ")
          }
        } catch {
          // Keep the default error message.
        }

        throw new Error(message)
      }

      resetExpenseForm()
      await loadExpenses()
    } catch (err) {
      setError(
        err.message ||
          "Unable to save your expense. Please check your connection and try again."
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteExpense = async (expenseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    )

    if (!confirmed) return

    setError("")

    try {
      const response = await fetch(
        `${API_URL}/expenses/${expenseId}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        let message = "FinanceAI could not delete the expense."

        try {
          const details = await response.json()
          message = details.detail || message
        } catch {
          // Keep the default error message.
        }

        throw new Error(message)
      }

      if (editingExpenseId === expenseId) {
        resetExpenseForm()
      }

      await loadExpenses()
    } catch (err) {
      setError(
        err.message || "Unable to delete your expense. Please try again."
      )
    }
  }

  const handleEditExpense = (expense) => {
    setExpenseName(expense.name)
    setAmount(String(expense.amount))
    setCategory(expense.category)
    setDate(expense.date)
    setEditingExpenseId(expense.id)
    setShowExpenseForm(true)
    setError("")
  }

  const money = (value) =>
    `₦${Number(value).toLocaleString("en-NG", {
      maximumFractionDigits: 2,
    })}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#171338] to-slate-950 text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 border-r border-white/10 bg-slate-950/95 shadow-2xl shadow-purple-950/20 md:block">
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 text-xl font-black text-white shadow-lg shadow-purple-500/20">
              F
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Finance<span className="text-purple-400">AI</span>
              </h1>
              <p className="text-xs text-slate-400">
                Your money, smarter.
              </p>
            </div>
          </div>
        </div>

        <nav className="space-y-2 px-4 py-6">
          <a
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl border border-purple-400/20 bg-gradient-to-r from-purple-600/25 to-indigo-600/10 px-4 py-3 font-semibold text-purple-300"
          >
            <span>◈</span> Dashboard
          </a>

          <a
            href="#transactions"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <span>↗</span> Expenses
          </a>

          <a
            href="#budget"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <span>◎</span> Budgets
          </a>

          <a
            href="#insights"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <span>▥</span> Insights
          </a>
        </nav>

        <div className="absolute bottom-6 left-4 right-4 rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-600/20 to-cyan-500/10 p-4">
          <p className="text-sm font-semibold text-white">
            Smart money habits
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-300">
            Track your spending and make every naira count.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 p-4 sm:p-6 md:ml-64 md:p-8 lg:p-10">
        {/* Mobile Brand */}
        <div className="mb-8 flex items-center gap-3 md:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 font-black">
            F
          </div>
          <h1 className="text-xl font-extrabold">
            Finance<span className="text-purple-400">AI</span>
          </h1>
        </div>

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Your financial overview
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Dashboard<span className="text-purple-400">.</span>
            </h2>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              Welcome back! Here&apos;s an overview of your finances.
            </p>
          </div>

          <a
            href="#transactions"
            className={buttonStyle}
          >
            + Add Expense
          </a>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200"
          >
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {/* Available Balance */}
          <div className="relative overflow-hidden rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 p-6 shadow-xl shadow-purple-950/30">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-purple-100">
                  Available Balance
                </p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-lg">
                  ◈
                </span>
              </div>

              <p className="mt-1 text-xs text-purple-200">
                Manually entered · Not connected to your bank
              </p>

              <h3 className="mt-5 break-words text-2xl font-extrabold text-white">
                {money(balance)}
              </h3>

              {editingBalance ? (
                <form
                  className="mt-4 space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault()
                    const input =
                      event.currentTarget.elements.balanceAmount
                    const newBalance = Number(input.value)

                    if (
                      input.value.trim() !== "" &&
                      Number.isFinite(newBalance) &&
                      newBalance >= 0
                    ) {
                      setBalance(newBalance)
                      localStorage.setItem(
                        "financeai_balance",
                        String(newBalance)
                      )
                      setEditingBalance(false)
                    }
                  }}
                >
                  <input
                    name="balanceAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={balance}
                    required
                    aria-label="Available balance in naira"
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:border-cyan-300"
                    placeholder="Enter balance"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-indigo-800"
                    >
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

          {/* Total Expenses */}
          <div className={`${cardStyle} relative overflow-hidden`}>
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-300">
                  Total Expenses
                </p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-xl text-cyan-300">
                  ↗
                </span>
              </div>
              <h3 className="mt-6 break-words text-2xl font-extrabold text-white">
                {money(totalExpenses)}
              </h3>
              <p className="mt-2 text-xs text-cyan-300">
                Across all recorded expenses
              </p>
            </div>
          </div>

          {/* Monthly Spending */}
          <div className={`${cardStyle} relative overflow-hidden`}>
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pink-400/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-300">
                  Monthly Spending
                </p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-400/10 text-xl text-pink-300">
                  ◷
                </span>
              </div>
              <h3 className="mt-6 break-words text-2xl font-extrabold text-white">
                {money(monthlySpending)}
              </h3>
              <p className="mt-2 text-xs text-pink-300">
                Spending this month
              </p>
            </div>
          </div>

          {/* Budget Remaining */}
          <div className={`${cardStyle} relative overflow-hidden`}>
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-300">
                  Budget Remaining
                </p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-xl text-emerald-300">
                  ✓
                </span>
              </div>
              <h3
                className={`mt-6 break-words text-2xl font-extrabold ${
                  budgetRemaining < 0 ? "text-red-400" : "text-emerald-300"
                }`}
              >
                {money(budgetRemaining)}
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Based on your monthly budget
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Budget */}
        <section id="budget" className={`${cardStyle} mt-8`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-purple-300">
                YOUR SPENDING PLAN
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">
                Monthly Budget
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Your current budget is {money(monthlyBudget)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowBudgetForm(!showBudgetForm)}
              className={buttonStyle}
            >
              {showBudgetForm ? "Close" : "Set Budget"}
            </button>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between gap-4 text-sm">
              <span className="text-slate-400">Monthly budget used</span>
              <span className="font-semibold text-white">
                {monthlyBudget > 0
                  ? `${Math.round(
                      (monthlySpending / monthlyBudget) * 100
                    )}%`
                  : monthlySpending > 0
                    ? "Over budget"
                    : "0%"}
              </span>
            </div>

            <div
              className="h-3 overflow-hidden rounded-full bg-slate-800"
              role="progressbar"
              aria-label="Monthly budget used"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={
                monthlyBudget > 0
                  ? Math.min(
                      100,
                      Math.round((monthlySpending / monthlyBudget) * 100)
                    )
                  : 0
              }
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetRemaining < 0
                    ? "bg-gradient-to-r from-red-500 to-pink-400"
                    : "bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400"
                }`}
                style={{
                  width: `${
                    monthlyBudget > 0
                      ? Math.min(
                          100,
                          (monthlySpending / monthlyBudget) * 100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {showBudgetForm && (
            <form
              onSubmit={handleBudgetSubmit}
              className="mt-6 rounded-xl border border-white/10 bg-slate-800/60 p-5"
            >
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Monthly Budget (₦)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={budgetInput}
                onChange={(event) => setBudgetInput(event.target.value)}
                placeholder="e.g. 100000"
                required
                className={inputStyle}
              />

              <button type="submit" className={`${buttonStyle} mt-4 w-full`}>
                Save Budget
              </button>
            </form>
          )}
        </section>

        {/* Spending by Category */}
        <section id="insights" className={`${cardStyle} mt-8`}>
          <p className="text-sm font-semibold text-cyan-300">
            UNDERSTAND YOUR MONEY
          </p>
          <h3 className="mt-2 text-xl font-bold text-white">
            Spending by Category
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            See how much you have spent in each category.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(categorySpending).map(
              ([categoryName, categoryAmount], index) => (
                <div
                  key={categoryName}
                  className="rounded-xl border border-white/10 bg-slate-800/60 p-5 transition hover:border-purple-400/40 hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          chartColors[index % chartColors.length],
                      }}
                    />
                    <p className="text-sm font-medium text-slate-300">
                      {categoryName}
                    </p>
                  </div>
                  <h4 className="mt-3 break-words text-2xl font-bold text-white">
                    {money(categoryAmount)}
                  </h4>
                </div>
              )
            )}
          </div>

          {loading ? (
            <div className="mt-8 flex h-72 flex-col items-center justify-center gap-3 text-slate-400">
              <div
                className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"
                role="status"
                aria-label="Loading spending chart"
              />
              <p>Loading spending chart...</p>
            </div>
          ) : categoryChartData.length > 0 ? (
            <div className="mt-8 h-80 rounded-xl border border-white/5 bg-slate-950/30 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={3}
                    label
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={chartColors[index % chartColors.length]}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) => money(value)}
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "1px solid #475569",
                      borderRadius: "12px",
                      color: "#FFFFFF",
                    }}
                    itemStyle={{ color: "#E2E8F0" }}
                  />

                  <Legend
                    formatter={(value) => (
                      <span style={{ color: "#CBD5E1" }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-6 rounded-xl bg-slate-800/50 p-5 text-sm text-slate-400">
              Add an expense to see your category chart.
            </p>
          )}
        </section>

        {/* Recent Transactions */}
        <section id="transactions" className={`${cardStyle} mt-8`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-purple-300">
                YOUR MONEY ACTIVITY
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">
                Recent Transactions
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Your latest expenses saved in the database.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (showExpenseForm) {
                  resetExpenseForm()
                } else {
                  setError("")
                  setShowExpenseForm(true)
                }
              }}
              className={buttonStyle}
            >
              {showExpenseForm ? "Close Form" : "+ Add Expense"}
            </button>
          </div>

          {/* Add / Edit Expense Form */}
          {showExpenseForm && (
            <div className="mt-6 rounded-2xl border border-purple-400/20 bg-slate-800/50 p-5 sm:p-6">
              <h4 className="text-lg font-bold text-white">
                {editingExpenseId !== null
                  ? "Edit Expense"
                  : "Add New Expense"}
              </h4>
              <p className="mt-2 text-sm text-slate-400">
                Enter your expense details below.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-5 grid gap-5 sm:grid-cols-2"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Expense Name
                  </label>
                  <input
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
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="e.g. 12000"
                    required
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    required
                    className={inputStyle}
                  >
                    <option value="">Select a category</option>
                    {categories.map((item) => (
                      <option
                        key={item}
                        value={item}
                        className="bg-slate-800"
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                    className={inputStyle}
                  />
                </div>

                <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`${buttonStyle} flex-1`}
                  >
                    {saving
                      ? "Saving..."
                      : editingExpenseId !== null
                        ? "Update Expense"
                        : "Save Expense"}
                  </button>

                  <button
                    type="button"
                    onClick={resetExpenseForm}
                    disabled={saving}
                    className="rounded-xl border border-slate-600 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-700 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search and Category Filter */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search expenses..."
              aria-label="Search expenses"
              className={inputStyle}
            />

            <select
              value={filterCategory}
              onChange={(event) => setFilterCategory(event.target.value)}
              aria-label="Filter expenses by category"
              className={inputStyle}
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                  className="bg-slate-800"
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction List */}
          <div className="mt-6 divide-y divide-white/10">
            {loading ? (
              <div className="flex items-center gap-3 py-8 text-slate-400">
                <div
                  className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"
                  role="status"
                  aria-label="Loading expenses"
                />
                <p>Loading your expenses from FinanceAI...</p>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <p className="rounded-xl bg-slate-800/40 py-8 text-center text-slate-400">
                No expenses found. Add an expense to get started.
              </p>
            ) : (
              filteredExpenses.map((expense, index) => (
                <div
                  key={expense.id}
                  className="flex flex-wrap items-center justify-between gap-4 py-5 transition hover:bg-white/[0.02]"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold"
                      style={{
                        backgroundColor: `${chartColors[index % chartColors.length]}20`,
                        color: chartColors[index % chartColors.length],
                      }}
                    >
                      {expense.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h4 className="break-words font-semibold text-white">
                        {expense.name}
                      </h4>
                      <p className="mt-1 text-sm text-slate-400">
                        {expense.category}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {expense.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <p className="font-bold text-white">
                      -{money(expense.amount)}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleEditExpense(expense)}
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-pink-300 transition hover:bg-pink-400/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <footer className="py-8 text-center text-xs text-slate-500">
          FinanceAI · Make smarter decisions with your money.
        </footer>
      </main>
    </div>
  )
}

export default Dashboard
