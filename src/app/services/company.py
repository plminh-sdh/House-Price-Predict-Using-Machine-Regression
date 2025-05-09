from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import List

from entities.company import Company

def get_company_by_id(id: int, db: Session) -> Company:
    return db.scalars(select(Company).filter(Company.id == id)).first()

def get_many(ids: List[int], db: Session) -> List[Company]:
    return db.scalars(
        select(Company).where(Company.id.in_(ids))
    ).all()