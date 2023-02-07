import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Button, Icon, IconButton, InputAdornment } from '@material-ui/core';
import 'react-single-image-viewer/dist/index.css';
import * as yup from 'yup';
import _ from '@lodash';
import FirebaseService from 'app/services/firebaseService';
import FuseLoading from '@fuse/core/FuseLoading';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
// import { addNotification } from 'app/fuse-layouts/shared-components/notificationPanel/store/dataSlice';
// import NotificationModel from 'app/fuse-layouts/shared-components/notificationPanel/model/NotificationModel';

const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  passwordOld: yup.string().required('Please enter old password.'),
  password: yup
    .string()
    .required('Please enter new password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});
const defaultValues = {
  email: '',
  passwordOld: '',
  password: '',
  passwordConfirm: '',
};
const container = {
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
  display: 'flex',
  justifyContent: 'center',
  width: '50%',
};
function MyProfilePageContent(props) {
  const dispatch = useDispatch();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const user = useSelector(({ auth }) => auth.user);
  const { control, formState, handleSubmit, reset, setError } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role !== 'SUPER_ADMIN') {
        window.location.href = '/';
      }
    }
  }, [user]);

  function onSubmit(model) {
    FirebaseService.changeSuperProfile(model).then((result) => {
      if (result) {
        if (result.type === 'success') {
          dispatch(
            showMessage({
              message: result.message,
              autoHideDuration: 5000,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            })
          );
          reset({
            email: '',
            passwordOld: '',
            password: '',
            passwordConfirm: '',
          });
        } else {
          setError(result.type, {
            type: 'manual',
            message: result.message,
          });
        }
      }
    });
  }
  if (loading) {
    return <FuseLoading />;
  }
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-2/5">
      <div className="md:flex">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32 p-32">
          <form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-16"
                  type="text"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  label="Email"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className="text-20" color="action">
                          email
                        </Icon>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  required
                />
              )}
            />
            <Controller
              name="passwordOld"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-16"
                  type="password"
                  label="Old Password"
                  error={!!errors.passwordOld}
                  helperText={errors?.passwordOld?.message}
                  InputProps={{
                    className: 'pr-2',
                    type: showOld ? 'text' : 'password',
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowOld(!showOld)}>
                          <Icon className="text-20" color="action">
                            {showOld ? 'visibility' : 'visibility_off'}
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

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-16"
                  label="New Password"
                  error={!!errors.password}
                  type="password"
                  helperText={errors?.password?.message}
                  InputProps={{
                    className: 'pr-2',
                    type: showNew ? 'text' : 'password',
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNew(!showNew)}>
                          <Icon className="text-20" color="action">
                            {showNew ? 'visibility' : 'visibility_off'}
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

            <Controller
              name="passwordConfirm"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-16"
                  type="password"
                  label="Confirm Password"
                  error={!!errors.passwordConfirm}
                  helperText={errors?.passwordConfirm?.message}
                  InputProps={{
                    className: 'pr-2',
                    type: showConfirm ? 'text' : 'password',
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                          <Icon className="text-20" color="action">
                            {showConfirm ? 'visibility' : 'visibility_off'}
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
      </div>
    </motion.div>
  );
}
export default MyProfilePageContent;
