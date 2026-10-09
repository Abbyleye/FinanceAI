from fastapi import FastAPI

app = FastAPI(title="FinanceAI API")


@app.get("/")
def home():
    return {
        "message": "Welcome to FinanceAI!",
        "status": "Backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }