/* eslint-disable no-new */
/* eslint-disable no-restricted-syntax */
/* eslint import/no-extraneous-dependencies: off */
import { createSlice } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import 'firebase/auth';
import history from '@history';
import _ from '@lodash';
import { setInitialSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';

export const setUserDataFirebase = (user, authUser) => async (dispatch) => {
  if (user) {
    // Set user data but do not update
    return setUser(user);
  }
};

export const createUserSettingsFirebase = (authUser) => async (dispatch, getState) => {
  console.log('createUserSettingsFirebase11=>', authUser);
  const guestUser = getState().auth.user;
  const userKey = '';
  const userData = {};
  const data = new Promise((resolve, reject) => {
    firebaseService.db.ref('tbl_user').on('value', async (snapshot) => {
      if (snapshot.val() !== null && authUser.email) {
        console.log('QQQQ===>', authUser);
        if (authUser.phone && authUser.userId) {
          const key = authUser.userId[0];
          const element = snapshot.val()[key];
          console.log('registerUSER???===>', key, element);
          resolve({ userKey: key, userData: element });
        } else {
          for (const key in snapshot.val()) {
            if (Object.hasOwnProperty.call(snapshot.val(), key)) {
              const element = snapshot.val()[key];
              if (element.email === authUser.email) {
                console.log('LoginUSER???===>', key, element);
                resolve({ userKey: key, userData: element });
              }
            }
          }
        }
      }
    });
    resolve(null);
  });
  data.then((result) => {
    console.log('USERSLICE==>', result);
    if (result !== null) {
      const fuseDefaultSettings = getState().fuse.settings.defaults;
      const { currentUser } = firebase.auth();
      /**
       * Merge with current Settings
       */
      let user = null;
      if (result.userKey && result.userData && result.userData !== undefined) {
        console.log(`It's MEMBER`);
        user = _.merge({}, guestUser, {
          uid: result.userKey,
          email: result.userData.email,
          password: result.userData.password,
          data: {
            settings: { ...fuseDefaultSettings },
          },
        });
      } else {
        console.log(`It's Not MEMBER`);
        user = _.merge({}, guestUser, {
          uid: result.userKey,
          type: 'ADMIN',
          role: ['admin'],
          email: result.userData.email,
          // password: userData.password,
          data: {
            // email: authUser.email,
            settings: { ...fuseDefaultSettings },
          },
        });
      }
      console.log('USERSLICE User==>', user);
      currentUser.updateProfile(user.data);

      // dispatch(updateUserData(user));

      return dispatch(setUserData(user));
    }
  });
};

export const setUserData = (user) => async (dispatch, getState) => {
  /*
        You can redirect the logged-in user to a specific route depending on his role
         */
  // user.redirectUrl = '/';
  console.log('Please redirect!!!!');
  // window.location.href = '/';
  history.location.state = '/user';

  /*
    Set User Settings
     */
  // dispatch(setDefaultSettings(user.data.settings));

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
