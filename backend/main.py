import os
from datetime import date

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field, FiniteFloat, field_validator
from sqlalchemy.orm import Session

from auth import router as auth_router
from database import Base, SessionLocal, engine
from models import Expense, User
from security import verify_access_token


app = FastAPI(title="FinanceAI API")
app.include_router(auth_router)

# Create missing tables when the application starts.
# This does not add columns to existing tables.
Base.metadata.create_all(bind=engine)


frontend_url = os.getenv("FRONTEND_URL", "").rstrip("/")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


bearer_scheme = HTTPBearer(auto_error=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        bearer_scheme
    ),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(
            status_code=401,
            detail="Please log in to access your expenses.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = verify_access_token(credentials.credentials)

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id).first()

    if user is None or not user.is_active:
        raise HTTPException(
            status_code=401,
            detail="User account is unavailable.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


class ExpenseCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    amount: FiniteFloat = Field(gt=0)
    category: str = Field(min_length=1, max_length=50)
    date: date

    @field_validator("name", "category")
    @classmethod
    def validate_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("This field cannot be blank.")

        return value


def expense_response(expense: Expense):
    return {
        "id": expense.id,
        "name": expense.name,
        "amount": expense.amount,
        "category": expense.category,
        "date": expense.date.isoformat(),
    }


@app.get("/")
def home():
    return {
        "message": "Welcome to FinanceAI!",
        "status": "Backend is running",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/expenses", status_code=201)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_expense = Expense(
        name=expense.name,
        amount=expense.amount,
        category=expense.category,
        date=expense.date,
        user_id=current_user.id,
    )

    try:
        db.add(db_expense)
        db.commit()
        db.refresh(db_expense)

        return {
            "message": "Expense saved successfully",
            "expense": expense_response(db_expense),
        }
    except Exception as error:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not save the expense.",
        ) from error


@app.get("/expenses")
def list_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == current_user.id)
        .order_by(Expense.id.desc())
        .all()
    )

    return [expense_response(expense) for expense in expenses]


@app.put("/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == current_user.id,
        )
        .first()
    )

    if db_expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found.",
        )

    db_expense.name = expense.name
    db_expense.amount = expense.amount
    db_expense.category = expense.category
    db_expense.date = expense.date

    try:
        db.commit()
        db.refresh(db_expense)
    except Exception as error:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not update the expense.",
        ) from error

    return {
        "message": "Expense updated successfully",
        "expense": expense_response(db_expense),
    }


@app.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == current_user.id,
        )
        .first()
    )

    if db_expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found.",
        )

    try:
        db.delete(db_expense)
        db.commit()
    except Exception as error:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not delete the expense.",
        ) from error

    return {"message": "Expense deleted successfully"}