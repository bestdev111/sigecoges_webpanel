import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import firebaseService from 'app/services/firebaseService';
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';

import { setUserDataFirebase, setUserData, logoutUser } from './store/userSlice';

class Auth extends Component {
  state = {
    waitAuthCheck: true,
  };

  componentDidMount() {
    return Promise.all([
      // Comment the lines which you do not use
      this.firebaseCheck(),
    ]).then(() => {
      this.setState({ waitAuthCheck: false });
    });
  }

  firebaseCheck = () =>
    new Promise((resolve) => {
      firebaseService.init((success) => {
        if (!success) {
          resolve();
        }
      });

      firebaseService.onAuthStateChanged((authUser) => {
        if (authUser) {
          this.props.showMessage({ message: 'Logging ...' });
          console.log('here', authUser.uid);
          /**
           * Retrieve user data from Firebase
           */
          firebaseService.getUserData(authUser.uid).then(
            (user) => {
              this.props.setUserDataFirebase(user, authUser);

              resolve();

              this.props.showMessage({ message: 'Welcome' });
            },
            (error) => {
              resolve();
            }
          );
        } else {
          resolve();
        }
      });

      return Promise.resolve();
    });

  render() {
    return this.state.waitAuthCheck ? <FuseSplashScreen /> : <>{this.props.children}</>;
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout: logoutUser,
      setUserData,
      setUserDataFirebase,
      showMessage,
      hideMessage,
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(Auth);
