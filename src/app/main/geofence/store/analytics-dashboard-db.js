const analyticsDashboardAppDB = {
  widgets: [
    {
      id: 'widget',
      markers: [
        {
          lat: 52,
          lng: -73,
          label: '120',
        },
        {
          lat: 37,
          lng: -104,
          label: '498',
        },
        {
          lat: 21,
          lng: -7,
          label: '443',
        },
        {
          lat: 55,
          lng: 75,
          label: '332',
        },
        {
          lat: 51,
          lng: 7,
          label: '50',
        },
        {
          lat: 31,
          lng: 12,
          label: '221',
        },
        {
          lat: 45,
          lng: 44,
          label: '455',
        },
        {
          lat: -26,
          lng: 134,
          label: '231',
        },
        {
          lat: -9,
          lng: -60,
          label: '67',
        },
        {
          lat: 33,
          lng: 104,
          label: '665',
        },
      ],
      styles: [
        {
          featureType: 'administrative',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#444444',
            },
          ],
        },
        {
          featureType: 'landscape',
          elementType: 'all',
          stylers: [
            {
              color: '#f2f2f2',
            },
          ],
        },
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'road',
          elementType: 'all',
          stylers: [
            {
              saturation: -100,
            },
            {
              lightness: 45,
            },
          ],
        },
        {
          featureType: 'road.highway',
          elementType: 'all',
          stylers: [
            {
              visibility: 'simplified',
            },
          ],
        },
        {
          featureType: 'road.arterial',
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'transit',
          elementType: 'all',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'water',
          elementType: 'all',
          stylers: [
            {
              color: '#039be5',
            },
            {
              visibility: 'on',
            },
          ],
        },
      ],
    },
  ],
};
export default analyticsDashboardAppDB;
