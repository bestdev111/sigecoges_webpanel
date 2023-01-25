import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import formatISO from 'date-fns/formatISO';
import FirebaseService from 'app/services/firebaseService';
// import fakeCalendarDB from './fakeCalendarDB';

export const dateFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

export const getEvents = createAsyncThunk('Agenda/getEvents', async () => {
  const response = FirebaseService.getAgenda().then(
    (agenda) => {
      // eslint-disable-next-line prefer-const
      let temp = [];
      if (agenda && agenda[0] !== undefined) {
        agenda.forEach((element, index) => {
          // eslint-disable-next-line prefer-const
          let obj = {
            id: index,
            start: formatISO(new Date(element.dateTimestamp)),
            end: formatISO(new Date(element.dateTimestamp)),
            // start: CoreService.getFullDateStringFromTimestamp(element.dateTimestamp),
            // end: CoreService.getFullDateStringFromTimestamp(element.dateTimestamp),
            allDay: false,
            title: element.content,
          };
          temp.push(obj);
        });
      }

      console.log('===>', temp, agenda);
      return temp;
    },
    (error) => {
      return error;
    }
  );
  const data = await response;

  return data;
});

export const addEvent = createAsyncThunk('Agenda/addEvent', async (newEvent, { dispatch }) => {
  const response = await axios.post('/api/calendar-app/add-event', {
    newEvent,
  });
  const data = await response.data;

  return data;
});

export const updateEvent = createAsyncThunk('Agenda/updateEvent', async (event, { dispatch }) => {
  const response = await axios.post('/api/calendar-app/update-event', { event });
  const data = await response.data;

  return data;
});

export const removeEvent = createAsyncThunk(
  'Agenda/remove-event',
  async (eventId, { dispatch }) => {
    const response = await axios.post('/api/calendar-app/remove-event', { eventId });
    const data = await response.data;

    return data.id;
  }
);

const agendaAdapter = createEntityAdapter({});

export const {
  selectAll: selectEvents,
  selectIds: selectEventIds,
  selectById: selectEventById,
} = agendaAdapter.getSelectors((state) => state.Agenda.events);

const agendaSlice = createSlice({
  name: 'Agenda',
  initialState: agendaAdapter.getInitialState({
    eventDialog: {
      type: 'new',
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    openNewEventDialog: {
      prepare: (event) => {
        const payload = {
          type: 'new',
          props: {
            open: true,
          },
          data: {
            start: formatISO(event.start),
            end: formatISO(event.end),
          },
        };
        return { payload };
      },
      reducer: (state, action) => {
        state.eventDialog = action.payload;
      },
    },
    openEditEventDialog: {
      prepare: (event) => {
        const payload = {
          type: 'edit',
          props: {
            open: true,
          },
          data: {
            ...event,
            start: formatISO(new Date(event.start)),
            end: formatISO(new Date(event.end)),
          },
        };
        return { payload };
      },
      reducer: (state, action) => {
        state.eventDialog = action.payload;
      },
    },
    closeNewEventDialog: (state, action) => {
      state.eventDialog = {
        type: 'new',
        props: {
          open: false,
        },
        data: null,
      };
    },
    closeEditEventDialog: (state, action) => {
      state.eventDialog = {
        type: 'edit',
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getEvents.fulfilled]: agendaAdapter.setAll,
    [addEvent.fulfilled]: agendaAdapter.addOne,
    [updateEvent.fulfilled]: agendaAdapter.upsertOne,
    [removeEvent.fulfilled]: agendaAdapter.removeOne,
  },
});

export const {
  openNewEventDialog,
  closeNewEventDialog,
  openEditEventDialog,
  closeEditEventDialog,
} = agendaSlice.actions;

export default agendaSlice.reducer;
