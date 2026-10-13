
from datetime import date
from typing import Literal

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, FiniteFloat, field_validator
from sqlalchemy.orm import Session

from database import Base, SessionLocal, engine
from models import Expense
from auth import router as auth_router

app = FastAPI(title="FinanceAI API")
app.include_router(auth_router)

# Create database tables when the application starts
Base.metadata.create_all(bind=engine)

# Allow our React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Open a database session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Validate incoming expense information
class ExpenseCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Expense name cannot be blank.")

        return value
    amount: FiniteFloat = Field(gt=0)
    category: Literal[
        "Food",
        "Transport",
        "Education",
        "Airtime",
        "Clothing",
        "Giving",
    ]
    date: date


# Format database expenses for API responses
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


# Save an expense to SQLite
@app.post("/expenses", status_code=201)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
):
    db_expense = Expense(
        name=expense.name,
        amount=expense.amount,
        category=expense.category,
        date=expense.date,
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


# Retrieve all saved expenses
@app.get("/expenses")
def list_expenses(db: Session = Depends(get_db)):
    expenses = db.query(Expense).order_by(Expense.id.desc()).all()

    return [expense_response(expense) for expense in expenses]

@app.put("/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
):
    db_expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

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
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not update the expense.",
        )

    return {
        "message": "Expense updated successfully",
        "expense": expense_response(db_expense),
    }


@app.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
):
    db_expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    if db_expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found.",
        )

    db.delete(db_expense)
    db.commit()

    return {"message": "Expense deleted successfully"}