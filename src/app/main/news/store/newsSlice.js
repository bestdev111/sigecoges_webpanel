import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';

export const getAllNews = createAsyncThunk('news/getAllNews', async () => {
  const response = await firebaseService.getAllNews().then(
    (news) => {
      return news;
    },
    (error) => {
      return error;
    }
  );
  const data = await response;
  return { news: data };
});

const newsAdapter = createEntityAdapter({ selectId: (e) => e.uid });

export const { selectAll: selectAllNews } = newsAdapter.getSelectors((state) => state.News.news);

const newsSlice = createSlice({
  name: 'news',
  initialState: newsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    getAllUsers: (state, action) => {
      state.state = true;
      state.data = {
        ...action.payload,
      };
    },
  },
  extraReducers: {
    [getAllNews.fulfilled]: newsAdapter.setAll,
  },
});
export const { getAllUsers } = newsSlice.actions;
export default newsSlice.reducer;
