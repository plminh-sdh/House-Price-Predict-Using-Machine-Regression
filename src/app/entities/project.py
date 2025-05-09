from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(500), nullable=False, unique=True)

    company_id = Column(Integer, ForeignKey("companies.id", ondelete="NO ACTION"), nullable=False)
    company = relationship("Company", back_populates="projects")
    
    def update_details(self, name: str):
        self.name = name