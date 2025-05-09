from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship
from database import Base

class UserClaim(Base):
    __tablename__ = "user_claims"

    id = Column(Integer, primary_key=True, autoincrement=True)

    user_id = Column(UNIQUEIDENTIFIER(as_uuid=True), ForeignKey("users.id"), nullable=False)
    claim_type = Column(String, nullable=False)
    claim_value = Column(String, nullable=False)

    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    group = relationship("Group")
    
    def __init__(self, user, group, action):
        self.user_id = str(user.id)
        self.claim_type = str(action)
        self.claim_value = "True"
        self.group_id = group.id
        self.group = group
