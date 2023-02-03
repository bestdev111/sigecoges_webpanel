const projectDashboardAppDB = {
  widgets: [
    {
      id: 'widget5',
      title: 'Github Issues',
      ranges: {
        TW: 'This Week',
        LW: 'Last Week',
        '2W': '2 Weeks Ago',
      },
      mainChart: {
        TW: {
          series: [
            {
              name: 'Issues',
              data: [42, 28, 43, 34, 20, 25, 22],
            },
            {
              name: 'Closed issues',
              data: [11, 10, 8, 11, 8, 10, 17],
            },
          ],
        },
        '2W': {
          labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          series: [
            {
              name: 'Issues',
              data: [37, 32, 39, 27, 18, 24, 20],
            },
            {
              name: 'Closed issues',
            },
          ],
        },
        LW: {
          labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          series: [
            {
              name: 'Issues',
              data: [37, 24, 51, 31, 29, 17, 31],
            },
            {
              name: 'Closed issues',
              data: [12, 8, 7, 13, 7, 6, 10],
            },
          ],
        },
        options: {
          chart: {
            height: '100%',
            type: 'bar',
            stacked: true,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              columnWidth: '90%',
              horizontal: false,
            },
          },
          xaxis: {
            categories: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            followCursor: true,
            theme: 'dark',
            fixed: {
              enabled: false,
              position: 'topRight',
              offsetX: 0,
              offsetY: 0,
            },
          },
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: false,
          },
        },
      },
    },
  ],
};
export default projectDashboardAppDB;
