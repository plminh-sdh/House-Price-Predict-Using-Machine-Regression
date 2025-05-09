import { RouteDefinition } from "@/models/route-definition";
import { adminRelativePaths, adminRoot } from "@admin/enums/admin-paths";
import ProjectAdmin from "@admin/pages/ProjectAdmin";
import UserAdmin from "@admin/pages/UserAdmin";
import UserGroups from "@admin/pages/UserGroups";
import AdminLayout from "@admin/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminActions } from "@/enums/actions";

export const adminRoutes: RouteDefinition[] = [
  {
    path: adminRoot,
    element: (
      <AdminLayout>
        <ProtectedRoute accessRights={Object.keys(AdminActions)} />
      </AdminLayout>
    ),
    children: [
      {
        path: adminRelativePaths.projectAdmin,
        element: <ProjectAdmin />,
      },
      {
        path: adminRelativePaths.userAdmin,
        element: <UserAdmin />,
      },
      {
        path: adminRelativePaths.userGroups,
        element: <UserGroups />,
      }
    ],
  },
];
