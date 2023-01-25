import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';

export const getUserActivity = createAsyncThunk('activity/getUserActivity', async (param) => {
  const activity = await firebaseService.getUserActivity(param).then(
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

export const { selectAll: selectActivity, selectById: selectProductById } =
  activityAdapter.getSelectors((state) => state.Users.activity);

const activitySlice = createSlice({
  name: 'activity',
  initialState: activityAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {},
  extraReducers: {
    [getUserActivity.fulfilled]: activityAdapter.setAll,
  },
});

export default activitySlice.reducer;
