from starlette import status
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import get_db_context

from entities.company import Company
from services.auth import authorizer

router = APIRouter(prefix="/companies", tags=["Companies"])

@router.get("", status_code=status.HTTP_200_OK)
async def get_all_async(
    db: Session = Depends(get_db_context)
    # user_claims: Dict[str, Union[str, int]] = Depends(authorizer)
):
    return db.scalars(select(Company)).all()