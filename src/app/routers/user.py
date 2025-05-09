from uuid import UUID
from starlette import status
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import get_db_context

from typing import Dict, Union, List
from entities.company import Company
from entities.user import User
from models.user import IdName, UsersViewModel, SearchUserModel, CreateUserModel, UpdateUserModel
from models.paginated_list import PaginatedList
from services.auth import authorizer
from services import user as UserService
from services import company as CompanyService
from services import group as GroupService
from urllib.parse import unquote
from services.exception import BadRequestError

from fastapi import Query
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/companies", status_code=status.HTTP_200_OK, response_model=List[IdName])
async def get_by_company_ids_async(
    ids: List[int] = Query(...),  
    db: Session = Depends(get_db_context),
    # user_claims: Dict[str, Union[str, int]] = Depends(authorizer)
):  
    if ids is None or len(ids) == 0:
        raise BadRequestError("CompanyIds are required")    
    
    users = UserService.get_users_of_company(ids, db)
    
    return [to_id_name(user) for user in users]

@router.get("", status_code=status.HTTP_200_OK, response_model=List[IdName])
async def get_all_async(
    db: Session = Depends(get_db_context)
    # user_claims: Dict[str, Union[str, int]] = Depends(authorizer)
):
    users = UserService.get_all_users(db)
    return [to_id_name(user) for user in users]

@router.get("/search", status_code=status.HTTP_200_OK, response_model=PaginatedList[UsersViewModel])
async def search_async(
    model: SearchUserModel = Depends(),
    db: Session = Depends(get_db_context)
    # user_claims: Dict[str, Union[str, int]] = Depends(authorizer)
):
    return UserService.get_paginated_users(model=model, db=db, selector=to_users_view_model)

@router.get("/{user_id}", status_code=status.HTTP_200_OK, response_model=UsersViewModel)
async def get_async(
    user_id: UUID, 
    db: Session = Depends(get_db_context),
    # user_claims: Dict[str, Union[str, int]] = Depends(authorizer)
):
    user = UserService.get_user_by_id(user_id, db)
    
    return to_users_view_model(user)

@router.get("/exist/{email}", status_code=status.HTTP_200_OK, response_model=UsersViewModel)
async def check_existing_user_async(
    email: str, 
    db: Session = Depends(get_db_context),
    # user_claims: Dict[str, Union[str, int]] = Depends(authorizer)
):
    decoded_email = unquote(email)
    existed = UserService.exist_email(decoded_email, db)
    
    if existed:
        return JSONResponse(content={"message": "User already exists"}, status_code=status.HTTP_404_NOT_FOUND)
    return JSONResponse(content={"message": "User does not exist"}, status_code=status.HTTP_200_OK)

@router.post("", status_code=status.HTTP_200_OK)
async def create_async(
    model: CreateUserModel, 
    db: Session = Depends(get_db_context),
    # user_claims: Dict[str, Union[str, int]] = Depends(authorizer)
):
    existed = UserService.exist_email(model.email, db)
    
    if existed:
        raise BadRequestError("Email already exists")
    
    company = CompanyService.get_company_by_id(model.companyId, db)
    if company is None:
        raise BadRequestError("Company not found")
    
    groups = GroupService.get_by_ids(model.groupIds, db)
    if any(group_id not in [g.id for g in groups] for group_id in model.groupIds):
        raise BadRequestError("Invalid group ids")
    
    user = User(model.email, model.fullName, company, True)
    user.join_groups(*groups)
    db.add(user)
    db.commit()
    
    return JSONResponse(content={"message": "User created successfully"}, status_code=status.HTTP_200_OK)

@router.put("/{user_id}", status_code=status.HTTP_200_OK)
async def update_async(
    user_id: UUID, 
    model: UpdateUserModel, 
    db: Session = Depends(get_db_context),
    # user_claims: Dict[str, Union[str, int]] = Depends(authorizer)
):  
    company = CompanyService.get_company_by_id(model.companyId, db)
    if company is None:
        raise BadRequestError("Company not found")
    
    groups = GroupService.get_by_ids(model.groupIds, db)
    if any(group_id not in [g.id for g in groups] for group_id in model.groupIds):
        raise BadRequestError("Invalid group ids")
    
    user = UserService.get_user_by_id(user_id, db)
    
    user.update(model.fullName, model.companyId, model.active)
    user.join_groups(*groups)
    db.add(user)
    db.commit()
    
    return JSONResponse(content={"message": "User updated successfully"}, status_code=status.HTTP_200_OK)

@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
async def delete_async(
    user_id: UUID,  
    db: Session = Depends(get_db_context),
    # user_claims: Dict[str, Union[str, int]] = Depends(authorizer)
):  
    user = UserService.get_user_by_id(user_id, db)
    if user is None:
        raise BadRequestError("User not found")    
    
    db.delete(user)
    db.commit()
    
    return JSONResponse(content={"message": "User deleted successfully"}, status_code=status.HTTP_200_OK)

def to_id_name(user: User) -> IdName:
    return IdName(
        id=str(user.id),
        name=user.full_name,
    )

def to_users_view_model(user: User) -> UsersViewModel:
    return UsersViewModel(
        id=user.id,
        email=user.email,
        fullName=user.full_name,
        companyId=user.company_id,
        companyName=user.company.name if user.company else "",
        groupNames=[g.group.name for g in user.groups if g.group],
        groupIds=[g.group_id for g in user.groups],
        active=user.active
    )