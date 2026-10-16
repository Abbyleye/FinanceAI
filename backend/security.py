import os
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from itsdangerous import BadSignature, URLSafeTimedSerializer
from pwdlib import PasswordHash


password_hash = PasswordHash.recommended()

RESET_TOKEN_SECRET = os.getenv("FINANCEAI_RESET_SECRET")
ACCESS_TOKEN_SECRET = os.getenv("FINANCEAI_ACCESS_SECRET")

if not RESET_TOKEN_SECRET:
    raise RuntimeError(
        "FINANCEAI_RESET_SECRET must be configured before starting FinanceAI."
    )

if not ACCESS_TOKEN_SECRET:
    raise RuntimeError(
        "FINANCEAI_ACCESS_SECRET must be configured before starting FinanceAI."
    )

serializer = URLSafeTimedSerializer(RESET_TOKEN_SECRET)

ACCESS_TOKEN_EXPIRE_MINUTES = 30
ACCESS_TOKEN_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)


def create_access_token(user_id: int) -> str:
    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "jti": secrets.token_urlsafe(16),
    }

    return jwt.encode(
        payload,
        ACCESS_TOKEN_SECRET,
        algorithm=ACCESS_TOKEN_ALGORITHM,
    )


def verify_access_token(token: str) -> int | None:
    try:
        payload = jwt.decode(
            token,
            ACCESS_TOKEN_SECRET,
            algorithms=[ACCESS_TOKEN_ALGORITHM],
            options={"require": ["sub", "exp"]},
        )

        subject = payload.get("sub")

        if not isinstance(subject, str):
            return None

        user_id = int(subject)

        if user_id <= 0:
            return None

        return user_id

    except (jwt.InvalidTokenError, ValueError, TypeError):
        return None


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
