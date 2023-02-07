import { lazy } from 'react';
import { authRoles } from 'app/auth';

const MyProfilePageConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.super_admin,
  routes: [
    {
      path: '/myprofile',
      component: lazy(() => import('./components/MyProfilePage')),
    },
  ],
};

export default MyProfilePageConfig;
