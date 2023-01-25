import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';

export const getAllActivity = createAsyncThunk('activity/getAllActivity', async (param) => {
  const activity = await firebaseService.getAllActivity(param).then(
    (result) => {
      return result;
    },
    (error) => {
      return error;
    }
  );
  const data = await activity;
  return { activity: data };
});

const activityAdapter = createEntityAdapter({ selectId: (e) => e._id });

export const { selectAll: selectAllActivity, selectById: selectProductById } =
  activityAdapter.getSelectors((state) => state.Activity.activity);

const activitySlice = createSlice({
  name: 'activity',
  initialState: activityAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {},
  extraReducers: {
    [getAllActivity.fulfilled]: activityAdapter.setAll,
  },
});

export default activitySlice.reducer;
