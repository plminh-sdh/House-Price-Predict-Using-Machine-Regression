from uuid import UUID
from typing import List, Callable, Optional
from sqlalchemy import exists, select, or_, func
from sqlalchemy.orm import Session, joinedload, aliased

from entities.user import User
from entities.company import Company
# from models.user import CreateUserModel, SearchUserModel, UpdateUserModel
from models.user import SearchUserModel, UsersViewModel
from models.paginated_list import PaginatedList
from services import utils
# from services import company as CompanyService
from services.exception import ResourceNotFoundError, InvalidInputError

def get_all_users(db: Session):
    return db.scalars(select(User)).all()

def get_paginated_users(
    model: SearchUserModel, 
    db: Session,
    selector: Optional[Callable[[User], UsersViewModel]] = None
) -> List[User]:
    query = select(User).options(joinedload(User.company), joinedload(User.groups))
    
    if model.searchText is not None:
        search_pattern = f"%{model.searchText}%"
        company_alias = aliased(Company)

        query = query.join(company_alias, User.company).where(
            or_(
                User.full_name.ilike(search_pattern),
                User.email.ilike(search_pattern),
                company_alias.name.ilike(search_pattern)
            )
        )
        
    count_query = select(func.count()).select_from(User)
    if query.whereclause is not None:
        count_query = count_query.where(query.whereclause)
    total_count = db.scalar(count_query)
    
    result = db.execute(
        query.order_by(User.id)
        .offset((model.currentPage - 1) * model.pageSize)
        .limit(model.pageSize)
    ).unique().scalars().all()
    
    items = [selector(u) for u in result] if selector else result

    return PaginatedList[UsersViewModel].create(
        items=items,
        total_count=total_count,
        page_number=model.currentPage,
        page_size=model.pageSize
    )

def get_user_by_id(user_id: UUID, db: Session) -> User:
    return db.scalars(select(User).filter(User.id == user_id)).first()

def get_user_by_email(email: str, db: Session) -> User:
    return db.scalars(select(User).filter(User.email == email)).first()

def exist_email(email: str, db: Session) -> bool:
    return db.scalars(select(User).where(User.email == email)).first() is not None

def get_users_of_company(company_ids: List[int], db: Session) -> List[User]:
    if not company_ids:
        return []

    query = (
        select(User)
        .where(User.company_id.in_(company_ids))
        .order_by(User.id)
    )

    result = db.execute(query).unique().scalars().all()
    return result

def get_many(ids: List[int], db: Session) -> List[User]:
    return db.scalars(
        select(User).where(User.id.in_(ids))
    ).all()