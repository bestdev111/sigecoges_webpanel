import { combineReducers } from '@reduxjs/toolkit';
import events from './agendaSlice';
import users from './usersSlice';

const reducer = combineReducers({
  events,
  users,
});

export default reducer;
