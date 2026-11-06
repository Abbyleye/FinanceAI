
from unittest.mock import Mock

from fastapi.testclient import TestClient

from database import SessionLocal
from models import User


def register_user(
    client: TestClient,
    email: str = "user@example.com",
    password: str = "SecurePass123",
    full_name: str = "Test User",
):
    return client.post(
        "/auth/register",
        json={
            "full_name": full_name,
            "email": email,
            "password": password,
        },
    )


def login_user(
    client: TestClient,
    email: str = "user@example.com",
    password: str = "SecurePass123",
):
    response = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": password,
        },
    )

    return response


def auth_headers(token: str):
    return {"Authorization": f"Bearer {token}"}


def set_user_role(email: str, role: str):
    """Change a user's role in the isolated test database."""
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.email == email).first()

        assert user is not None, f"Test user {email} was not found."

        user.role = role
        db.commit()
    finally:
        db.close()


def test_health_endpoint_is_public(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_user_can_register(client):
    response = register_user(client)

    assert response.status_code == 201
    assert response.json()["user"]["email"] == "user@example.com"
    assert response.json()["user"]["full_name"] == "Test User"
    assert "password" not in response.json()["user"]
    assert "password_hash" not in response.json()["user"]


def test_registration_normalizes_email_and_name(client):
    response = register_user(
        client,
        email="  ",
        full_name="  Test User  ",
    )

    # An invalid email should be rejected.
    assert response.status_code == 422

    response = register_user(
        client,
        email="USER@EXAMPLE.COM",
        full_name="  Test User  ",
    )

    assert response.status_code == 201
    assert response.json()["user"]["email"] == "user@example.com"
    assert response.json()["user"]["full_name"] == "Test User"


def test_duplicate_email_registration_is_rejected(client):
    first = register_user(client)
    second = register_user(
        client,
        email="USER@EXAMPLE.COM",
    )

    assert first.status_code == 201
    assert second.status_code == 409


def test_user_can_login(client):
    register_user(client)

    response = login_user(client)

    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    assert response.json()["access_token"]
    assert response.json()["user"]["email"] == "user@example.com"


def test_login_rejects_wrong_password(client):
    register_user(client)

    response = login_user(
        client,
        password="WrongPassword123",
    )

    assert response.status_code == 401


def test_expenses_require_authentication(client):
    response = client.get("/expenses")

    assert response.status_code == 401


def test_ai_insights_require_authentication(client):
    response = client.get("/ai/insights")

    assert response.status_code == 401


def test_users_can_only_view_their_own_expenses(client):
    register_user(client)

    first_login = login_user(client)
    first_token = first_login.json()["access_token"]

    first_expense = client.post(
        "/expenses",
        headers=auth_headers(first_token),
        json={
            "name": "Groceries",
            "amount": 5000,
            "category": "Food",
            "date": "2026-11-03",
        },
    )

    assert first_expense.status_code == 201

    register_user(
        client,
        email="another@example.com",
        full_name="Another User",
    )

    second_login = login_user(
        client,
        email="another@example.com",
    )
    second_token = second_login.json()["access_token"]

    second_expense = client.post(
        "/expenses",
        headers=auth_headers(second_token),
        json={
            "name": "Transport",
            "amount": 2000,
            "category": "Transport",
            "date": "2026-11-03",
        },
    )

    assert second_expense.status_code == 201

    first_user_expenses = client.get(
        "/expenses",
        headers=auth_headers(first_token),
    )

    second_user_expenses = client.get(
        "/expenses",
        headers=auth_headers(second_token),
    )

    assert len(first_user_expenses.json()) == 1
    assert first_user_expenses.json()[0]["name"] == "Groceries"

    assert len(second_user_expenses.json()) == 1
    assert second_user_expenses.json()[0]["name"] == "Transport"


def test_user_cannot_update_another_users_expense(client):
    register_user(client)

    first_token = login_user(client).json()["access_token"]

    expense = client.post(
        "/expenses",
        headers=auth_headers(first_token),
        json={
            "name": "Groceries",
            "amount": 5000,
            "category": "Food",
            "date": "2026-11-03",
        },
    ).json()["expense"]

    register_user(
        client,
        email="another@example.com",
    )

    second_token = login_user(
        client,
        email="another@example.com",
    ).json()["access_token"]

    response = client.put(
        f"/expenses/{expense['id']}",
        headers=auth_headers(second_token),
        json={
            "name": "Changed expense",
            "amount": 1000,
            "category": "Food",
            "date": "2026-11-03",
        },
    )

    assert response.status_code == 404


def test_user_cannot_delete_another_users_expense(client):
    register_user(client)

    first_token = login_user(client).json()["access_token"]

    expense = client.post(
        "/expenses",
        headers=auth_headers(first_token),
        json={
            "name": "Groceries",
            "amount": 5000,
            "category": "Food",
            "date": "2026-11-03",
        },
    ).json()["expense"]

    register_user(
        client,
        email="another@example.com",
    )

    second_token = login_user(
        client,
        email="another@example.com",
    ).json()["access_token"]

    response = client.delete(
        f"/expenses/{expense['id']}",
        headers=auth_headers(second_token),
    )

    assert response.status_code == 404


def test_ai_insights_only_receive_current_users_expenses(
    client,
    monkeypatch,
):
    import main

    register_user(client)

    first_token = login_user(client).json()["access_token"]

    client.post(
        "/expenses",
        headers=auth_headers(first_token),
        json={
            "name": "Groceries",
            "amount": 5000,
            "category": "Food",
            "date": "2026-11-03",
        },
    )

    register_user(
        client,
        email="another@example.com",
    )

    second_token = login_user(
        client,
        email="another@example.com",
    ).json()["access_token"]

    client.post(
        "/expenses",
        headers=auth_headers(second_token),
        json={
            "name": "Transport",
            "amount": 2000,
            "category": "Transport",
            "date": "2026-11-03",
        },
    )

    mock_generator = Mock(
        return_value="Your spending is within budget."
    )

    monkeypatch.setattr(
        main,
        "generate_spending_insights",
        mock_generator,
    )

    response = client.get(
        "/ai/insights?budget=10000",
        headers=auth_headers(first_token),
    )

    assert response.status_code == 200
    assert response.json()["expense_count"] == 1

    expenses_sent_to_ai = mock_generator.call_args.args[0]

    assert len(expenses_sent_to_ai) == 1
    assert expenses_sent_to_ai[0]["name"] == "Groceries"
    assert expenses_sent_to_ai[0]["category"] == "Food"


def test_regular_user_cannot_access_admin_overview(client):
    register_user(client)

    token = login_user(client).json()["access_token"]

    response = client.get(
        "/admin/overview",
        headers=auth_headers(token),
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Administrator access required."


def test_admin_can_access_admin_overview(client):
    register_user(client)

    set_user_role("user@example.com", "admin")

    token = login_user(client).json()["access_token"]

    response = client.get(
        "/admin/overview",
        headers=auth_headers(token),
    )

    assert response.status_code == 200
    assert response.json()["total_users"] == 1
    assert response.json()["active_users"] == 1
def test_regular_user_cannot_view_administrators(client):
    register_user(client)

    token = login_user(client).json()["access_token"]

    response = client.get(
        "/admin/administrators",
        headers=auth_headers(token),
    )

    assert response.status_code == 403
    assert response.json()["detail"] == (
        "Super administrator access required."
    )


def test_admin_cannot_view_administrators(client):
    register_user(client)

    set_user_role("user@example.com", "admin")

    token = login_user(client).json()["access_token"]

    response = client.get(
        "/admin/administrators",
        headers=auth_headers(token),
    )

    assert response.status_code == 403


def test_super_admin_can_view_administrators(client):
    register_user(client)

    set_user_role("user@example.com", "super_admin")

    token = login_user(client).json()["access_token"]

    response = client.get(
        "/admin/administrators",
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    administrators = response.json()["administrators"]

    assert len(administrators) == 1
    assert administrators[0]["email"] == "user@example.com"
    assert administrators[0]["role"] == "super_admin"

    assert "password" not in administrators[0]
    assert "password_hash" not in administrators[0]