
import os
import secrets
from datetime import datetime, timedelta, timezone

from itsdangerous import BadSignature, URLSafeTimedSerializer
from pwdlib import PasswordHash


password_hash = PasswordHash.recommended()

RESET_TOKEN_SECRET = os.getenv("FINANCEAI_RESET_SECRET")

if not RESET_TOKEN_SECRET:
    raise RuntimeError(
        "FINANCEAI_RESET_SECRET must be configured before starting FinanceAI."
    )

serializer = URLSafeTimedSerializer(RESET_TOKEN_SECRET)


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)


def create_reset_token(email: str) -> str:
    return serializer.dumps(
        {"email": email, "nonce": secrets.token_urlsafe(16)},
        salt="financeai-password-reset",
    )


def verify_reset_token(token: str, max_age_seconds: int = 900):
    try:
        return serializer.loads(
            token,
            salt="financeai-password-reset",
            max_age=max_age_seconds,
        )
    except (BadSignature, Exception):
        return None
