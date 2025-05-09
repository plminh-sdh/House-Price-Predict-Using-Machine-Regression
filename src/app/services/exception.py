from fastapi import HTTPException, status

class BadRequestError(HTTPException):
    def __init__(self, msg=None):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail="Bad Request" if msg is None else msg)

class ResourceNotFoundError(HTTPException):
    def __init__(self):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")    

class UnAuthorizedError(HTTPException):
    def __init__(self):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized access")

class InvalidTokenError(HTTPException):
    def __init__(self):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

class AccessDeniedError(HTTPException):
    def __init__(self):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

class UniqueFieldConstraintException(HTTPException):
    def __init__(self, message: str, field: str):
        self.field = field
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=message)

class ProjectNameExistsException(UniqueFieldConstraintException):
    def __init__(self, name: str, field: str = "Project.name"):
        super().__init__(f"Project with name '{name}' already exists.", field)

class CompanyNameExistsException(UniqueFieldConstraintException):
    def __init__(self, name: str, field: str = "Company.name"):
        super().__init__(f"Company with name '{name}' already exists.", field)

class InvalidInputError(HTTPException):
    def __init__(self, msg=None):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, 
                            detail="Invalid input data" if msg is None else msg)