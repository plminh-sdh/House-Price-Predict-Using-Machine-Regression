from pydantic import BaseModel
from typing import Optional

class CreateProjectModel(BaseModel):
    projectName: str
    companyName: str

class UpdateProjectModel(BaseModel):
    projectName: str

class ViewProjectModel(BaseModel):
    id: int
    projectName: str
    company: str
