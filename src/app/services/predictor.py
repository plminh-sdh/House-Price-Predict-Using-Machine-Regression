import numpy as np
import pandas as pd
import shap
from joblib import load
from datetime import datetime, timezone
from models.predictor import PredictLoanModel, FeatureValueViewModel, PredictResult

def predict(data: PredictLoanModel):
    # Load the trained Random Forest model
    earliest_datetime = datetime.combine(data.earliestCrLine, datetime.min.time(), tzinfo=timezone.utc)
    days_since_earliest = (datetime.now(timezone.utc) - earliest_datetime).days
    years_since_earliest = round(days_since_earliest / 365, 2)
    
    model = load('resources/random_forest_model.joblib')
    full_feature_names = model.feature_names_in_

    # Define sample values for the corrected top 10 features
    input_values = {
        'int_rate': data.intRate,
        'dti': data.dti,
        'revol_bal': data.revolBal,
        'revol_util': data.revolUtil,
        'earliest_cr_line': years_since_earliest,  # years since first credit line
        'annual_inc': data.annualInc,
        'mo_sin_old_il_acct': data.moSinOldIlAcct,
        'loan_amnt': data.loanAmnt,
        'open_acc': data.openAcc,
        'fico_score': data.ficoScore
    }

    # Initialize a test row with zeros for all features
    test_row = pd.DataFrame([np.zeros(len(full_feature_names))], columns=full_feature_names)

    # Fill in the top 10 features with example values
    for feature, value in input_values.items():
        if feature in test_row.columns:
            test_row[feature] = value

    # Make prediction
    prediction = model.predict(test_row)
    probability = model.predict_proba(test_row)
    status = "Charged Off" if prediction[0] == 1 else "Fully Paid"

    # SHAP explanation
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(test_row)

    # Extract SHAP values for class 1 (Charged Off)
    contributions = pd.DataFrame({
        'feature': full_feature_names,
        'shap_value': shap_values[0][:, 1],
        'abs_shap': np.abs(shap_values[0][:, 1]),
        'value': test_row.iloc[0].values
    })

    # Show top 5 most influential features
    top_5 = contributions.sort_values(by='abs_shap', ascending=False).head(5)
    
    top_features = [
        FeatureValueViewModel(name=row["feature"], value=str(round(row["value"], 2)))
        for _, row in top_5.iterrows()
    ]
    
    return PredictResult(defaultRate=round(float(probability[0][1]), 4), topFeatures=top_features)