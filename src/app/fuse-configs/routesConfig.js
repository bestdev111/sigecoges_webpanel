import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import LoginConfig from 'app/main/login/LoginConfig';
import RegisterConfig from 'app/main/register/RegisterConfig';
import LogoutConfig from 'app/main/logout/LogoutConfig';
import ExampleConfig from 'app/main/example/ExampleConfig';
import usersDataConfigs from 'app/main/users/usersDataConfigs';
import GroupsConfig from 'app/main/groups/GroupsConfig';
import ActivityConfig from 'app/main/activity/ActivityConfig';
import AgendaConfig from 'app/main/agenda/AgendaConfig';
import GeofenceConfig from 'app/main/geofence/GeofenceConfig';
import NewsConfig from 'app/main/news/NewsConfig';
import RegistrationConfig from 'app/main/registration/RegistrationConfig';
import MailConfirmPageConfig from 'app/main/mail-confirm/MailConfirmPageConfig';
import FuseLoading from '@fuse/core/FuseLoading';
import Error404Page from 'app/main/404/Error404Page';

const routeConfigs = [
  LogoutConfig,
  LoginConfig,
  RegisterConfig,
  MailConfirmPageConfig,

  ...usersDataConfigs,
  GroupsConfig,
  ActivityConfig,
  AgendaConfig,
  GeofenceConfig,
  NewsConfig,
  RegistrationConfig,

  ExampleConfig,
];
const routes = [
  // if you want to make whole app auth protected by default change defaultAuth for example:
  // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
  // The individual route configs which has auth option won't be overridden.
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['super_admin', 'admin']),
  {
    exact: true,
    path: '/',
    component: () => <Redirect to="/users" />,
  },
  {
    path: '/loading',
    exact: true,
    component: () => <FuseLoading />,
  },
  {
    path: '/404',
    component: () => <Error404Page />,
  },
  {
    component: () => <Redirect to="/404" />,
  },
];

export default routes;
