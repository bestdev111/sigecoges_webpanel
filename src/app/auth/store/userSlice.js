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
  const guestUser = getState().auth.user;
  const user_Data = firebase.database.ref('tbl_user').on('value', async (snapshot) => {
    if (snapshot.val() !== null) {
      const userData = {};
      for (const key in snapshot.val()) {
        if (Object.hasOwnProperty.call(snapshot.val(), key)) {
          const element = snapshot.val()[key];
          if (element.phone === authUser.phone) {
            userData.key = key;
            userData.data = element;
          }
        }
      }
      // const user = _.mapValues(snapshot.val(), (item) => {
      //   if (item.phone === authUser.phone) {
      //     return item;
      //   }
      // });
      return userData;
    }
  });
  const fuseDefaultSettings = getState().fuse.settings.defaults;
  const { currentUser } = firebase.auth();
  console.log('USERSLICE==>', user_Data, currentUser);
  /**
   * Merge with current Settings
   */
  const user = _.merge({}, user_Data.data, {
    uid: user_Data.key,
    type: 'ADMIN',
    email: authUser.email,
    password: authUser.password,
    data: {
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
