import env from "@env";
import { PredictLoanModel } from "../models/house-price";
import { handleResponse } from "@/helpers/handle-response";
import { PredictResult } from "../models/predict-result";

export async function predictLoan(model: PredictLoanModel) : Promise<PredictResult> {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(model),
  }

  const response = await fetch(
    `${env.VITE_APP_API_END_POINT}/predictors`,
    requestOptions
  );
  return handleResponse(response);
}