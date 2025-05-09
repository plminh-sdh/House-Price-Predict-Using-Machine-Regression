from pydantic import BaseModel
from datetime import date
from typing import List

class PredictLoanModel(BaseModel):
    intRate: float
    dti: float
    revolBal: float
    revolUtil: float
    earliestCrLine: date
    annualInc: float
    moSinOldIlAcct: float
    loanAmnt: float
    openAcc: float
    ficoScore: float

class FeatureValueViewModel(BaseModel):
    name: str
    value: str
    
class PredictResult(BaseModel):
    defaultRate: float
    topFeatures: List[FeatureValueViewModel]
