// class FeatureValueViewModel(BaseModel):
//     name: str
//     value: str
    
// class PredictResult(BaseModel):
//     defaultRate: float
//     topFeatures: List[FeatureValueViewModel]

export interface PredictResult {
    defaultRate: number
    topFeatures: FeatureValueViewModel[]
}

export interface FeatureValueViewModel{
    name: string;
    value: string;
}