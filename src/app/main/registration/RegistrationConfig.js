import { lazy } from 'react';
import { authRoles } from 'app/auth';

const RegistrationConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.admin,
  routes: [
    {
      path: '/registration',
      component: lazy(() => import('./components/RegistrationPage')),
    },
  ],
};

export default RegistrationConfig;
