/* eslint-disable no-restricted-syntax */
/* eslint import/no-extraneous-dependencies: off */
import { createSlice } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import 'firebase/auth';
import history from '@history';
import _ from '@lodash';
import { setInitialSettings, setDefaultSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';

export const setUserDataFirebase = (user, authUser) => async (dispatch) => {
  if (
    user &&
    user.data &&
    user.data.settings &&
    user.data.settings.theme &&
    user.data.settings.layout &&
    user.data.settings.layout.style
  ) {
    // Set user data but do not update
    return dispatch(setUserData(user));
  }

  // Create missing user settings
  return dispatch(createUserSettingsFirebase(authUser));
};

export const createUserSettingsFirebase = (authUser) => async (dispatch, getState) => {
  // const guestUser = getState().auth.user;
  // const fuseDefaultSettings = getState().fuse.settings.defaults;
  // const { currentUser } = firebase.auth();

  // /**
  //  * Merge with current Settings
  //  */
  // const user = _.merge({}, guestUser, {
  //   uid: authUser.uid,
  //   type: ['admin'],
  //   data: {
  //     email: authUser.email,
  //     settings: { ...fuseDefaultSettings },
  //   },
  // });
  // currentUser.updateProfile(user.data);

  // dispatch(updateUserData(user));

  // return dispatch(setUserData(user));
  const guestUser = getState().auth.user;
  let userKey = '';
  let userData = {};
  firebaseService.db.ref('tbl_user').on('value', async (snapshot) => {
    if (snapshot.val() !== null) {
      for (const key in snapshot.val()) {
        if (Object.hasOwnProperty.call(snapshot.val(), key)) {
          const element = snapshot.val()[key];
          if (authUser.phone) {
            if (element.phone === authUser.phone) {
              userKey = key;
              userData = element;
            }
          } else {
            userKey = key;
            userData = element;
          }
        }
      }
    }
  });
  console.log('USERSLICE==>', userKey, userData);
  const fuseDefaultSettings = getState().fuse.settings.defaults;
  const { currentUser } = firebase.auth();
  /**
   * Merge with current Settings
   */
  const user = _.merge({}, guestUser, {
    uid: authUser.uid,
    type: 'ADMIN',
    role: ['admin'],
    email: authUser.email,
    // password: userData.password,
    data: {
      email: authUser.email,
      settings: { ...fuseDefaultSettings },
    },
  });
  console.log('USERSLICE User==>', user);
  currentUser.updateProfile(user.data);

  dispatch(updateUserData(user));

  return dispatch(setUserData(user));
};

export const setUserData = (user) => async (dispatch, getState) => {
  /*
        You can redirect the logged-in user to a specific route depending on his role
         */
  console.log('I want see here', user.redirectUrl);
  user.redirectUrl = '/users';
  history.location.state = {
    redirectUrl: user.redirectUrl, // for example 'apps/academy'
  };

  /*
    Set User Settings
     */
  dispatch(setDefaultSettings(user.data.settings));

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

  if (!user.role || user.role.length === 0) {
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
  if (!user.type || user.type.length === 0) {
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
  data: {
    photoURL: 'assets/images/avatars/profile.jpg',
  },
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
