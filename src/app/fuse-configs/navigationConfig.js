import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'menu',
    title: 'Menu',
    translate: 'Menu',
    type: 'group',
    icon: 'dashboard',
    children: [
      {
        id: 'users',
        title: 'Users',
        translate: 'Users',
        type: 'item',
        url: '/users',
        icon: 'person',
      },
      {
        id: 'groups',
        title: 'Groups',
        translate: 'Groups',
        type: 'item',
        url: '/groups',
        icon: 'group',
      },
      {
        id: 'activity',
        title: 'Activity',
        translate: 'Activity',
        type: 'item',
        url: '/activity',
        icon: 'show_chart',
        badge: true,
      },
      {
        id: 'agenda',
        title: 'Agenda',
        translate: 'Agenda',
        type: 'item',
        url: '/agenda',
        icon: 'event_available',
      },
      {
        id: 'geofence',
        title: 'Geofence',
        translate: 'Geofence',
        type: 'item',
        url: '/geofence',
        icon: 'person_pin_circle',
      },
      {
        id: 'news',
        title: 'News',
        translate: 'News',
        type: 'item',
        url: '/news',
        icon: 'book',
      },
    ],
  },
];

export default navigationConfig;
