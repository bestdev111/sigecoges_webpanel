import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';

export const getUserRole = createAsyncThunk('role/getUserRole', async (id) => {
  const response = await firebaseService.getUserRole(id).then(
    (user) => {
      return user;
    },
    (error) => {
      return error;
    }
  );
  const data = await response;
  return [data];
});

const roleAdapter = createEntityAdapter({ selectId: (e) => e._id });

export const { selectAll: selectRole, selectById: selectProductById } = roleAdapter.getSelectors(
  (state) => state.Profile.role
);

const roleSlice = createSlice({
  name: 'role',
  initialState: roleAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [getUserRole.fulfilled]: roleAdapter.setAll,
  },
});

export default roleSlice.reducer;
