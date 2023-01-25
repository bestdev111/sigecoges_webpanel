import { combineReducers } from '@reduxjs/toolkit';
import activity from './activitySlice';
import geofence from './geofenceSlice';
import users from './userSlice';

const reducer = combineReducers({
  geofence,
  activity,
  users,
});

export default reducer;
