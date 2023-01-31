import { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import FirebaseService from 'app/services/firebaseService';
import formatISO from 'date-fns/formatISO';
import CoreService from 'app/services/coreService';
import CalendarHeader from './CalendarHeader';
import EventDialog from './EventDialog';

// import {
//   selectEvents,
//   openNewEventDialog,
//   openEditEventDialog,
//   updateEvent,
//   getEvents,
// } from '../../store/scheduleSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    '& a': {
      color: theme.palette.text.primary,
      textDecoration: 'normal!important',
    },
    '&  .fc-media-screen': {
      minHeight: '100%',
    },
    '& .fc-scrollgrid, & .fc-theme-standard td, & .fc-theme-standard th': {
      borderColor: `${theme.palette.divider}!important`,
    },
    '&  .fc-scrollgrid-section > td': {
      border: 0,
    },
    '& .fc-daygrid-day': {
      '&:last-child': {
        borderRight: 0,
      },
    },
    '& .fc-col-header-cell': {
      borderWidth: '0 0 1px 0',
      padding: '16px 0',
      '& .fc-col-header-cell-cushion': {
        color: theme.palette.text.secondary,
        fontWeight: 500,
      },
    },
    '& .fc-view ': {
      borderRadius: 20,
      overflow: 'hidden',
      border: `1px solid ${theme.palette.divider}`,
      '& > .fc-scrollgrid': {
        border: 0,
      },
    },
    '& .fc-daygrid-day-number': {
      color: theme.palette.text.secondary,
      fontWeight: 500,
    },
    '& .fc-event': {
      backgroundColor: `${theme.palette.primary.dark}!important`,
      color: `${theme.palette.primary.contrastText}!important`,
      border: 0,
      padding: '0 6px',
      borderRadius: '16px!important',
    },
  },
  addButton: {
    position: 'absolute',
    right: 12,
    top: 172,
    zIndex: 99,
  },
}));

function ScheduleTab(props) {
  const [currentDate, setCurrentDate] = useState();
  // const dispatch = useDispatch();
  const [events, setEvents] = useState();
  const [open, setOpen] = useState(false);
  const [openId, setOpenId] = useState();
  // const events = useSelector(selectEvents);
  const calendarRef = useRef();

  const classes = useStyles(props);
  const headerEl = useRef(null);

  useEffect(() => {
    // if (props.groupName) dispatch(getEvents(props.groupName));
    if (props.groupName) fetchGetEvents(props.groupName);
  }, []);

  const fetchGetEvents = async (groupName) => {
    FirebaseService.getSchedules(groupName).then(
      (schedule) => {
        // eslint-disable-next-line prefer-const
        let temp = [];
        if (schedule && schedule[0] !== undefined) {
          schedule.forEach((element, index) => {
            // if (element.type === 'SPECIFIC') {
            // eslint-disable-next-line prefer-const
            let obj = {
              id: index,
              title: element.content,
              start: formatISO(new Date(element.specific_date.time)),
              end: formatISO(new Date(element.specific_date.time)),
              allDay: false,
              d: CoreService.getDateStringFromTimestamp(element.specific_date.time),
              isOnDuty: element.isOnDuty,
              type: element.type,
              sTime: element.start_time,
              eTime: element.end_time,
            };
            temp.push(obj);
            // }
          });
        }
        setEvents(temp);
        return temp;
      },
      (error) => {
        return error;
      }
    );
  };

  const handleEventClick = (clickInfo) => {
    const { id, title, allDay, start, end, extendedProps } = clickInfo.event;
    setOpen(true);
    setOpenId(id);
    // dispatch(
    //   openEditEventDialog({
    //     id,
    //     title,
    //     allDay,
    //     start,
    //     end,
    //     extendedProps,
    //   })
    // );
  };

  const handleDates = (rangeInfo) => {
    setCurrentDate(rangeInfo);
  };

  const handleEventAdd = (addInfo) => {};

  const handleEventChange = (changeInfo) => {};

  const handleEventRemove = (removeInfo) => {};
  const eventClose = () => {
    setOpen(false);
  };
  return (
    <div className={clsx(classes.root, 'flex flex-col flex-auto relative')}>
      <CalendarHeader calendarRef={calendarRef} currentDate={currentDate} />

      <div className="flex flex-1 p-24 container">
        <motion.div
          className="w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
        >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={false}
            initialView="dayGridMonth"
            editable
            // selectable
            // selectMirror
            dayMaxEvents
            weekends
            datesSet={handleDates}
            firstDay={1}
            events={events}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            eventAdd={handleEventAdd}
            eventChange={handleEventChange}
            eventRemove={handleEventRemove}
            // eventDrop={handleEventDrop}
            initialDate={new Date()}
            ref={calendarRef}
          />
        </motion.div>

        <EventDialog
          open={open}
          openId={openId}
          groupName={props.groupName}
          closeFunc={eventClose}
        />
      </div>
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <div className="flex items-center">
      <Typography className="text-12 font-semibold">{eventInfo.timeText}</Typography>
      <Typography className="text-12 px-4 truncate">{eventInfo.event.title}</Typography>
    </div>
  );
}

export default ScheduleTab;
