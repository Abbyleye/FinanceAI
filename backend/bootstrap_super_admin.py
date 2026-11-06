from dotenv import load_dotenv

load_dotenv()

from database import SessionLocal
from models import User


def bootstrap_super_admin():
    db = SessionLocal()

    try:
        print("\nFinanceAI — Initial Super Admin Setup")
        print("-------------------------------------")

        email = input("\nEnter the registered account email: ").strip().lower()

        if not email:
            print("\nSetup cancelled: email cannot be empty.")
            return

        user = db.query(User).filter(User.email == email).first()

        if user is None:
            print("\nSetup failed: no registered account was found.")
            return

        if not user.is_active:
            print("\nSetup failed: this account is inactive.")
            return

        existing_super_admin = (
            db.query(User).filter(User.role == "super_admin").first()
        )

        if existing_super_admin is not None:
            print("\nSetup stopped: a Super Admin already exists.")
            return

        if user.role not in {"user", "admin"}:
            print("\nSetup failed: the account has an unexpected role.")
            return

        print("\nAccount selected:")
        print(f"Name: {user.full_name}")
        print(f"Email: {user.email}")
        print(f"Current role: {user.role}")

        confirmation = input(
            f'\nType "PROMOTE {email}" to confirm: '
        ).strip()

        if confirmation != f"PROMOTE {email}":
            print("\nSetup cancelled. No changes were made.")
            return

        user.role = "super_admin"
        db.commit()
        db.refresh(user)

        print("\nSuper Admin created successfully.")
        print(f"Account: {user.email}")
        print(f"New role: {user.role}")

    except Exception:
        db.rollback()
        print("\nSetup failed. Database changes were rolled back.")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    bootstrap_super_admin()
