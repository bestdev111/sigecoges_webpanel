import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';

export const getDocs = createAsyncThunk('docs/getDocs', async () => {
  const response = await firebaseService.getDocs().then(
    (docs) => {
      return docs;
    },
    (error) => {
      return error;
    }
  );
  const data = await response;
  return { docs: data };
});

const docsAdapter = createEntityAdapter({});

export const { selectAll: selectDocs, selectById: selectProductById } = docsAdapter.getSelectors(
  (state) => state.Groups.docs
);

const docsSlice = createSlice({
  name: 'docs',
  initialState: docsAdapter.getInitialState({
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
    [getDocs.fulfilled]: docsAdapter.setAll,
  },
});

export const { setProductsSearchText } = docsSlice.actions;

export default docsSlice.reducer;
