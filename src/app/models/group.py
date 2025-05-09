from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field

class IdName(BaseModel):
    id: str
    name: str

class ViewGroupModel(BaseModel):
    id: int
    name: str
    type: str
    companyNames: Optional[List[str]] = None
    companyIds: Optional[List[int]] = None
    userIds: Optional[List[UUID]] = None
    active: bool

class CreateGroupModel(BaseModel):
    name: str
    type: str
    companyIds: List[int]
    userIds: List[UUID] = Field(default_factory=list)

class UpdateGroupModel(BaseModel):
    name: str
    type: str
    companyIds: List[int]
    userIds: List[UUID] = Field(default_factory=list)
    active: bool
