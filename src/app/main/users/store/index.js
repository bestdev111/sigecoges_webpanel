import { combineReducers } from '@reduxjs/toolkit';
import users from './usersSlice';
import user from './profileSlice';
import role from './roleSlice';
import activity from './activitySlice';
import geofence from './geofenceSlice';

const reducer = combineReducers({
  users,
  user,
  activity,
  geofence,
  role,
});

export default reducer;
