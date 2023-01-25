import { combineReducers } from '@reduxjs/toolkit';
import news from './newsSlice';
import allUser from './allUserSlice';

const reducer = combineReducers({
  news,
  allUser,
});

export default reducer;
