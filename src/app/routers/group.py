# routes/group.py
from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from models.group import ViewGroupModel, CreateGroupModel, UpdateGroupModel, IdName
from database import get_db_context
from entities.group import Group
from services import group as GroupService
from services import company as CompanyService
from services import user as UserService
from services.exception import BadRequestError
from models.paginated_list import PaginatedList
from enums.group_type import GroupType

router = APIRouter(prefix="/groups", tags=["Groups"])

@router.get("/search", response_model=PaginatedList[ViewGroupModel])
def search_groups_async(
    pageNumber: int = 1,
    pageSize: int = 10,
    search: Optional[str] = None,
    db: Session = Depends(get_db_context)
):
    return GroupService.get_paginated_groups(pageNumber, pageSize, search, db, selector=to_view_model)

@router.get("/exists", status_code=status.HTTP_200_OK)
def exists_async(name: str, id: Optional[int] = None, db: Session = Depends(get_db_context)):
    if not GroupService.exists(db, name, id):
        return JSONResponse(content={"message": "Not found"}, status_code=status.HTTP_404_NOT_FOUND)
    return JSONResponse(content={"message": "Exists"}, status_code=status.HTTP_200_OK)

@router.get("/{group_id}", status_code=status.HTTP_200_OK, response_model=ViewGroupModel)
def get_group_async(group_id: int, db: Session = Depends(get_db_context)):
    group = GroupService.get_by_id(group_id, db)
    if group is None:
        raise BadRequestError("Group not found")
    return to_view_model(group)

@router.get("/company/{company_id}", response_model=List[IdName])
def get_company_groups_async(company_id: int, db: Session = Depends(get_db_context)):
    groups = GroupService.get_by_company(company_id, db)
    return [to_id_name(group) for group in groups]

@router.post("", status_code=status.HTTP_201_CREATED)
def create_group_async(model: CreateGroupModel, db: Session = Depends(get_db_context)):
    try:
        group_type = GroupType[model.type]
    except KeyError:
        raise BadRequestError("Unsupported group type")
    
    companies = CompanyService.get_many(model.companyIds, db)
    existing_ids = {c.id for c in companies}
    invalid_ids = [cid for cid in model.companyIds if cid not in existing_ids]

    if invalid_ids:
        raise BadRequestError(f"Companies are invalid")
    
    if GroupService.exists(db, model.name):
        raise BadRequestError(f"Group name existed")
    
    group = Group(model.name, group_type)
    group.set_companies(companies)
    
    if (len(model.userIds) > 0):
        users = UserService.get_many(model.userIds, db)
        if users is None or len(users) <= 0:
            raise BadRequestError(f"Users are invalid")
        
        group.add_users(*users)
    
    db.add(group)
    db.commit()
    
    return JSONResponse(content={"message": "Group created successfully"}, status_code=status.HTTP_201_CREATED)

@router.put("/{group_id}", status_code=status.HTTP_200_OK)
def update_group_async(group_id: int, model: UpdateGroupModel, db: Session = Depends(get_db_context)):
    try:
        group_type = GroupType[model.type]
    except KeyError:
        raise BadRequestError("Unsupported group type")
    
    group = GroupService.get_by_id(group_id, db)
    
    if group is None:
        raise BadRequestError("Group not found")
    
    companies = CompanyService.get_many(model.companyIds, db)
    existing_ids = {c.id for c in companies}
    invalid_ids = [cid for cid in model.companyIds if cid not in existing_ids]

    if invalid_ids:
        raise BadRequestError(f"Companies are invalid")
    
    if GroupService.exists(db, model.name, group_id):
        raise BadRequestError(f"Group name existed")
    
    group.update(model.name, group_type, model.active, companies)
    group.remove_users()
    db.flush()
    
    if (len(model.userIds) > 0):
        users = UserService.get_many(model.userIds, db)
        if users is None or len(users) <= 0:
            raise BadRequestError(f"Users are invalid")
        
        group.add_users(*users)
    
    db.add(group)
    db.commit()
    
    return JSONResponse(content={"message": "Group updated successfully"}, status_code=status.HTTP_200_OK)

@router.delete("/{group_id}", status_code=status.HTTP_200_OK)
def delete_group_async(group_id: int, db: Session = Depends(get_db_context)):
    group = GroupService.get_by_id(group_id, db)
    
    if group is None:
        raise BadRequestError("Group not found")
    
    group.remove_users()
    db.delete(group)
    db.commit()
    
    return JSONResponse(content={"message": "Group deleted successfully"}, status_code=status.HTTP_200_OK)

def to_id_name(group: Group) -> IdName:
    return IdName(
        id=str(group.id),
        name=group.name,
    )

def to_view_model(group: Group) -> ViewGroupModel:
    return ViewGroupModel(
        id=group.id,
        name=group.name,
        type=str(group.type),
        companyNames=[cg.company.name for cg in group.companies if cg.company],
        companyIds=[cg.company_id for cg in group.companies],
        userIds=[ug.user_id for ug in group.users],
        active=group.active
    )