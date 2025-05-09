from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class CompanyGroup(Base):
    __tablename__ = "company_groups"

    group_id = Column(Integer, ForeignKey("groups.id"), primary_key=True)
    company_id = Column(Integer, ForeignKey("companies.id"), primary_key=True)

    group = relationship("Group", back_populates="companies")
    company = relationship("Company")
    
    
