const prodConfig = {
  apiKey: 'AIzaSyAXkZSX-YCUwNE_7URaxD5xHWRVnac5nas',
  authDomain: 'sigecoges.firebaseapp.com',
  databaseURL: 'https://sigecoges-default-rtdb.firebaseio.com',
  projectId: 'sigecoges',
  storageBucket: 'sigecoges.appspot.com',
  messagingSenderId: '1066446609711',
  appId: '1:1066446609711:web:b49e1e9e6231e2237155da',
  measurementId: 'G-98HPWEV1VN',
};

const devConfig = {
  apiKey: 'AIzaSyASnkgZ7YNaYy60vm7vaYlVkYWbM_nzIqE',
  authDomain: 'cogesplus-e8a7f.firebaseapp.com',
  databaseURL: 'https://cogesplus-e8a7f-default-rtdb.firebaseio.com',
  projectId: 'cogesplus-e8a7f',
  storageBucket: 'cogesplus-e8a7f.appspot.com',
  messagingSenderId: '268245735019',
  appId: '1:268245735019:web:5eaff1e7346a2700e4832e',
  measurementId: 'G-4FEKTDGJZX',
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default config;
