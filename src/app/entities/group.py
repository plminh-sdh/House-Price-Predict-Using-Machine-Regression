from sqlalchemy import Column, Integer, String, Boolean, Enum as PgEnum
from sqlalchemy.orm import relationship
from database import Base
from enums.group_type import GroupType
from entities.company import Company
from entities.company_group import CompanyGroup
from entities.user import UserGroup
from typing import List

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(250), unique=True, nullable=False)
    type = Column(PgEnum(GroupType), nullable=False)
    active = Column(Boolean, default=True)

    users = relationship("UserGroup", back_populates="group", cascade="all, delete-orphan")
    companies = relationship("CompanyGroup", back_populates="group", cascade="all, delete-orphan")
    
    def __init__(self, name: str, type: GroupType):
        self.name = name
        self.type = type
    
    def set_companies(self, companies: List[Company]):
        self.companies = [CompanyGroup(company=company, group=self) for company in companies]
    
    def add_users(self, *users):
        for user in users:
            user.join_group(self)
    
    def remove_users(self):
        for user_group in self.users:
            if user_group.user:
                user_group.user.leave_groups(self)
        self.users.clear()
    
    def update(self, name: str, type: GroupType, active: bool, companies: List[Company]):
        self.name = name
        self.type = type
        self.active = active
        self.set_companies(companies)