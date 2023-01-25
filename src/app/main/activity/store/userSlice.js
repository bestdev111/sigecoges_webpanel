import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';

export const getUserAllData = createAsyncThunk('users/getUserAllData', async () => {
  const response = await firebaseService.getUserAllData().then(
    (users) => {
      return users;
    },
    (error) => {
      return error;
    }
  );
  const data = await response;
  return { users: data };
});

const usersAdapter = createEntityAdapter({ selectId: (e) => e.uid });

export const { selectAll: selectAllUsers } = usersAdapter.getSelectors(
  (state) => state.Activity.users
);

const userSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {},
  extraReducers: {
    [getUserAllData.fulfilled]: usersAdapter.setAll,
  },
});

export default userSlice.reducer;
