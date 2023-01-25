import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';

export const getUsers = createAsyncThunk('users/getUsers', async () => {
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

const usersAdapter = createEntityAdapter({});

export const { selectAll: selectUsers, selectById: selectProductById } = usersAdapter.getSelectors(
  (state) => {
    return state.Geofence ? state.Geofence.users : [];
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setProductsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getUsers.fulfilled]: usersAdapter.setAll,
  },
});

export const { setProductsSearchText } = usersSlice.actions;

export default usersSlice.reducer;
