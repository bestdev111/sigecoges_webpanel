/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import {
  AppBar,
  Card,
  CardContent,
  Toolbar,
  Typography,
  Grid,
  Icon,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import firebaseService from 'app/services/firebaseService';
// import { getUserRole, selectRole } from '../../store/roleSlice';

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: '6.4rem',
  },
  active: {
    border: '3px solid #3788d8',
    height: '6.4rem',
  },
}));

const container = {
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};
const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

function AboutTab(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchStaff, setSearchStaff] = useState('');
  const [viewUser, setViewUser] = useState(null);
  const [staff, setStaff] = useState([]);
  const [staffNum, setStaffNum] = useState(0);
  const [userRole, setUserRole] = useState(0);
  // const userRole = useSelector(selectRole);

  useEffect(() => {
    if(viewUser){
      fetchUserRole(viewUser);
    }
    // dispatch(getUserRole(viewUser));
  }, [dispatch, viewUser]);
    
  const fetchUserRole = async (id) => {
    await firebaseService.getUserRole(id).then(
      (user) => {
        setUserRole(user);
        return user;
      },
      (error) => {
        return error;
      }
    );
  }

  useEffect(() => {
    if(props.userData && props.groupName) {
      let temp = [];
      props.userData.forEach(element => {
        if(element.group_name === props.groupName && element.type === 'STAFF'){
          if(searchStaff.length > 0) {
            if(element.name.toLowerCase().includes(searchStaff.toLowerCase()) || element.phone.includes(searchStaff)) {
              temp.push(element);
            }
          } else {
            temp.push(element);
          }
        }
      });
      setStaff(temp);
      setStaffNum(temp.length);
    }
  }, [props.userData, props.groupName, searchStaff]);
  
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <div className="md:flex max-w-2xl">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32 ">
          <Card component={motion.div} variants={item} className="w-full mb-32 rounded-16 shadow">
            <AppBar position="static" elevation={0}>
              <Toolbar className="px-8">
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  className="flex-1 px-12 font-medium"
                >
                  Admin
                </Typography>
              </Toolbar>
            </AppBar>
            <CardContent className="flex flex-wrap p-16">
              {props.userData
                ? props.userData.map((user, index) => {
                    if (user.group_name === props.groupName && user.type === 'ADMIN') {
                      return (
                        <img
                          key={index}
                          className={
                            user.id === viewUser
                              ? clsx(
                                  classes.active,
                                  'object-cover w-64 m-4 rounded-16 block cursor-pointer'
                                )
                              : clsx(
                                  classes.avatar,
                                  'object-cover w-64 m-4 rounded-16 block cursor-pointer'
                                )
                          }
                          src={user.photo}
                          alt={user.name}
                          onClick={() => setViewUser(user.id)}
                        />
                      );
                    }
                  })
                : null}
            </CardContent>
          </Card>
          <Card component={motion.div} variants={item} className="w-full mb-32 rounded-16 shadow">
            <AppBar position="static" elevation={0}>
              <Toolbar className="w-full px-8 flex justify-between">
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  className="flex-1 px-12 font-medium"
                >
                  Staffs
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  className="flex justify-end flex-1 px-12 font-medium"
                >
                  {staffNum} Staffs
                </Typography>
              </Toolbar>
            </AppBar>
            <CardContent className="flex flex-wrap p-16">
              <Grid container spacing={1} alignItems="flex-end" className="justify-end mb-3">
                <Grid item>
                  <Icon>search</Icon>
                </Grid>
                <Grid item>
                  <TextField
                    id="input-with-icon-grid"
                    label="Search staff"
                    onChange={(e) => setSearchStaff(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid className='flex overflow-y-scroll'>
                {staff
                  ? staff.map((user) => {
                      if (user.group_name === props.groupName && user.type === 'STAFF') {
                        return (
                          <img
                            key={user.id}
                            className={
                              user.id === viewUser
                                ? clsx(
                                    classes.active,
                                    'object-cover w-64 m-4 rounded-16 block cursor-pointer'
                                  )
                                : clsx(
                                    classes.avatar,
                                    'object-cover w-64 m-4 rounded-16 block cursor-pointer'
                                  )
                            }
                            src={user.photo}
                            alt={user.name}
                            onClick={() => setViewUser(user.id)}
                          />
                        );
                      }
                    })
                  : <>No Staff</>}
              </Grid>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col md:w-320">
          <Card component={motion.div} variants={item} className="w-full mb-32 rounded-16 shadow">
            <AppBar position="static" elevation={0}>
              <Toolbar className="px-8">
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  className="flex-1 px-12 font-medium"
                >
                  Information
                </Typography>
              </Toolbar>
            </AppBar>

            <CardContent>
              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Name</Typography>
                <Typography>
                  {props.userData
                    ? props.userData.map((user) => {
                        if (user.id === viewUser) {
                          return user.name;
                        }
                      })
                    : null}
                </Typography>
              </div>

              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Phone</Typography>
                <Typography>
                  {props.userData
                    ? props.userData.map((user) => {
                        if (user.id === viewUser) {
                          return `+${user.phone}`;
                        }
                      })
                    : null}
                </Typography>
              </div>
              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Info</Typography>
                <Typography>
                  {props.userData
                    ? props.userData.map((user) => {
                        if (user.id === viewUser) {
                          return user.info;
                        }
                      })
                    : null}
                </Typography>
              </div>
              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Role</Typography>
                <Typography>{userRole ? userRole.name : null}</Typography>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default AboutTab;
