import { authPaths } from "@auth/enums/auth-paths";
import sessionService from "@auth/services/session.service";
import { useMemo } from "react";
import { Navigate, Outlet } from "react-router";

type Props = {
  accessRights: string[];
  children?: React.ReactNode;
};
function ProtectedRoute({ accessRights, children }: Props) {
  const currentUser = sessionService.getCurrentUser();

  const hasPermission = useMemo(() => {
    if (!currentUser) return false;

    const userActions = new Set(currentUser.actions);
    return accessRights.every((str) => userActions.has(str));
  }, [currentUser, accessRights]);

  if (!currentUser) return <Navigate to={authPaths.login} />;

  if (!hasPermission) {
    return <Navigate to={"404"} />;
  }

  return children ? (
    <>
      {children}
    </>
  ) : (
    <Outlet />
  )
}

export default ProtectedRoute;
