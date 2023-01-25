import { lazy } from 'react';
import { authRoles } from 'app/auth';

const GeofenceConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.admin,
  routes: [
    {
      path: '/geofence',
      component: lazy(() => import('./components/GeofencePage')),
    },
    {
      path: '/geofence/:id',
      component: lazy(() => import('./components/GeofencePage')),
    },
  ],
};

export default GeofenceConfig;
