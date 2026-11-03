
from datetime import date

from ai_service import calculate_spending_patterns


expenses = [
    {
        "name": "Groceries",
        "amount": 20000,
        "category": "Food",
        "date": "2026-11-02",
    },
    {
        "name": "Transport",
        "amount": 10000,
        "category": "Transport",
        "date": "2026-11-02",
    },
    {
        "name": "School books",
        "amount": 15000,
        "category": "Education",
        "date": "2026-10-15",
    },
    {
        "name": "Lunch",
        "amount": 10000,
        "category": "Food",
        "date": "2026-10-20",
    },
]

patterns = calculate_spending_patterns(
    expenses,
    budget=100000,
    today=date(2026, 11, 2),
)

print("\nFINANCEAI SPENDING PATTERN TEST")
print("=" * 40)

print("Total spending:", patterns["total"])
print("Expense count:", patterns["expense_count"])
print("Highest category:", patterns["highest_category"])
print("Category distribution:", patterns["category_distribution"])
print("Current month:", patterns["current_month_total"])
print("Previous month:", patterns["previous_month_total"])
print("Monthly change:", patterns["monthly_change"])
print("Budget remaining:", patterns["budget_remaining"])

assert patterns["total"] == 55000
assert patterns["expense_count"] == 4
assert patterns["highest_category"]["category"] == "Food"
assert patterns["current_month_total"] == 30000
assert patterns["previous_month_total"] == 25000
assert patterns["monthly_change"]["direction"] == "increase"
assert patterns["monthly_change"]["amount"] == 5000
assert patterns["budget_remaining"] == 70000

print("\nALL TESTS PASSED!")
