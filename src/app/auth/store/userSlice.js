/* eslint-disable consistent-return */
import { createSlice } from '@reduxjs/toolkit';
import 'firebase/auth';
import history from '@history';
import _ from '@lodash';
import { setInitialSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';

export const setUserDataFirebase = (user) => async (dispatch) => {
  if (user) {
    return setUser(user);
  }
};

export const setUserData = (user) => async (dispatch, getState) => {
  /*
    You can redirect the logged-in user to a specific route depending on his role
      */
  // history.location.state = '/dashboard';
  history.location.href = '/dashboard';
  dispatch(setUser(user));
};

export const updateUserSettings = (settings) => async (dispatch, getState) => {
  const oldUser = getState().auth.user;
  const user = _.merge({}, oldUser, { data: { settings } });

  dispatch(updateUserData(user));

  return dispatch(setUserData(user));
};

export const updateUserShortcuts = (shortcuts) => async (dispatch, getState) => {
  const { user } = getState().auth;
  const newUser = {
    ...user,
    data: {
      ...user.data,
    },
  };
  dispatch(updateUserData(user));
  return dispatch(setUserData(newUser));
};

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState().auth;

  if (!user.type && (user.type === 'ADMIN' || user.type === 'SUPER_ADMIN')) {
    // is guest
    return null;
  }
  history.push({
    pathname: '/login',
  });
  firebaseService.signOut();
  dispatch(setInitialSettings());
  return dispatch(userLoggedOut());
};

export const updateUserData = (user) => async (dispatch, getState) => {
  if (!user.type) {
    // is guest
    return;
  }
  firebaseService
    .updateUserData(user)
    .then(() => {
      dispatch(showMessage({ message: 'User data saved to firebase' }));
    })
    .catch((error) => {
      dispatch(showMessage({ message: error.message }));
    });
};

const initialState = {
  type: [], // guest
};

const userSlice = createSlice({
  name: 'auth/user',
  initialState,
  reducers: {
    setUser: (state, action) => action.payload,
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {},
});

export const { setUser, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
