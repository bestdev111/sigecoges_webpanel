import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';

export const allUsers = createAsyncThunk('news/allUsers', async () => {
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

const newsAdapter = createEntityAdapter({ selectId: (e) => e.uid });

export const { selectAll: selectAllUser } = newsAdapter.getSelectors((state) => state.News.allUser);

const allUserSlice = createSlice({
  name: 'news',
  initialState: newsAdapter.getInitialState({
    searchText: '',
  }),
  extraReducers: {
    [allUsers.fulfilled]: newsAdapter.setAll,
  },
});
export default allUserSlice.reducer;
