import formatISO from 'date-fns/formatISO';

function setDate(year, month, date, hours, minutes, seconds) {
  return formatISO(new Date(year, month, date, hours || '', minutes || '', seconds || ''));
}

const calendarDB = {
  events: [
    {
      id: 0,
      title: 'All Day Event very long title',
      allDay: true,
      start: setDate(2023, 1, 1),
      end: setDate(2023, 1, 2),
    },
    {
      id: 1,
      title: 'Long Event',
      allDay: false,
      start: setDate(2023, 1, 7),
      end: setDate(2023, 1, 10),
    },
    {
      id: 2,
      title: 'DTS STARTS',
      allDay: false,
      start: setDate(2022, 2, 13, 0, 0, 0),
      end: setDate(2022, 2, 20, 0, 0, 0),
    },
    {
      id: 3,
      title: 'DTS ENDS',
      allDay: false,
      start: setDate(2022, 10, 6, 0, 0, 0),
      end: setDate(2022, 10, 13, 0, 0, 0),
    },
    {
      id: 4,
      title: 'Some Event',
      allDay: false,
      start: setDate(2023, 1, 9, 0, 0, 0),
      end: setDate(2023, 1, 10, 0, 0, 0),
    },
    {
      id: 5,
      title: 'Conference',
      allDay: false,
      start: setDate(2023, 1, 11),
      end: setDate(2023, 1, 13),
      extendedProps: {
        desc: 'Big conference for important people',
      },
    },
    {
      id: 6,
      title: 'Meeting',
      allDay: false,
      start: setDate(2023, 1, 12, 10, 30, 0, 0),
      end: setDate(2023, 1, 12, 12, 30, 0, 0),
      extendedProps: {
        desc: 'Pre-meeting meeting, to prepare for the meeting',
      },
    },
    {
      id: 7,
      title: 'Lunch',
      allDay: false,
      start: setDate(2023, 1, 12, 12, 0, 0, 0),
      end: setDate(2023, 1, 12, 13, 0, 0, 0),
      extendedProps: {
        desc: 'Power lunch',
      },
    },
    {
      id: 8,
      title: 'Meeting',
      allDay: false,
      start: setDate(2023, 1, 12, 14, 0, 0, 0),
      end: setDate(2023, 1, 12, 15, 0, 0, 0),
    },
    {
      id: 9,
      title: 'Happy Hour',
      allDay: false,
      start: setDate(2023, 1, 12, 17, 0, 0, 0),
      end: setDate(2023, 1, 12, 17, 30, 0, 0),
      extendedProps: {
        desc: 'Most important meal of the day',
      },
    },
    {
      id: 10,
      title: 'Dinner',
      allDay: false,
      start: setDate(2023, 1, 12, 20, 0, 0, 0),
      end: setDate(2023, 1, 12, 21, 0, 0, 0),
    },
    {
      id: 11,
      title: 'Birthday Party',
      allDay: false,
      start: setDate(2023, 1, 13, 7, 0, 0),
      end: setDate(2023, 1, 13, 10, 30, 0),
    },
    {
      id: 12,
      title: 'Late Night Event',
      allDay: false,
      start: setDate(2023, 1, 17, 19, 30, 0),
      end: setDate(2023, 1, 18, 2, 0, 0),
    },
    {
      id: 13,
      title: 'Multi-day Event',
      allDay: false,
      start: setDate(2023, 1, 20, 19, 30, 0),
      end: setDate(2023, 1, 22, 2, 0, 0),
    },
  ],
};
export default calendarDB;
