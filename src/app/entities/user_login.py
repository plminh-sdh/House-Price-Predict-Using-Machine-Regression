from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship
from database import Base

class UserLogin(Base):
    __tablename__ = "user_logins"

    id = Column(Integer, primary_key=True)
    user_id = Column(UNIQUEIDENTIFIER(as_uuid=True), ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="logins")
    refresh_token = Column(String, nullable=False)
    expires_on = Column(DateTime)
    created_on = Column(DateTime)
    active = Column(Boolean, default=True)

    login_provider = Column(String, default="LOCAL")
    provider_key = Column(String)
    
    def deactivate(self):
        self.active = False
