from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from jwt import PyJWTError

from utils.config import settings


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    # Ensure at least 60 min; cap at 30 days to avoid 32-bit overflow
    minutes = max(60, min(settings.TOKEN_EXPIRE_MINUTES, 43200))
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=minutes))
    to_encode.update({"exp": int(expire.timestamp())})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str):
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except PyJWTError:
        return None