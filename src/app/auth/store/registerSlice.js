/* eslint-disable camelcase */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
import { createSlice } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { createUserSettingsFirebase } from './userSlice';

export const doVerifyEmail = (email, password) => async (dispatch) => {
  if (!firebaseService.auth) {
    console.warn("Firebase Service didn't initialize, check your configuration");

    return () => false;
  }
  // should do it.
  const actionCodeSettings = {
    url: 'https://cogesplus-e8a7f.firebaseapp.com/auth-link',
    handleCodeInApp: true,
  };
  return firebaseService.auth
    .createUserWithEmailAndPassword(email, password)
    .then(async (response) => {
      if (!response.user.emailVerified) {
        return response.user
          .sendEmailVerification()
          .then(() => {
            window.localStorage.setItem('mail-confirm', email);
            firebaseService.auth.signOut();
            window.location.href = '/mail-confirm';
          })
          .catch((error) => {
            const emailErrorCodes = ['auth/email-already-in-use', 'auth/invalid-email'];
            const response1 = [];
            if (emailErrorCodes.includes(error.code)) {
              response1.push({
                type: 'email',
                message: error.message,
              });
            }
            return dispatch(registerError(response1));
          });
      }
    })
    .catch((error) => {
      const emailErrorCodes = ['auth/email-already-in-use', 'auth/invalid-email'];
      const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];
      const response = [];
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
      if (snapshot.val() !== null) {
        console.log('sssss', snapshot.key);
        const userId = Object.keys(snapshot.val());
        const { group_name } = snapshot.val()[userId];
        return firebaseService.db
          .ref(`tbl_user/${userId}`)
          .update({ email, password })
          .then(() => {
            firebaseService.auth
              .signInWithEmailAndPassword(email, password)
              .then((response) => {
                localStorage.removeItem('mail-confirm');
                localStorage.removeItem('mailchimp');
                const newPostKey = firebaseService.db.ref().child('tbl_phone_number').push().key;
                console.log('key===>', newPostKey);
                firebaseService.db
                  .ref(`tbl_phone_number/${newPostKey}`)
                  .set({ phone, group_name, uid: userId });
                dispatch(
                  createUserSettingsFirebase({
                    ...response.user,
                    phone,
                    email,
                    password,
                  })
                );
                return dispatch(registerSuccess());
              })
              .catch((err) => {
                console.log('signin error', err);
              });
          })
          .catch((error) => {
            const emailErrorCodes = ['auth/email-already-in-use', 'auth/invalid-email'];
            const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];
            const response = [];
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
          message: 'This phone is not valid',
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
    emailVerifySuccess: (state, action) => {
      state.emailVerified = true;
      state.success = false;
      state.errors = [];
    },
    emailVerifyError: (state, action) => {
      state.emailVerified = false;
      state.success = false;
      state.errors = [];
    },
    registerSuccess: (state, action) => {
      state.emailVerified = true;
      state.success = true;
      state.errors = [];
    },
    registerError: (state, action) => {
      state.emailVerified = false;
      state.success = false;
      state.errors = action.payload;
    },
  },
  extraReducers: {},
});

export const { registerSuccess, registerError, emailVerifySuccess, emailVerifyError } =
  registerSlice.actions;

export default registerSlice.reducer;
