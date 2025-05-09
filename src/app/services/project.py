from typing import Optional
from sqlalchemy import select, func, or_
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from models.project import CreateProjectModel, UpdateProjectModel, ViewProjectModel
from entities.project import Project
from entities.company import Company
from models.paginated_list import PaginatedList
from services.exception import (
    ProjectNameExistsException,
    CompanyNameExistsException,
)

def get_paginated_projects(
    db: Session,
    page_number: int,
    page_size: int,
    search: Optional[str] = None,
    sort_field: Optional[str] = None,
    sort_order: Optional[str] = None
) -> PaginatedList[ViewProjectModel]:
    query = select(Project).options(joinedload(Project.company))

    if search:
        query = query.where(
            or_(
                Project.name.ilike(f"%{search}%"),
                Company.name.ilike(f"%{search}%")
            )
        ).join(Project.company)

    # Sorting
    if sort_field == "projectName":
        query = query.order_by(Project.name.desc() if sort_order == "DESC" else Project.name.asc())
    elif sort_field == "company":
        query = query.order_by(Company.name.desc() if sort_order == "DESC" else Company.name.asc()).join(Project.company)
    else:
        query = query.order_by(Project.id.desc() if sort_order == "DESC" else Project.id.asc())

    total_count = db.scalar(select(func.count()).select_from(query.subquery()))
    results = db.execute(
        query.offset((page_number - 1) * page_size).limit(page_size)
    ).unique().scalars().all()

    items = [ViewProjectModel(id=p.id, projectName=p.name, company=p.company.name) for p in results]
    return PaginatedList[ViewProjectModel].create(items, total_count, page_number, page_size)

def exists(db: Session, name: str, id: Optional[int] = None) -> bool:
    query = select(Project).where(Project.name == name)
    if id is not None:
        query = query.where(Project.id != id)
    return db.scalars(query).first() is not None

def create_project(db: Session, model: CreateProjectModel) -> int:
    company = db.scalars(select(Company).where(Company.name == model.companyName)).first()

    if not company:
        company = Company(name=model.companyName)
        db.add(company)
        db.flush()  # To ensure company.id is available

    project = Project(name=model.projectName, company=company)
    db.add(project)

    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()

        # SQL Server error code 2627 = unique constraint violation
        if hasattr(e.orig, 'args') and len(e.orig.args) > 1:
            message = str(e.orig.args[1]).lower()

            if "uq__projects" in message or "ix_projects_name" in message:
                raise ProjectNameExistsException(model.projectName)
            elif "uq__companies" in message or "ix_companies_name" in message:
                raise CompanyNameExistsException(model.companyName)

        raise  # Re-raise if not our expected constraint

    return project.id

def update_project(db: Session, id: int, model: UpdateProjectModel) -> bool:
    project = db.scalars(select(Project).where(Project.id == id)).first()
    if not project:
        return False
    project.update_details(model.projectName)
    db.add(project)
    db.commit()
    return True
