/* eslint-disable consistent-return */
import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';

export const submitLoginWithFireBase =
  ({ email, password }) =>
  async (dispatch) => {
    if (!firebaseService.auth) {
      return () => false;
    }
    firebaseService.db.ref('tbl_admin').on('value', async (snapshot) => {
      if (snapshot.val() !== null && snapshot.val().email === email) {
        if (snapshot.val().password.toString() === password.toString()) {
          firebaseService.auth
            .signInWithEmailAndPassword(email, password)
            .then(() => {
              dispatch(showMessage({ message: 'successfully logged' }));
              const type = 'super_admin';
              return dispatch(loginSuccess(type));
            })
            .catch((error) => {
              const emailErrorCodes = [
                'auth/email-already-in-use',
                'auth/invalid-email',
                'auth/operation-not-allowed',
                'auth/user-not-found',
                'auth/user-disabled',
              ];
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

              return dispatch(loginError(response));
            });
        } else {
          return dispatch(
            loginError({
              type: 'password',
              message: 'Invalid Password',
            })
          );
        }
      } else {
        console.log('here');

        firebaseService.db
          .ref('tbl_user')
          .orderByChild('email')
          .equalTo(email)
          .on('value', async (snapshot1) => {
            if (snapshot1.val() !== null) {
              const userId = Object.keys(snapshot1.val());
              if (
                snapshot1.val()[userId] &&
                snapshot1.val()[userId].password.toString() === password.toString() &&
                snapshot1.val()[userId].type === 'ADMIN'
              ) {
                firebaseService.auth
                  .signInWithEmailAndPassword(email, password)
                  .then(() => {
                    dispatch(showMessage({ message: 'successfully logged' }));
                    const role = 'admin';
                    return dispatch(loginSuccess(role));
                  })
                  .catch((error) => {
                    const emailErrorCodes = [
                      'auth/email-already-in-use',
                      'auth/invalid-email',
                      'auth/operation-not-allowed',
                      'auth/user-not-found',
                      'auth/user-disabled',
                    ];
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

                    return dispatch(loginError(response));
                  });
              }
              return dispatch(
                loginError({
                  type: 'password',
                  message: 'Invalid Password',
                })
              );
            }
            return dispatch(
              loginError({
                type: 'email',
                message: 'Not found email',
              })
            );
          });
      }
    });
  };

const initialState = {
  success: false,
  errors: [],
};

const loginSlice = createSlice({
  name: 'auth/login',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    loginError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
    },
  },
  extraReducers: {},
});

export const { loginSuccess, loginError } = loginSlice.actions;

export default loginSlice.reducer;
