import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';

export const getUserGeofence = createAsyncThunk('geofence/getUserGeofence', async () => {
  const geofence = await firebaseService.getUserGeofence().then(
    (result) => {
      return result;
    },
    (error) => {
      return error;
    }
  );
  const data = await geofence;
  return { geofence: data };
});

const geofenceAdapter = createEntityAdapter({ selectId: (e) => e._id });

export const { selectAll: selectGeofence, selectById: selectProductById } =
  geofenceAdapter.getSelectors((state) => state.Activity.geofence);

const geofenceSlice = createSlice({
  name: 'geofence',
  initialState: geofenceAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {},
  extraReducers: {
    [getUserGeofence.fulfilled]: geofenceAdapter.setAll,
  },
});

export default geofenceSlice.reducer;
