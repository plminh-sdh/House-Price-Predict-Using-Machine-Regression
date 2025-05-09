from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(500), unique=True, nullable=False)
    
    projects = relationship("Project", back_populates="company", cascade="all, delete-orphan")
