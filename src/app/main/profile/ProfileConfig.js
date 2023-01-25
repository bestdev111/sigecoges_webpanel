import { lazy } from 'react';

const ProfileConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/profile/:userId',
      component: lazy(() => import('./ProfilePage')),
    },
  ],
};

export default ProfileConfig;
