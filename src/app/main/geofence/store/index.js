import { combineReducers } from '@reduxjs/toolkit';
import widgets from './widgetsSlice';
import users from './usersSlice';

const reducer = combineReducers({
  widgets,
  users,
});

export default reducer;
