from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship
from database import Base

class UserGroup(Base):
    __tablename__ = "user_groups"

    group_id = Column(Integer, ForeignKey("groups.id"), primary_key=True)
    user_id = Column(UNIQUEIDENTIFIER(as_uuid=True), ForeignKey("users.id"), primary_key=True)

    group = relationship("Group", back_populates="users")
    user = relationship("User", back_populates="groups")
