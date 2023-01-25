import { lazy } from 'react';
import { authRoles } from 'app/auth';

const UsersConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.admin,
  routes: [
    {
      path: '/users',
      component: lazy(() => import('./UsersPage')),
    },
  ],
};

export default UsersConfig;
