from typing import List, Optional, Callable
from sqlalchemy import select, or_, func
from sqlalchemy.orm import Session, joinedload
from models.group import ViewGroupModel
from models.paginated_list import PaginatedList

from entities.group import Group
from entities.company_group import CompanyGroup

def get_by_id(id: int, db: Session) -> Group:
    return db.scalars(select(Group).filter(Group.id == id)).first()

def get_by_ids(ids: List[int], db: Session) -> List[Group]:
    stmt = select(Group).where(Group.id.in_(ids)).options(joinedload(Group.users))
    result = db.execute(stmt).unique()
    return result.scalars().all()

def get_paginated_groups(
    page_number: int,
    page_size: int,
    search: Optional[str],
    db: Session,
    selector: Optional[Callable[[Group], ViewGroupModel]] = None
):
    query = (
        select(Group)
        .options(
            joinedload(Group.companies).joinedload(CompanyGroup.company),
            joinedload(Group.users)
        )
    )

    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                Group.name.ilike(search_pattern),
                func.cast(Group.type, str).ilike(search_pattern),
                func.cast(Group.active, str).ilike(search_pattern),
            )
        )

    count_query = select(func.count()).select_from(Group)
    if query.whereclause is not None:
        count_query = count_query.where(query.whereclause)
    total_count = db.scalar(count_query)

    result = (
        db.execute(
            query.order_by(Group.id)
            .offset((page_number - 1) * page_size)
            .limit(page_size)
        ).unique().scalars().all()
    )

    items = [selector(g) for g in result] if selector else result

    return PaginatedList[ViewGroupModel].create(
        items=items,
        total_count=total_count,
        page_number=page_number,
        page_size=page_size,
    )

def exists(db: Session, name: str, id: Optional[int] = None) -> bool:
    query = select(Group).where(Group.name == name)
    if id is not None:
        query = query.where(Group.id != id)
    return db.scalars(query).first() is not None

def get_by_company(company_id: int, db: Session) -> List[Group]:
    query = (
        select(Group)
        .join(CompanyGroup, Group.id == CompanyGroup.group_id)
        .where(CompanyGroup.company_id == company_id)
        .options(joinedload(Group.companies).joinedload(CompanyGroup.company))  # optional: eager load
        .order_by(Group.id)
    )

    result = db.execute(query).unique().scalars().all()
    return result