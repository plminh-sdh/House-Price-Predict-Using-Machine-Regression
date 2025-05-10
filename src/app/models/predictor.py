from pydantic import BaseModel
from datetime import date
from typing import List

class PredictHousePriceModel(BaseModel):
    grLivArea: int
    overallQual: int
    totalBsmtSF: int
    garageCars: int
    yearBuilt: int
    fireplaceQu: int
    yearRemodAdd: int
    garageFinish: int
    exterQual: int
    centralAir: bool
    
class PredictResult(BaseModel):
    housePrice: float
