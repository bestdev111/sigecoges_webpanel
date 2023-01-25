import { combineReducers } from '@reduxjs/toolkit';
import events from './agendaSlice';

const reducer = combineReducers({
  events,
});

export default reducer;
