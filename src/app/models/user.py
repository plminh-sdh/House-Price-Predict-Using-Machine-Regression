from typing import Optional, List
from pydantic import BaseModel
from uuid import UUID

class UserViewModel(BaseModel):
    id: UUID 
    email: str
    fullName: str
    companyId: int
    actions: Optional[List[str]] = None
    token: Optional[str] = None
    refreshToken: Optional[str] = None
    
    class Config:
        from_attributes = True

class UsersViewModel(BaseModel):
    id: UUID
    email: str
    fullName: str
    companyId: int
    companyName: str
    groupNames: List[str]
    groupIds: List[int]
    active: bool

class SearchUserModel(BaseModel):
    searchText: Optional[str] = None
    currentPage: int = 1
    pageSize: int = 10
       
class IdName(BaseModel):
    id: str
    name: str
    
class CreateUserModel(BaseModel):
    email: str
    fullName: str
    companyId: int
    groupIds: List[int]

class UpdateUserModel(BaseModel):
    fullName: str
    companyId: int
    groupIds: List[int]
    active: bool