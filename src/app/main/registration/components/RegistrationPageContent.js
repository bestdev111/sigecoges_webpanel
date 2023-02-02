/* eslint-disable camelcase */
/* eslint-disable no-const-assign */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  TextField,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  FormHelperText,
} from '@material-ui/core';
import 'react-single-image-viewer/dist/index.css';
import * as yup from 'yup';
import _ from '@lodash';
import { makeStyles } from '@material-ui/core/styles';
import FirebaseService from 'app/services/firebaseService';
import CoreService from 'app/services/coreService';
import FuseLoading from '@fuse/core/FuseLoading';
import { useSelector } from 'react-redux';

const schema = yup.object().shape({
  phone: yup.number().required('You must enter staff phone number'),
});
const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
    marginBottom: theme.spacing(4),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const container = {
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
  display: 'flex',
  justifyContent: 'center',
};
function RegistrationPageContent(props) {
  const classes = useStyles(props);
  const user = useSelector(({ auth }) => auth.user);
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues: { phone: '' },
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const [selectGroup, setSelectGroup] = useState('');
  const [userData, setUserData] = useState('');
  const [groupList, setGroupList] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myGroup, setMyGroup] = useState();

  useEffect(() => {
    fetchUserData().then(() => setLoading(false));
    if (user) {
      FirebaseService.getUserWithEmail(user.email).then((data) => {
        setMyGroup(data.group_name);
      });
    }
  }, []);

  useEffect(() => {
    setError(false);
  }, [selectGroup]);

  const fetchUserData = async () => {
    await FirebaseService.getUserAllData().then(
      (users) => {
        const group = CoreService.getGroupList(users);
        setGroupList(group);
        return users;
      },
      (error) => {
        return error;
      }
    );
  };

  const handleChange = (event) => {
    setSelectGroup(event.target.value);
  };
  function onSubmit(model) {
    if (selectGroup.length === 0) {
      setError(true);
      return;
    }
    model.group_name = selectGroup;
    FirebaseService.registerStaff(model).then((result) => {
      if (result) {
        reset({ phone: '' });
        setSelectGroup('');
        setError(false);
      }
    });
  }
  if (loading) {
    return <FuseLoading />;
  }
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <div className="md:flex">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32 p-32">
          <form
            name="registerForm"
            noValidate
            className="flex flex-col justify-center w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl
              name="group_name"
              variant="outlined"
              className={classes.formControl}
              control={control}
            >
              <InputLabel id="demo-simple-select-outlined-label">Group Name</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={selectGroup}
                onChange={handleChange}
                label="Group Name"
                type="group_name"
                error={!!errors.group_name}
              >
                {myGroup && user.role === 'ADMIN' ? (
                  <MenuItem value={myGroup}>
                    <em>{myGroup}</em>
                  </MenuItem>
                ) : (
                  <>
                    <MenuItem value="">
                      <em>Please select group</em>
                    </MenuItem>
                    {groupList.length > 0
                      ? groupList.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })
                      : null}
                  </>
                )}
              </Select>
              {error ? (
                <FormHelperText className="text-red-700">Please select a group</FormHelperText>
              ) : null}
            </FormControl>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-16"
                  label="Phone"
                  autoFocus
                  placeholder="+2251234567890"
                  type="phone"
                  error={!!errors.phone}
                  helperText={errors?.phone?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Button
              variant="contained"
              color="primary"
              className="w-full mx-auto mt-16"
              aria-label="Register"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
            >
              Create an account
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
export default RegistrationPageContent;
