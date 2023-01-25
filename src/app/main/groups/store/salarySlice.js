import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';

export const getPayments = createAsyncThunk('groups/getPayments', async () => {
  const response = await firebaseService.getAllSalary().then(
    (salary) => {
      return salary;
    },
    (error) => {
      return error;
    }
  );
  const data = await response;
  return { users: data };
});

const salaryAdapter = createEntityAdapter({});

export const { selectAll: selectPayments, selectById: selectProductById } =
  salaryAdapter.getSelectors((state) => state.Groups.salary);

const salarySlice = createSlice({
  name: 'groups',
  initialState: salaryAdapter.getInitialState({}),
  reducers: {},
  extraReducers: {
    [getPayments.fulfilled]: salaryAdapter.setAll,
  },
});

export default salarySlice.reducer;
