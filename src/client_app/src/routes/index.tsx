import WithInterceptor from "@/components/WithInterceptor";
import { clientRoutes } from "@/features/client/routes/clientRoutes";
import ErrorHandler from "@/pages/ErrorHandler";
import InterimPage from "@/pages/InterimPage";
import PageNotFound from "@/pages/PageNotFound/PageNotFound";
import { adminRoutes } from "@admin/routes/adminRoutes";
import { authRoutes } from "@auth/routes/authRoutes";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router";
export const routes = [
  {
    path: "/",
    element: (
      <ErrorBoundary FallbackComponent={ErrorHandler}>
        <WithInterceptor>
          <Outlet />
        </WithInterceptor>
      </ErrorBoundary>
    ),
    children: [
      {
        path: "",
        element: <InterimPage />,
      },
      {
        path: "404",
        element: <PageNotFound />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
      ...authRoutes,
      ...clientRoutes,
      ...adminRoutes,
    ],
  },
];
