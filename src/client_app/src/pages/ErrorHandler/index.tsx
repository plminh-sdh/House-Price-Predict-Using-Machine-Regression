import isErrorResponse from "@/helpers/is-error-response";

function ErrorHandler({ error }: any) {
  const errorResponse = isErrorResponse(error);
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-1  text-danger">Oops!</h1>
        <p className="fs-3 text-center">
          <span className="">Something went wrong</span>
        </p>
        <p className="lead text-center">Please try again.</p>
        {errorResponse && (
          <div>
            <p>Error tracking id: {(error as any).correlationId}</p>
            <p>Error message: {(error as any).message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ErrorHandler;
