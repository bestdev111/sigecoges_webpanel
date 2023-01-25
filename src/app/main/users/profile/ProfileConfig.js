import { lazy } from 'react';
import { authRoles } from 'app/auth';
const ProfileConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.admin,
  routes: [
    {
      path: '/userprofile/:userId',
      component: lazy(() => import('./ProfilePage')),
    },
  ],
};

export default ProfileConfig;
