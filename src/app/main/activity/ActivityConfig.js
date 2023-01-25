import { lazy } from 'react';
import { authRoles } from 'app/auth';

const ActivityConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.admin,
  routes: [
    {
      path: '/activity',
      component: lazy(() => import('./components/ActivityPage')),
    },
  ],
};

export default ActivityConfig;
