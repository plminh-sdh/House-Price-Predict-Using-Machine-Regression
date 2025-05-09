from typing import Generic, List, TypeVar
from pydantic import BaseModel
from pydantic.generics import GenericModel

T = TypeVar("T")

class PaginatedList(GenericModel, Generic[T]):
    items: List[T]
    currentPage: int
    pageSize: int
    totalPages: int
    totalCount: int

    @classmethod
    def create(cls, items: List[T], total_count: int, page_number: int, page_size: int) -> "PaginatedList[T]":
        total_pages = (total_count + page_size - 1) // page_size
        return cls(
            items=items,
            currentPage=page_number,
            pageSize=page_size,
            totalPages=total_pages,
            totalCount=total_count,
        )
