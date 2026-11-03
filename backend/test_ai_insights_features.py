from datetime import date

from ai_service import calculate_spending_patterns


def run_tests():
    print("\nFINANCEAI NEW AI FEATURES TEST")
    print("=" * 45)

    # Test 1: Detect a significant category increase.
    expenses = [
        {
            "name": "October groceries",
            "amount": 5000,
            "category": "Food",
            "date": "2026-10-15",
        },
        {
            "name": "November groceries",
            "amount": 9000,
            "category": "Food",
            "date": "2026-11-03",
        },
    ]

    patterns = calculate_spending_patterns(
        expenses,
        budget=8000,
        today=date(2026, 11, 3),
    )

    food = next(
        item for item in patterns["category_changes"]
        if item["category"] == "Food"
    )

    assert food["direction"] == "increase"
    assert food["increase_amount"] == 4000.0
    assert food["increase_percentage"] == 80.0
    assert food["unusual_increase"] is True
    assert len(patterns["unusual_spending"]) == 1

    print("PASS: Unusual spending detection")

    # Test 2: Detect an exceeded budget.
    assert patterns["budget_status"] == "exceeded"
    assert patterns["budget_remaining"] == -1000.0
    assert patterns["budget_usage_percentage"] == 112.5

    print("PASS: Exceeded budget detection")

    # Test 3: Recognise spending within budget.
    within = calculate_spending_patterns(
        expenses,
        budget=20000,
        today=date(2026, 11, 3),
    )

    assert within["budget_status"] == "within_budget"
    assert within["budget_remaining"] == 11000.0
    assert within["budget_usage_percentage"] == 45.0

    print("PASS: Within-budget detection")

    # Test 4: Recognise an approaching budget limit.
    approaching = calculate_spending_patterns(
        expenses,
        budget=11000,
        today=date(2026, 11, 3),
    )

    assert approaching["budget_status"] == "approaching_limit"
    assert approaching["budget_usage_percentage"] == 81.8

    print("PASS: Approaching-budget detection")

    print("\nALL NEW FEATURE TESTS PASSED!")


if __name__ == "__main__":
    run_tests()