import { RouteDefinition } from '@/models/route-definition';
import Layout from '../components/Layout';
import { Outlet } from 'react-router';
import { clientRelativePaths, clientRoot } from '../enums/client-paths';
import Information from '../pages/Information';
import Performance from '../pages/Performance';
import Predictive from '../pages/Predictive';
import Tool from '../pages/Tool';

export const clientRoutes: RouteDefinition[] = [
  {
    path: clientRoot,
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        path: clientRelativePaths.information,
        element: <Information />,
      },
      {
        path: clientRelativePaths.performance,
        element: <Performance />,
      },
      {
        path: clientRelativePaths.predictive,
        element: <Predictive />,
      },
      {
        path: clientRelativePaths.tool,
        element: <Tool />,
      },
    ],
  },
];
