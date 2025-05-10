import numpy as np
import pandas as pd
import shap
from joblib import load
from datetime import datetime, timezone
from models.predictor import PredictHousePriceModel, PredictResult

def predict(data: PredictHousePriceModel):
    model = load('resources/voting_regressor.joblib')

    x_train = pd.read_csv("resources/X_train_medians.csv")
    feature_defaults = x_train.median()
    
    input_values = {
        'GrLivArea': data.grLivArea,       
        'OverallQual': data.overallQual,       
        'TotalBsmtSF': data.totalBsmtSF,      
        'GarageCars': data.garageCars,        
        'YearBuilt': data.yearBuilt,       
        'FireplaceQu': data.fireplaceQu,         
        'YearRemodAdd': data.yearRemodAdd,    
        'GarageFinish': data.garageFinish,        
        'ExterQual': data.exterQual,          
        'CentralAir_Y': 1 if data.centralAir else 0,   
    }

    test_row = pd.DataFrame([feature_defaults.copy()])

    for feature, value in input_values.items():
        if feature in test_row.columns:
            test_row.at[0, feature] = value

    predicted_price = model.predict(test_row)[0]
    
    return PredictResult(housePrice=predicted_price)