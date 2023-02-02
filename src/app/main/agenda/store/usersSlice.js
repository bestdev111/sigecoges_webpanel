import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';

export const getUsers = createAsyncThunk('users/getUsers', async () => {
  const response = await firebaseService.allUsers().then(
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

const usersAdapter = createEntityAdapter({});

export const { selectAll: selectUsers, selectById: selectProductById } = usersAdapter.getSelectors(
  (state) => {
    return state.Agenda ? state.Agenda.users : [];
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {},
  extraReducers: {
    [getUsers.fulfilled]: usersAdapter.setAll,
  },
});

export default usersSlice.reducer;
