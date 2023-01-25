import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';
export const getUserProfile = createAsyncThunk('profile/getUserProfile', async (id) => {
  const response = await firebaseService.getUserData(id).then(
    (user) => {
      return user
    },
    (error) => {
      resolve();
    }
  );
  const data = await response
  return { user: data };
});

const profileAdapter = createEntityAdapter({ selectId: (e) => e.uid });

export const { selectAll: selectProfile, selectById: selectProductById } =
  profileAdapter.getSelectors((state) => state.Profile.user);

const profileSlice = createSlice({
  name: 'profile',
  initialState: profileAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {},
  extraReducers: {
    [getUserProfile.fulfilled]: profileAdapter.setAll,
  },
});

export default profileSlice.reducer;

