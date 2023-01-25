import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';

export const getGroups = createAsyncThunk('groups/getGroups', async () => {
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

const groupsAdapter = createEntityAdapter({});

export const { selectAll: selectGroups, selectById: selectProductById } =
  groupsAdapter.getSelectors((state) => {
    return state.Groups ? state.Groups.groups : [];
  });

const groupsSlice = createSlice({
  name: 'groups',
  initialState: groupsAdapter.getInitialState({
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
    [getGroups.fulfilled]: groupsAdapter.setAll,
  },
});

export const { setProductsSearchText } = groupsSlice.actions;

export default groupsSlice.reducer;
