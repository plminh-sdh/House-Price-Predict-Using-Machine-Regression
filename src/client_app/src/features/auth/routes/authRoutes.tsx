import Login from '@auth/pages/Login';
import { RouteDefinition } from '@/models/route-definition';
import { authRelativePaths, authRoot } from '@auth/enums/auth-paths';
import UnauthenticatedRouteWrapper from '@auth/components/UnauthenticatedRouteWrapper';

export const authRoutes: RouteDefinition[] = [
  {
    path: authRoot,
    element: <UnauthenticatedRouteWrapper />,
    children: [
      {
        path: authRelativePaths.login,
        element: <Login />,
      },
    ],
  },
];
