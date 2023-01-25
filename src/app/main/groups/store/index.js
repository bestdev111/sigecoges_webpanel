import { combineReducers } from '@reduxjs/toolkit';
import groups from './groupsSlice';
import schedule from './scheduleSlice';
import docs from './docsSlice';
import salary from './salarySlice';
import role from './roleSlice';
import widgets from './widgetsSlice';

const reducer = combineReducers({
  groups,
  schedule,
  docs,
  salary,
  role,
  widgets,
});

export default reducer;
