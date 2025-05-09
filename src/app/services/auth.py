from jose import jwt
from jose.exceptions import JWTError
from passlib.context import CryptContext
from datetime import datetime, timezone, timedelta
from enum import Enum
from typing import Annotated, Optional
from jwt import InvalidTokenError
from typing import Dict, Tuple, Union

from sqlalchemy import select
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, OAuth2PasswordBearer

from entities.user import User
from services.exception import UnAuthorizedError
from services.utils import get_current_timestamp
from settings import JWT_SECRET_KEY, JWT_ALGORITHM, JWT_TTL_HOURS, JWT_CLIENT_ID, JWT_AUTHORITY

bcrypt_context = CryptContext(schemes=["bcrypt"])

class LocalAuthorizer:
    security_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
    
    def __init__(self) -> None:
        pass

    def __call__(self, token: Annotated[str, Depends(security_scheme)] = None):
        if not token:
            raise UnAuthorizedError()
        
        try:
            claims = jwt.decode(
                token,
                key=JWT_SECRET_KEY,
                algorithms=[JWT_ALGORITHM],
                options={
                    "verify_aud": False,
                    "verify_iss": False,
                    "verify_exp": True,
                }
            )
            return claims

        except jwt.JWTError as err:
            print(err)
            raise UnAuthorizedError()

authorizer = LocalAuthorizer()

def get_password_hash(password):
    return bcrypt_context.hash(password)

def verify_password(plain_password, password_hash):
    return bcrypt_context.verify(plain_password, password_hash)

class TokenGenerator:
    def __init__(self):
        self.secret_key = JWT_SECRET_KEY
        self.algorithm = JWT_ALGORITHM
        self.client_id = JWT_CLIENT_ID
        self.issuer = JWT_AUTHORITY
        self.ttl_hours = float(JWT_TTL_HOURS or 1)

    def generate_token(self, user: User) -> str:
        claims = self.get_claims(user)
        return self._generate_token(claims)

    def get_claims(self, user: User) -> Dict[str, Union[str, int]]:
        claims = {
            "uid": str(user.id),
            "email": user.email,
            "name": user.full_name,
            "company_id": user.company_id,
            "aud": self.client_id,
            "iss": self.issuer,
            "jti": str(user.id),
            "sub": str(user.id),
        }
        for claim in getattr(user, "claims", []):
            if claim.claim_type not in claims:
                claims[claim.claim_type] = claim.claim_value
        return claims

    def generate_refresh_token(self) -> Tuple[str, datetime]:
        from secrets import token_urlsafe
        expires = datetime.now(timezone.utc) + timedelta(hours=self.ttl_hours)
        return token_urlsafe(32), expires

    def get_principal(self, token: str):
        try:
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm],
                audience=self.client_id,
                issuer=self.issuer,
                options={"verify_exp": False},  # we disable expiry validation here
            )
            return payload
        except JWTError as e:
            raise HTTPException(status_code=401, detail="Invalid token") from e

    def _generate_token(self, claims: Dict[str, Union[str, int]]) -> str:
        expiration = datetime.now(timezone.utc) + timedelta(hours=self.ttl_hours / 2)
        claims["exp"] = expiration
        return jwt.encode(claims, self.secret_key, algorithm=self.algorithm)

def authenticate_user(username: str, password: str, db: Session):
    user = db.scalars(select(User).filter(User.username == username)).first()

    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user