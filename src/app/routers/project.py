from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from database import get_db_context
from typing import Optional

from services import project as ProjectService
from models.project import CreateProjectModel, UpdateProjectModel, ViewProjectModel
from models.paginated_list import PaginatedList
from services.exception import BadRequestError
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=PaginatedList[ViewProjectModel])
async def get_projects_async(
    sortField: Optional[str] = None,
    sortOrder: Optional[str] = None,
    search: Optional[str] = None,
    pageNumber: int = 1,
    pageSize: int = 10,
    db: Session = Depends(get_db_context)
):
    return ProjectService.get_paginated_projects(
        db=db,
        page_number=pageNumber,
        page_size=pageSize,
        search=search,
        sort_field=sortField,
        sort_order=sortOrder
    )

@router.get("/exists", status_code=status.HTTP_200_OK)
async def exists_async(name: str, id: Optional[int] = None, db: Session = Depends(get_db_context)):
    if not ProjectService.exists(db, name, id):
        return JSONResponse(content={"message": "Not found"}, status_code=status.HTTP_404_NOT_FOUND)
    return JSONResponse(content={"message": "Exists"}, status_code=status.HTTP_200_OK)

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_project_async(model: CreateProjectModel, db: Session = Depends(get_db_context)):
    project_id = ProjectService.create_project(db, model)
    return {"id": project_id}

@router.put("/{id}", status_code=status.HTTP_200_OK)
async def update_project_async(id: int, model: UpdateProjectModel, db: Session = Depends(get_db_context)):
    success = ProjectService.update_project(db, id, model)
    if not success:
        raise BadRequestError("Project not found")
    return JSONResponse(content={"message": "Project updated"}, status_code=status.HTTP_200_OK)
