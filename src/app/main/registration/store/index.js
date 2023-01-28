import { combineReducers } from '@reduxjs/toolkit';
import register from './registerSlice';
const reducer = combineReducers({
  register
});

export default reducer;
