import { ErrorResponse } from "react-router";

function isErrorResponse(object: any): object is ErrorResponse {
  return "correlationId" in object && "message" in object;
}
export default isErrorResponse;
