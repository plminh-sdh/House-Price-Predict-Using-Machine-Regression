from sqlalchemy import Column, String, Boolean, Integer, ForeignKey
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship
import uuid
from database import Base
from entities.user_login import UserLogin
from entities.user_claim import UserClaim
from entities.user_group import UserGroup
from factories.access_right_factory import AccessRightFactory

from datetime import datetime, timezone

class User(Base):
    __tablename__ = "users"

    # Identity / Account Info
    id = Column(UNIQUEIDENTIFIER(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(250), unique=True, nullable=False, index=True)
    username = Column(String(250), unique=True, nullable=False)
    full_name = Column(String(250), nullable=False)
    password_hash = Column(String(512))

    # Domain fields
    active = Column(Boolean, default=False)

    # Company relationship
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="NO ACTION"), nullable=False)
    company = relationship("Company")

    # Collections
    claims = relationship("UserClaim", cascade="all, delete-orphan")
    logins = relationship("UserLogin", back_populates="user", cascade="all, delete-orphan")
    groups = relationship("UserGroup", back_populates="user", cascade="all, delete-orphan")

    def __init__(self, email: str, full_name: str, company, active: bool = True):
        self.id = uuid.uuid4()
        self.email = email
        self.username = email
        self.full_name = full_name
        self.company = company
        self.company_id = company.id
        self.active = active
        # Hardcode password
        self.password_hash = "$2b$12$llw5qjtlMmwqV4DP52ctU.dEWW7n7dh.xN.akuwrtxo7BB/nIs2ya"
        self.claims = []
        self.logins = []
        self.groups = []
    
    def update(self, full_name: str, company_id: int, active: bool):
        self.full_name = full_name
        self.company_id = company_id
        self.active = active
    
    def login(self, refresh_token: str, expires_on: datetime):
        """Logs in the user with a new refresh token, deactivating the old one."""
        self.logout()
        login = UserLogin(user=self, created_on=datetime.now(timezone.utc), refresh_token=refresh_token, expires_on=expires_on)
        self.logins.append(login)

    def logout(self):
        """Deactivates the current active login (if any)."""
        current_login = next((l for l in self.logins if l.active), None)
        if current_login:
            current_login.deactivate()

    def validate_refresh_token(self, refresh_token: str) -> bool:
        if not refresh_token:
            return False
        token = next((l for l in self.logins if l.refresh_token == refresh_token), None)
        if not token or not token.expires_on:
            return False

        # Convert naive datetime to UTC-aware if needed
        expires_on = token.expires_on
        if expires_on.tzinfo is None:
            expires_on = expires_on.replace(tzinfo=timezone.utc)

        return datetime.now(timezone.utc) <= expires_on

    def join_group(self, group):
        actions = AccessRightFactory.get_actions(group.type)
        for action in actions:
            self.claims.append(UserClaim(user=self, group=group, action=action))
        self.groups.append(UserGroup(user=self, group=group))

    def join_groups(self, *groups):
        self.groups.clear()
        self.claims.clear()
        for group in groups:
            self.join_group(group)
    
    def leave_groups(self, *groups):
        group_ids_to_remove = {g.id for g in groups}
        
        self.claims = [claim for claim in self.claims if claim.group_id not in group_ids_to_remove]
        self.groups = [ug for ug in self.groups if ug.group_id not in group_ids_to_remove]