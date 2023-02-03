import { authRoles } from 'app/auth';
import { lazy } from 'react';

const DashboardPageConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.admin,
  routes: [
    {
      path: '/dashboard',
      component: lazy(() => import('./DashboardPage')),
    },
  ],
};

export default DashboardPageConfig;
