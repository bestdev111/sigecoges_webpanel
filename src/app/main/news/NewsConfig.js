import { lazy } from 'react';
import { authRoles } from 'app/auth';

const NewsConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.admin,
  routes: [
    {
      path: '/news',
      component: lazy(() => import('./components/NewsPage')),
    },
  ],
};

export default NewsConfig;
