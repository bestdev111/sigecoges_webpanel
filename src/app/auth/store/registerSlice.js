/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
import { createSlice } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';
import { showMessage } from 'app/store/fuse/messageSlice';

export const doVerifyEmail = (email, password) => async (dispatch) => {
  if (!firebaseService.auth) {
    console.warn("Firebase Service didn't initialize, check your configuration");

    return () => false;
  }
  return firebaseService.auth.createUserWithEmailAndPassword(email, password).then((response) => {
    console.log('response', response);
    response.user.sendEmailVerification();
    firebaseService.auth.signOut();
    window.location.href = '/mail-confirm';
    window.localStorage.setItem('mail-confirm', email);
    // dispatch(
    //   createUserSettingsFirebase({
    //     ...response.user,
    //     email,
    //   })
    // );
  });
};

export const registerWithFirebase = (model) => async (dispatch) => {
  if (!firebaseService.auth) {
    console.warn("Firebase Service didn't initialize, check your configuration");

    return () => false;
  }
  const { email, password, phone } = model;

  firebaseService.db
    .ref('tbl_user')
    .orderByChild('phone')
    .equalTo(phone.toString())
    .on('value', async (snapshot) => {
      console.log('sssss', snapshot.val());
      if (snapshot.val() !== null) {
        const userId = Object.keys(snapshot.val());
        console.log('sssss', userId, snapshot.val());
        return firebaseService.db
          .ref(`tbl_user/${userId}`)
          .set({
            email,
            password,
          })
          .then((response) => {
            console.log('createUserWithEmailAndPassword', response);
            response.user.sendEmailVerification({
              url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
            });
            firebaseService.auth.signOut();
            // dispatch(
            //   createUserSettingsFirebase({
            //     ...response.user,
            //     phone,
            //     email,
            //   })
            // );
            // return dispatch(registerSuccess());
          })
          .catch((error) => {
            const usernameErrorCodes = [
              'auth/operation-not-allowed',
              'auth/user-not-found',
              'auth/user-disabled',
            ];
            const emailErrorCodes = ['auth/email-already-in-use', 'auth/invalid-email'];
            const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];
            const response = [];
            if (usernameErrorCodes.includes(error.code)) {
              response.push({
                type: 'username',
                message: error.message,
              });
            }
            if (emailErrorCodes.includes(error.code)) {
              response.push({
                type: 'email',
                message: error.message,
              });
            }
            if (passwordErrorCodes.includes(error.code)) {
              response.push({
                type: 'password',
                message: error.message,
              });
            }
            if (error.code === 'auth/invalid-api-key') {
              dispatch(showMessage({ message: error.message }));
            }
            return dispatch(registerError(response));
          });
      } else {
        console.log('error');
        const response = [];
        response.push({
          type: 'phone',
          message: 'This phone already in use or invalid',
        });
        return dispatch(registerError(response));
      }
    });
};

const initialState = {
  success: false,
  errors: [],
};

const registerSlice = createSlice({
  name: 'auth/register',
  initialState,
  reducers: {
    registerSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    registerError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
    },
  },
  extraReducers: {},
});

export const { registerSuccess, registerError } = registerSlice.actions;

export default registerSlice.reducer;
