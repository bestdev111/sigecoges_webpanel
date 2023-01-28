import { authRoles } from 'app/auth';
import { lazy } from 'react';

const MailConfirmPageConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: '/mail-confirm',
      component: lazy(() => import('./MailConfirmPage')),
    },
  ],
};

export default MailConfirmPageConfig;
