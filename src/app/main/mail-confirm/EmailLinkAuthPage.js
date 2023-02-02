/* eslint-disable no-return-assign */
import { useEffect, useCallback, useRef, useState } from 'react';
import FirebaseService from 'app/services/firebaseService';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Card, CardContent, Icon, Typography } from '@material-ui/core';

const EmailLinkAuthPage = (props) => {
  const [loading, setLoading] = useState(false);
  const requestExecutedRef = useRef();
  // const { state, setError } = useRequestState();
  const redirectToRegister = useCallback(() => {
    return (window.location.href = '/register');
  }, [window.location.href]);

  const [seconds, setSeconds] = useState(5);
  const [validCode, setValidCode] = useState(false);
  const [verifiedCode, setVerifiedCode] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setLoading(true);
      if (seconds === 0) {
        return;
      }
      setSeconds(seconds - 1);
    }, 1000);
    // clearing interval
    return () => clearInterval(timer);
  });
  // useEffect(() => {
  //   console.log('really?', props.actionCode);
  //   FirebaseService.auth.applyActionCode(props.actionCode).then(
  //     (result) => {
  //       // Email address has been verified.
  //       console.log('really?', result);
  //       setValidCode(true);
  //       setVerifiedCode(true);
  //     },
  //     (err) => {
  //       // Code is invalid or expired. Ask the user to verify their email address
  //       // again.
  //       setValidCode(false);
  //       setVerifiedCode(true);
  //       setError(err.message);
  //     }
  //   );
  // }, []);
  useEffect(() => {
    if (seconds === 0) {
      setLoading(false);
    }
  }, [seconds]);
  // in this effect, we execute the functions to log the user in
  useEffect(() => {
    if (seconds === 0) {
      // let's prevent duplicate calls (which should only happen in dev mode)
      if (requestExecutedRef.current) {
        return;
      }
      // do not run on the server
      if (!window.location.href) {
        // setError('generic');
        return;
      }
      // let's verify the auth method is email link
      // if (!FirebaseService.auth.isSignInWithEmailLink(window.location.href)) {
      //   console.log(
      //     'how can I set?',
      //     window.location.href,
      //     FirebaseService.auth.isSignInWithEmailLink(
      //       'https://cogesplus-e8a7f.firebaseapp.com/__/auth/action?mode=verifyEmail&oobCode=t9vXwrpjTvTrBfkC15xFpwTcyogp6MZiXwMv0tRAXy8AAAGF-n0-hA&apiKey=AIzaSyAPN9lu_Vp1jxV1Ih-cn-sp0qBsPvbWGms&lang=en'
      //     )
      //   );
      //   // setError('generic');
      //   return;
      // }
      const email = localStorage.getItem('mail-confirm');
      // let's get email used to get the link
      if (!email) {
        // setError('generic');
        return;
      }
      Func(email, window.location.href);
    }
  }, [FirebaseService.auth, loading, seconds, redirectToRegister]);

  const Func = (email, href) => {
    console.log('here is func');
    requestExecutedRef.current = true;
    console.log('here is func', requestExecutedRef);
    try {
      // sign in with link, and retrieve the ID Token
      // await signInWithEmailLink(auth, email, href);
      localStorage.setItem('mailchimp', 'auth');
      redirectToRegister();
    } catch (e) {
      return e;
    }
  };
  return (
    <div className={clsx('flex flex-col flex-auto items-center justify-center p-16 sm:p-32')}>
      <div className="flex flex-col items-center justify-center w-full">
        <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="w-full max-w-384">
            <CardContent className="flex flex-col items-center justify-center p-16 sm:p-24 md:p-32">
              <div className="m-32">
                <Icon className="text-96" color="action">
                  email
                </Icon>
              </div>

              <Typography variant="h5" className="text-center mb-16 font-semibold">
                Configuration!
              </Typography>

              <Typography className="text-center mb-16 w-full" color="textSecondary">
                Successfully verified Email!
              </Typography>

              <div className="flex flex-col items-center justify-center pt-32 pb-24">
                Automatically redirect to register page {seconds}s later
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
export default EmailLinkAuthPage;
