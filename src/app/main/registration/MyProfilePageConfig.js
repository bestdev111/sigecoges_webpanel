import { lazy } from 'react';
import { authRoles } from 'app/auth';

const MyProfilePageConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.admin,
  routes: [
    {
      path: '/myprofile',
      component: lazy(() => import('./components/MyProfilePage')),
    },
  ],
};

export default MyProfilePageConfig;
