import sessionService from "@auth/services/session.service";
import { Navigate, Outlet } from "react-router";

function UnauthenticatedRouteWrapper() {
  const currentUser = sessionService.getCurrentUser();

  if (currentUser) return <Navigate to="/" />;

  return <Outlet />;
}

export default UnauthenticatedRouteWrapper;
