import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

function Dashboard() {
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showBudgetForm, setShowBudgetForm] = useState(false)

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("financeai_expenses")

    if (savedExpenses) {
      return JSON.parse(savedExpenses)
    }

    return [
      {
        id: 1,
        name: "Groceries",
        amount: 12000,
        category: "Food",
        date: "2026-10-07",
      },
      {
        id: 2,
        name: "Uber",
        amount: 5500,
        category: "Transport",
        date: "2026-10-06",
      },
      {
        id: 3,
        name: "Data",
        amount: 3000,
        category: "Airtime",
        date: "2026-10-05",
      },
      {
        id: 4,
        name: "Textbook",
        amount: 8000,
        category: "Education",
        date: "2026-10-04",
      },
    ]
  })

  useEffect(() => {
    localStorage.setItem(
      "financeai_expenses",
      JSON.stringify(expenses)
    )
  }, [expenses])

  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const savedBudget = localStorage.getItem("financeai_budget")

    if (savedBudget) {
      return Number(savedBudget)
    }

    return 100000
  })

  useEffect(() => {
    localStorage.setItem(
      "financeai_budget",
      monthlyBudget.toString()
    )
  }, [monthlyBudget])

  const [budgetInput, setBudgetInput] = useState("")

  const [expenseName, setExpenseName] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState("")

  const [editingExpenseId, setEditingExpenseId] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  /* Calculate total expenses */
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  )

  /* Calculate monthly spending */
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const monthlySpending = expenses.reduce(
    (total, expense) => {
      const expenseDate = new Date(expense.date)

      if (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      ) {
        return total + expense.amount
      }

      return total
    },
    0
  )

  /* Calculate remaining budget */
  const budgetRemaining = monthlyBudget - monthlySpending

  /* Calculate spending by category */
  const categorySpending = expenses.reduce(
    (categories, expense) => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0
      }

      categories[expense.category] += expense.amount

      return categories
    },
    {}
  )

  /* Prepare category data for the pie chart */
  const categoryChartData = Object.entries(categorySpending).map(
    ([categoryName, categoryAmount]) => ({
      name: categoryName,
      value: categoryAmount,
    })
  )
  const filteredExpenses = expenses.filter((expense) => {
  const matchesSearch = expense.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase())

  const matchesCategory =
    filterCategory === "" ||
    expense.category === filterCategory

  return matchesSearch && matchesCategory
})

  /* Colors for the pie chart */
  const chartColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ]

  /* Save monthly budget */
  const handleBudgetSubmit = (event) => {
    event.preventDefault()

    if (!budgetInput) {
      return
    }

    setMonthlyBudget(Number(budgetInput))
    setBudgetInput("")
    setShowBudgetForm(false)
  }

  /* Save or update expense */
  const handleSubmit = (event) => {
    event.preventDefault()

    if (!expenseName || !amount || !category || !date) {
      return
    }

    if (editingExpenseId !== null) {
      setExpenses((currentExpenses) =>
        currentExpenses.map((expense) =>
          expense.id === editingExpenseId
            ? {
                ...expense,
                name: expenseName,
                amount: Number(amount),
                category: category,
                date: date,
              }
            : expense
        )
      )

      setEditingExpenseId(null)
    } else {
      const newExpense = {
        id: Date.now(),
        name: expenseName,
        amount: Number(amount),
        category: category,
        date: date,
      }

      setExpenses((currentExpenses) => [
        newExpense,
        ...currentExpenses,
      ])
    }

    setExpenseName("")
    setAmount("")
    setCategory("")
    setDate("")

    setShowExpenseForm(false)
  }

  /* Delete expense */
  const handleDeleteExpense = (expenseId) => {
    setExpenses((currentExpenses) =>
      currentExpenses.filter(
        (expense) => expense.id !== expenseId
      )
    )
  }

  /* Edit expense */
  const handleEditExpense = (expenseId) => {
    const expenseToEdit = expenses.find(
      (expense) => expense.id === expenseId
    )

    if (!expenseToEdit) {
      return
    }

    setExpenseName(expenseToEdit.name)
    setAmount(expenseToEdit.amount)
    setCategory(expenseToEdit.category)
    setDate(expenseToEdit.date)

    setEditingExpenseId(expenseId)
    setShowExpenseForm(true)
  }

  /* Cancel editing */
  const handleCancelEdit = () => {
    setExpenseName("")
    setAmount("")
    setCategory("")
    setDate("")
    setEditingExpenseId(null)
    setShowExpenseForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-sm">

        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">
            FinanceAI
          </h1>
        </div>

        <nav className="mt-4 px-4">

          <a
            href="/dashboard"
            className="block rounded-lg bg-blue-50 px-4 py-3 font-medium text-blue-600"
          >
            Dashboard
          </a>

          <a
            href="#"
            className="mt-2 block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100"
          >
            Expenses
          </a>

          <a
            href="#"
            className="mt-2 block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100"
          >
            Budgets
          </a>

          <a
            href="#"
            className="mt-2 block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100"
          >
            Insights
          </a>

        </nav>

      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">

        <h2 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h2>

        <p className="mt-2 text-gray-600">
          Welcome back! Here's an overview of your finances.
        </p>

        {/* Summary Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* Total Balance */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Balance
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              ₦250,000
            </h3>
          </div>

          {/* Total Expenses */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Expenses
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              ₦{totalExpenses.toLocaleString()}
            </h3>
          </div>

          {/* Monthly Spending */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Monthly Spending
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              ₦{monthlySpending.toLocaleString()}
            </h3>
          </div>

          {/* Budget Remaining */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Budget Remaining
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              ₦{budgetRemaining.toLocaleString()}
            </h3>
          </div>

        </div>

        {/* Monthly Budget */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Monthly Budget
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Your current monthly budget is ₦
                {monthlyBudget.toLocaleString()}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowBudgetForm(!showBudgetForm)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {showBudgetForm ? "Close" : "Set Budget"}
            </button>

          </div>

          {/* Budget Form */}
          {showBudgetForm && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6">

              <h4 className="text-lg font-bold text-gray-900">
                Set Monthly Budget
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                Enter the amount you want to budget for this month.
              </p>

              <form
                onSubmit={handleBudgetSubmit}
                className="mt-5"
              >

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Monthly Budget
                </label>

                <input
                  type="number"
                  value={budgetInput}
                  onChange={(event) =>
                    setBudgetInput(event.target.value)
                  }
                  placeholder="e.g. 100000"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <button
                  type="submit"
                  className="mt-4 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Save Budget
                </button>

              </form>

            </div>
          )}

        </div>

        {/* Spending by Category */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Spending by Category
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              See how much you have spent in each category.
            </p>
          </div>

          {/* Category Cards */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {Object.entries(categorySpending).map(
              ([categoryName, categoryAmount]) => (

                <div
                  key={categoryName}
                  className="rounded-xl border border-gray-200 p-5"
                >

                  <p className="text-sm font-medium text-gray-500">
                    {categoryName}
                  </p>

                  <h4 className="mt-2 text-2xl font-bold text-gray-900">
                    ₦{categoryAmount.toLocaleString()}
                  </h4>

                </div>

              )
            )}

          </div>

          {/* Pie Chart */}
          <div className="mt-8 h-80">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={categoryChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >

                  {categoryChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        chartColors[
                          index % chartColors.length
                        ]
                      }
                    />
                  ))}

                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `₦${Number(value).toLocaleString()}`
                  }
                />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Recent Transactions */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Recent Transactions
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Your latest expenses
              </p>
              <div className="mt-5">

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search expenses..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (editingExpenseId !== null) {
                  handleCancelEdit()
                } else {
                  setShowExpenseForm(!showExpenseForm)
                }
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {showExpenseForm ? "Close Form" : "Add Expense"}
            </button>

          </div>

          {/* Add / Edit Expense Form */}
          {showExpenseForm && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6">

              <h4 className="text-lg font-bold text-gray-900">
                {editingExpenseId !== null
                  ? "Edit Expense"
                  : "Add New Expense"}
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                {editingExpenseId !== null
                  ? "Update your expense details below."
                  : "Enter your expense details below."}
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-5 grid gap-5 md:grid-cols-2"
              >

                {/* Expense Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Expense Name
                  </label>

                  <input
                    type="text"
                    value={expenseName}
                    onChange={(event) =>
                      setExpenseName(event.target.value)
                    }
                    placeholder="e.g. Groceries"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Amount
                  </label>

                  <input
                    type="number"
                    value={amount}
                    onChange={(event) =>
                      setAmount(event.target.value)
                    }
                    placeholder="e.g. 12000"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">
                      Select a category
                    </option>

                    <option value="Food">
                      Food
                    </option>

                    <option value="Transport">
                      Transport
                    </option>

                    <option value="Education">
                      Education
                    </option>

                    <option value="Airtime">
                      Airtime
                    </option>

                    <option value="Clothing">
                      Clothing
                    </option>

                    <option value="Giving">
                      Giving
                    </option>

                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Date
                  </label>

                  <input
                    type="date"
                    value={date}
                    onChange={(event) =>
                      setDate(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                {/* Save / Update Button */}
                <div className="md:col-span-2">

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    {editingExpenseId !== null
                      ? "Update Expense"
                      : "Save Expense"}
                  </button>

                </div>

                {/* Cancel Button */}
                {editingExpenseId !== null && (
                  <div className="md:col-span-2">

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full rounded-lg border border-gray-300 bg-white py-3 font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>

                  </div>
                )}

              </form>

            </div>
          )}

          {/* Transaction List */}
          <div className="mt-6 divide-y divide-gray-100">

            {filteredExpenses.map((expense) => (

              <div
                key={expense.id}
                className="flex items-center justify-between py-4"
              >

                <div>
                  <h4 className="font-semibold text-gray-900">
                    {expense.name}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {expense.category}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {expense.date}
                  </p>
                </div>

                {/* Amount and Action Buttons */}
                <div className="flex items-center gap-4">

                  <p className="font-semibold text-gray-900">
                    -₦{expense.amount.toLocaleString()}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleEditExpense(expense.id)
                    }
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteExpense(expense.id)
                    }
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </main>

    </div>
  )
}

export default Dashboard