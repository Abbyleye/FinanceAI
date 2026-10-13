
from database import Base, engine
from models import Expense

Base.metadata.create_all(bind=engine)

print("FinanceAI database and tables created successfully!")