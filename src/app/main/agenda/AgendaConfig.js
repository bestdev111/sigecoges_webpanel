import { lazy } from 'react';
import { authRoles } from 'app/auth';

const AgendaConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.admin,
  routes: [
    {
      path: '/agenda',
      component: lazy(() => import('./components/AgendaPage')),
    },
  ],
};

export default AgendaConfig;
