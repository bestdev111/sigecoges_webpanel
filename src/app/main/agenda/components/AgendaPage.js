/* eslint-disable prefer-const */
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import FirebaseService from 'app/services/firebaseService';
import AgendaHeader from './AgendaHeader';
import EventDialog from './EventDialog';
import reducer from '../store';
import { getEvents, selectEvents, openEditEventDialog } from '../store/agendaSlice';
import { selectUsers, getUsers } from '../store/usersSlice';

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

function renderEventContent(eventInfo) {
  return (
    <div className="flex items-center">
      <Typography className="text-12 font-semibold">{eventInfo.timeText}</Typography>
      <Typography className="text-12 px-4 truncate">{eventInfo.event.title}</Typography>
    </div>
  );
}

const AgendaPage = (props) => {
  const [currentDate, setCurrentDate] = useState();
  const [agendaData, setAgendaData] = useState();
  const dispatch = useDispatch();
  const calendarRef = useRef();
  const classes = useStyles(props);
  const events = useSelector(selectEvents);
  const allUsers = useSelector(selectUsers);
  const user = useSelector(({ auth }) => auth.user);

  useEffect(() => {
    dispatch(getEvents());
    dispatch(getUsers());
  }, []);

  useEffect(() => {
    if (allUsers && user && events) {
      if (user.role === 'ADMIN') {
        FirebaseService.getUserWithEmail(user.email).then((e) => {
          let temp = [];
          events.forEach((element) => {
            if (allUsers && allUsers[0] && allUsers[0][element.uid]) {
              if (allUsers[0][element.uid].group_name === e.group_name) {
                temp.push(element);
              }
            }
          });
          setAgendaData(temp);
        });
      }
      if (user.role === 'SUPER_ADMIN') {
        setAgendaData(events);
      }
    }
  }, [allUsers, user, events]);

  const handleEventClick = (clickInfo) => {
    const { id, title, allDay, start, end, extendedProps } = clickInfo.event;
    dispatch(
      openEditEventDialog({
        id,
        title,
        allDay,
        start,
        end,
        extendedProps,
      })
    );
  };

  const handleDates = (rangeInfo) => {
    setCurrentDate(rangeInfo);
  };
  return (
    <div className={clsx(classes.root, 'flex flex-col flex-auto relative')}>
      <AgendaHeader calendarRef={calendarRef} currentDate={currentDate} />

      <div className="flex flex-1 p-24 container">
        <motion.div
          className="w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
        >
          {agendaData ? (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={false}
              initialView="dayGridMonth"
              editable
              selectable
              selectMirror
              dayMaxEvents
              weekends
              firstDay={1}
              datesSet={handleDates}
              events={agendaData}
              eventContent={renderEventContent}
              eventClick={handleEventClick}
              initialDate={new Date()}
              ref={calendarRef}
            />
          ) : null}
        </motion.div>
        <EventDialog />
      </div>
    </div>
  );
};
export default withReducer('Agenda', reducer)(AgendaPage);
