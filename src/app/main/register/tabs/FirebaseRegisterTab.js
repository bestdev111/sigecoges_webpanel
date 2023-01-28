import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerWithFirebase, doVerifyEmail } from 'app/auth/store/registerSlice';
import * as yup from 'yup';
import _ from '@lodash';
import { Typography } from '@material-ui/core';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  phone: yup.number().required('You must enter a valid phone number'),
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  // passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const defaultValues = {
  phone: '',
  email: '',
  password: '',
  // passwordConfirm: '',
};

function FirebaseRegisterTab(props) {
  const dispatch = useDispatch();
  const authRegister = useSelector(({ auth }) => auth.register);

  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);
  const { control, formState, handleSubmit, reset, setError } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    authRegister.errors.forEach((error) => {
      setError(error.type, {
        type: 'manual',
        message: error.message,
      });
    });
  }, [authRegister.errors, setError]);

  function onSubmit(model) {
    dispatch(registerWithFirebase(model));
  }
  function verifyEmailFunc() {
    dispatch(
      doVerifyEmail(
        control.fieldsRef.current.email._f.value,
        control.fieldsRef.current.password._f.value
      )
    );
  }
  return (
    <div className="w-full">
      <form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>
        <Typography className="mb-10">First of all, You need to verify Email address</Typography>
        <Controller
          name="email"
          control={control}
          render={({ field }) => {
            return (
              <TextField
                {...field}
                className="mb-16"
                type="text"
                disabled={verifiedEmail}
                error={!!errors.email}
                helperText={errors?.email?.message}
                label="Email"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {verifiedEmail ? (
                        <Icon className="text-20" color="action">
                          mark_email_read
                        </Icon>
                      ) : (
                        <Icon className="text-20" color="action">
                          email
                        </Icon>
                      )}
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                required
              />
            );
          }}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-16"
              type="password"
              label="Password"
              disabled={verifiedEmail}
              error={!!errors.password}
              helperText={errors?.password?.message}
              InputProps={{
                type: showPassword ? 'text' : 'password',
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton className="p-0" onClick={() => setShowPassword(!showPassword)}>
                      <Icon className="text-20" color="action">
                        {showPassword ? 'visibility' : 'visibility_off'}
                      </Icon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
            />
          )}
        />
        {!verifiedEmail ? (
          <Button
            type="button"
            variant="contained"
            color="primary"
            className="w-full mx-auto my-16"
            aria-label="Verify Email"
            value="legacy"
            onClick={verifyEmailFunc}
          >
            Verify Email
          </Button>
        ) : null}

        <Controller
          name="phone"
          control={control}
          render={({ field }) => {
            return (
              <TextField
                {...field}
                className="mb-16"
                type="text"
                label="Phone Number"
                placeholder="+2251234567890"
                disabled={!verifiedEmail}
                error={!!errors.phone}
                helperText={errors?.phone?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon className="text-20" color="action">
                        phone_android
                      </Icon>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                required
              />
            );
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-full mx-auto mt-16"
          aria-label="REGISTER"
          disabled={_.isEmpty(dirtyFields) || !isValid}
          value="legacy"
        >
          Register
        </Button>
      </form>
    </div>
  );
}

export default FirebaseRegisterTab;
