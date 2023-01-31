import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FirebaseService from 'app/services/firebaseService';
import formatISO from 'date-fns/formatISO';
import CoreService from 'app/services/coreService';

export const dateFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

export const getEvents = createAsyncThunk('Groups/getEvents', async (groupName) => {
  const response = FirebaseService.getSchedules(groupName).then(
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
      return temp;
    },
    (error) => {
      return error;
    }
  );
  const data = await response;

  return data;
});

export const addEvent = createAsyncThunk('Groups/addEvent', async (newEvent, { dispatch }) => {
  const response = await axios.post('/api/calendar-app/add-event', {
    newEvent,
  });
  const data = await response.data;

  return data;
});

export const updateEvent = createAsyncThunk('Groups/updateEvent', async (event, { dispatch }) => {
  const response = await axios.post('/api/calendar-app/update-event', { event });
  const data = await response.data;

  return data;
});

export const removeEvent = createAsyncThunk(
  'Groups/remove-event',
  async (eventId, { dispatch }) => {
    const response = await axios.post('/api/calendar-app/remove-event', { eventId });
    const data = await response.data;

    return data.id;
  }
);

const scheduleAdapter = createEntityAdapter({});

export const {
  selectAll: selectEvents,
  selectIds: selectEventIds,
  selectById: selectEventById,
} = scheduleAdapter.getSelectors((state) => state.Groups.schedule);

const scheduleSlice = createSlice({
  name: 'Groups',
  initialState: scheduleAdapter.getInitialState({
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
    [getEvents.fulfilled]: scheduleAdapter.setAll,
    [addEvent.fulfilled]: scheduleAdapter.addOne,
    [updateEvent.fulfilled]: scheduleAdapter.upsertOne,
    [removeEvent.fulfilled]: scheduleAdapter.removeOne,
  },
});

export const {
  openNewEventDialog,
  closeNewEventDialog,
  openEditEventDialog,
  closeEditEventDialog,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
