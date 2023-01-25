const prodConfig = {
  apiKey: "AIzaSyASnkgZ7YNaYy60vm7vaYlVkYWbM_nzIqE",
  authDomain: "cogesplus-e8a7f.firebaseapp.com",
  databaseURL: "https://cogesplus-e8a7f-default-rtdb.firebaseio.com",
  projectId: "cogesplus-e8a7f",
  storageBucket: "cogesplus-e8a7f.appspot.com",
  messagingSenderId: "268245735019",
  appId: "1:268245735019:web:5eaff1e7346a2700e4832e",
  measurementId: "G-4FEKTDGJZX"
};

const devConfig = {
  apiKey: "AIzaSyASnkgZ7YNaYy60vm7vaYlVkYWbM_nzIqE",
  authDomain: "cogesplus-e8a7f.firebaseapp.com",
  databaseURL: "https://cogesplus-e8a7f-default-rtdb.firebaseio.com",
  projectId: "cogesplus-e8a7f",
  storageBucket: "cogesplus-e8a7f.appspot.com",
  messagingSenderId: "268245735019",
  appId: "1:268245735019:web:5eaff1e7346a2700e4832e",
  measurementId: "G-4FEKTDGJZX"
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default config;
