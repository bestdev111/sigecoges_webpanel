import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import FirebaseService from 'app/services/firebaseService';
// import analyticsDashboardAppDB from './analytics-dashboard-db';

export const getWidgets = createAsyncThunk('Geofence/getWidgets', async () => {
  const response = await FirebaseService.getGeofence().then(
    (widget) => {
      return widget;
    },
    (error) => {
      return error;
    }
  );
  const data = await response;
  return data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectWidgetsEntities, selectById: selectWidgetById } =
  widgetsAdapter.getSelectors((state) => state.Geofence.widgets);

const widgetsSlice = createSlice({
  name: 'Geofence',
  initialState: widgetsAdapter.getInitialState({}),
  reducers: {},
  extraReducers: {
    [getWidgets.fulfilled]: widgetsAdapter.setAll,
  },
});

export default widgetsSlice.reducer;
