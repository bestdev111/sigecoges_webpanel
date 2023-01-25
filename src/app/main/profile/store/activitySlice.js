import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';

export const getUserActivity = createAsyncThunk('activity/getUserActivity', async (param) => {
  const activity = await firebaseService.getUserActivity(param).then(
    (activity) => {
      return activity
    },
    (error) => {
      resolve();
    }
  );
  const data = await activity
  return { activity: data };
});
export const getUserGeofence = createAsyncThunk('activity/getUserGeofence', async () => {
  const geofence = await firebaseService.getUserGeofence().then(
    (geofence) => {
      return geofence
    },
    (error) => {
      resolve();
    }
  );
  const data = await geofence
  return { geofence: [data] };
});

const activityAdapter = createEntityAdapter({ selectId: (e) => e._id });

export const { selectAll: selectActivity, selectById: selectProductById } =
  activityAdapter.getSelectors((state) => state.Profile.activity);

const activitySlice = createSlice({
  name: 'activity',
  initialState: activityAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {},
  extraReducers: {
    [getUserActivity.fulfilled]: activityAdapter.setAll,
    [getUserGeofence.fulfilled]: (state, action) => activityAdapter.removeMany(state, action.payload),
  },
});

export default activitySlice.reducer;

