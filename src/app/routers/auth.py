from starlette import status
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from typing import Dict, Union
from database import get_db_context
from services.auth import verify_password, TokenGenerator
from models.auth import LoginModel, TokenModel
from models.user import UserViewModel
from enums.access_action import AccessAction
from services.auth import authorizer
from services import user as UserService
from services.exception import ResourceNotFoundError, UnAuthorizedError, BadRequestError

from fastapi.responses import JSONResponse

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", status_code=status.HTTP_200_OK, response_model=UserViewModel)
async def login_async(
    model: LoginModel,
    db: Session = Depends(get_db_context)
):
    user = UserService.get_user_by_email(model.email, db)
    
    if not user:
        raise BadRequestError("User not found")

    if not verify_password(model.password, user.password_hash):
        raise BadRequestError("Invalid password")
    
    if not user.active:
        raise BadRequestError("Inactive account")
    
    token_generator = TokenGenerator()
    
    token = token_generator.generate_token(user)
    actions = [
        action.name for action in AccessAction
        if any(claim.claim_type == action.name for claim in user.claims)
    ]
    
    refresh_token, expires_on = token_generator.generate_refresh_token()
    user.login(refresh_token, expires_on)
    
    db.add(user)
    db.commit()
    
    return UserViewModel(
        id=user.id,
        email=user.email,
        fullName=user.full_name,
        companyId=user.company_id,
        actions=actions,
        token=token,
        refreshToken=refresh_token
    )

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout_async(
    db: Session = Depends(get_db_context),
    user_claims: Dict[str, Union[str, int]] = Depends(authorizer)
):
    user_id = user_claims["uid"]
    
    user = UserService.get_user_by_id(user_id, db)
    
    if user is None:
        raise ResourceNotFoundError()
    
    user.logout()
    db.add(user)
    db.commit()
    
    return JSONResponse(content={"message": "Logged out successfully"}, status_code=status.HTTP_200_OK)

@router.post("/refresh-token", status_code=status.HTTP_200_OK)
async def refresh_token_async(
    model: TokenModel,
    db: Session = Depends(get_db_context)
):
    token_generator = TokenGenerator()
    principle = token_generator.get_principal(model.token)
    
    if principle is None:
        raise UnAuthorizedError()
    
    email = principle['email']
    if email is None:
        raise UnAuthorizedError()
    
    user = UserService.get_user_by_email(email, db)
    if user is None or not user.validate_refresh_token(model.refreshToken):
        raise UnAuthorizedError()
    
    new_refresh_token, new_expires_on = token_generator.generate_refresh_token()
    user.login(new_refresh_token, new_expires_on)
    db.add(user)
    db.commit()
    
    new_token = token_generator.generate_token(user)
    actions = [
        action.name for action in AccessAction
        if any(claim.claim_type == action.name for claim in user.claims)
    ]
    
    return JSONResponse(content={"Token": new_token, "RefreshToken": new_refresh_token, "Actions": actions}, status_code=status.HTTP_200_OK)