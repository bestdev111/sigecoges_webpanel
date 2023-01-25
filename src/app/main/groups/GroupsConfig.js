import { lazy } from 'react';
import { authRoles } from 'app/auth';
const GroupsConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.admin,
  routes: [
    {
      path: '/groups',
      component: lazy(() => import('./components/GroupsPage')),
    },
    {
      path: '/groupprofile/:index',
      component: lazy(() => import('./components/GroupProfilePage')),
    },
  ],
};

export default GroupsConfig;