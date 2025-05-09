from starlette import status
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import get_db_context

from models.predictor import PredictLoanModel
from services import predictor as PredictorService
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/predictors", tags=["Predictors"])

@router.post("", status_code=status.HTTP_200_OK)
async def predict_async(
    model: PredictLoanModel,
    # user_claims: Dict[str, Union[str, int]] = Depends(authorizer)
):
    return PredictorService.predict(model)
