import os
import shutil
import tempfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Use isolated secrets for automated tests.
# These values exist only in this test process.
os.environ["FINANCEAI_RESET_SECRET"] = (
    "financeai-test-only-reset-secret-not-for-production"
)
os.environ["FINANCEAI_ACCESS_SECRET"] = (
    "financeai-test-only-access-secret-not-for-production"
)

# Give automated tests their own temporary database.
TEST_DB_DIR = tempfile.mkdtemp(prefix="financeai-tests-")
TEST_DB_PATH = Path(TEST_DB_DIR) / "test_financeai.db"

os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH.as_posix()}"

# Import the application only after setting the test database URL.
import auth
import main
from database import Base, SessionLocal, engine


@pytest.fixture(autouse=True)
def clean_test_database():
    """Give every test a fresh database."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    yield

    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    """Provide a test client using the temporary database."""

    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    main.app.dependency_overrides[main.get_db] = override_get_db
    main.app.dependency_overrides[auth.get_db] = override_get_db

    with TestClient(main.app) as test_client:
        yield test_client

    main.app.dependency_overrides.clear()


def pytest_sessionfinish(session, exitstatus):
    """Remove the temporary test database after the test session."""
    engine.dispose()
    shutil.rmtree(TEST_DB_DIR, ignore_errors=True)
