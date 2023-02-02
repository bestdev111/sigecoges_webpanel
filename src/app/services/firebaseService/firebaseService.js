/* eslint-disable consistent-return */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
/* eslint import/no-extraneous-dependencies: off */
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import coreService from 'app/services/coreService';
import config from './firebaseServiceConfig';

class FirebaseService {
  init(success) {
    if (Object.entries(config).length === 0 && config.constructor === Object) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          'Missing Firebase Configuration at src/app/services/firebaseService/firebaseServiceConfig.js'
        );
      }
      success(false);
      return;
    }

    if (firebase.apps.length) {
      return;
    }
    firebase.initializeApp(config);
    this.db = firebase.database();
    this.auth = firebase.auth();
    success(true);
  }

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });

  subscribe = () => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.db.ref('tbl_user').on('value', async (snapshot) => {
        resolve(true);
      });
    });
  };

  getUserAllData = () => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.db.ref('tbl_user').on('value', async (snapshot) => {
        if (snapshot.numChildren !== 0) {
          const ids = Object.keys(snapshot.val());
          let temp = [];
          let index = 0;
          snapshot.forEach((snap) => {
            const userObject = snap.val();
            userObject.id = ids[index];
            temp.push(userObject);
            index++;
          });
          resolve(temp);
        }
      });
    });
  };

  getUserData = (id) => {
    if (!firebase.apps.length) {
      return false;
    }
    if (id) {
      return new Promise((resolve, reject) => {
        this.db.ref(`tbl_user`).on('value', async (snapshot) => {
          let temp = [];
          if (snapshot.numChildren !== 0) {
            temp = snapshot.val()[id];
            if (temp) temp.id = id;
          }
          resolve(temp);
        });
      });
    }
    resolve([]);
  };

  getUserWithEmail = (email) => {
    if (!firebase.apps.length) {
      return false;
    }
    if (email) {
      return new Promise((resolve, reject) => {
        this.db
          .ref(`tbl_user`)
          .orderByChild('email')
          .equalTo(email)
          .on('value', async (snapshot) => {
            if (snapshot.val()) {
              const keys = Object.keys(snapshot.val());
              const userData = snapshot.val()[keys[0]];
              resolve(userData);
            }
          });
      });
    }
    resolve();
  };

  updateUserData = (user) => {
    if (!firebase.apps.length) {
      return false;
    }
    console.log('updateUserData===>', user);
    if (user && user.uid) {
      return this.db.ref(`tbl_user/${user.uid}`).push(user);
    }
    return this.db.ref(`users`).push(user);
  };

  onAuthStateChanged = (callback) => {
    if (!this.auth) {
      return;
    }
    this.auth.onAuthStateChanged(callback);
  };

  signOut = () => {
    if (!this.auth) {
      return;
    }
    this.auth.signOut();
  };

  // Geofence
  getUserActivity = (data) => {
    if (!firebase.apps.length) {
      return false;
    }
    const id = data.uid;
    const { date } = data;
    return new Promise((resolve, reject) => {
      this.db
        .ref('tbl_geofence_report')
        .orderByChild('uid')
        .equalTo(id)
        .on('value', async (snapshot) => {
          if (snapshot.val() !== null) {
            const result = coreService.getMyReport(snapshot.val(), date);
            if (result.activity === undefined || result.activity === null) {
              reject();
            }
            resolve(result.activity);
          } else {
            resolve([]);
          }
        });
    });
  };

  getAllActivity = () => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.db.ref('tbl_geofence_report').on('value', async (snapshot) => {
        if (snapshot.val() !== null) {
          const ids = Object.keys(snapshot.val());
          // eslint-disable-next-line prefer-const
          let temp = [];
          let index = 0;
          snapshot.forEach((snap) => {
            const userObject = snap.val();
            userObject.id = ids[index];
            temp.push(userObject);
            index++;
          });
          resolve(temp);
        } else {
          resolve([]);
        }
      });
    });
  };

  getUserGeofence = () => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.db.ref('tbl_geofence').on('value', async (snapshot) => {
        if (snapshot.val() !== null) {
          resolve(snapshot.val());
        } else {
          resolve([]);
        }
      });
    });
  };

  getUserRole = (id) => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.db
        .ref('tbl_role/users')
        .orderByChild('uid')
        .equalTo(id)
        .on('value', async (snapshot) => {
          if (snapshot.val() !== null) {
            const dataId = Object.keys(snapshot.val());
            const userData = snapshot.val()[dataId];
            const data = new Promise((resolve1) => {
              this.db.ref('tbl_role/roles').on('value', async (snapshot1) => {
                if (snapshot1.val() !== null) {
                  const role = snapshot1.val();
                  resolve1(role[userData.role_id]);
                }
              });
            });
            resolve(data);
          } else {
            resolve([]);
          }
        });
    });
  };

  // get all news
  getAllNews = () => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.db.ref('tbl_news').on('value', async (snapshot) => {
        if (snapshot.val() !== null) {
          // eslint-disable-next-line prefer-const
          let temp = [];
          const ids = Object.keys(snapshot.val());
          let index = 0;
          snapshot.forEach((snap) => {
            const obj = snap.val();
            obj.id = ids[index];
            temp.push(obj);
            index++;
          });
          resolve(temp);
        }
      });
    });
  };

  allUsers = () => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.db.ref('tbl_user').on('value', async (snapshot) => {
        resolve(snapshot.val());
      });
    });
  };

  getDocs = () => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.db.ref('tbl_documents').on('value', async (snapshot) => {
        if (snapshot.val() !== null) {
          // eslint-disable-next-line prefer-const
          let temp = [];
          const ids = Object.keys(snapshot.val());
          let index = 0;
          snapshot.forEach((snap) => {
            const obj = snap.val();
            obj.id = ids[index];
            temp.push(obj);
            index++;
          });
          resolve(temp);
        }
      });
    });
  };

  getSchedules = (groupName) => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.db
        .ref('tbl_group_work')
        .orderByChild('group_name')
        .equalTo(groupName)
        .on('value', async (snapshot) => {
          if (snapshot.val() !== null) {
            // eslint-disable-next-line prefer-const
            let temp = [];
            const ids = Object.keys(snapshot.val());
            let index = 0;
            snapshot.forEach((snap) => {
              const obj = snap.val();
              obj.id = ids[index];
              temp.push(obj);
              index++;
            });
            resolve(temp);
          }
        });
    });
  };

  getAgenda = () => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.db.ref('tbl_agenda').on('value', async (snapshot) => {
        if (snapshot.val() !== null) {
          // eslint-disable-next-line prefer-const
          let temp = [];
          const ids = Object.keys(snapshot.val());
          let index = 0;
          snapshot.forEach((snap) => {
            let obj = snap.val();
            // obj.id = ids[index];
            temp.push(obj);
            index++;
          });
          resolve(temp);
        }
      });
    });
  };

  getAllSalary = () => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.db.ref('tbl_salary').on('value', async (snapshot) => {
        if (snapshot.val() !== null) {
          // eslint-disable-next-line prefer-const
          let temp = [];
          const ids = Object.keys(snapshot.val());
          let index = 0;
          snapshot.forEach((snap) => {
            const obj = snap.val();
            obj.id = ids[index];
            temp.push(obj);
            index++;
          });
          resolve(temp);
        }
      });
    });
  };

  getGeofence = () => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.db.ref('tbl_geofence').on('value', async (snapshot) => {
        if (snapshot.val() !== null) {
          // eslint-disable-next-line prefer-const
          let temp = [];
          const ids = Object.keys(snapshot.val());
          let index = 0;
          snapshot.forEach((snap) => {
            const obj = snap.val();
            obj.id = ids[index];
            temp.push(obj);
            index++;
          });
          resolve(temp);
        }
      });
    });
  };

  registerStaff = (model) => {
    if (!firebase.apps.length && model) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.db
        .ref(`tbl_phone_number`)
        .orderByChild('phone')
        .equalTo(model.phone)
        .on('value', async (snapshot) => {
          if (snapshot.val()) {
            const key = Object.keys(snapshot.val());
            if (key.length > 0) {
              console.log('return', key);
              resolve;
            }
          } else {
            const newPostKey = this.db.ref().child('tbl_phone_number').push().key;
            this.db
              .ref(`tbl_phone_number/${newPostKey}`)
              .set({ phone: model.phone, group_name: model.group_name })
              .then((result) => {
                console.log('success', result);
                resolve;
              })
              .catch((err) => resolve);
          }
        });
    });
  };
}

const instance = new FirebaseService();

export default instance;
