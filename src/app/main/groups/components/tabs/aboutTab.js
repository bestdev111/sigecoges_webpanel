import { useEffect, useState } from 'react';
import { AppBar, Card, CardContent, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { getUserRole, selectRole } from '../../store/roleSlice';
import AboutUs from './fakeDB';

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: '6.4rem',
  },
  active: {
    border: '3px solid #3788d8',
    height: '6.4rem',
  },
}));

function AboutTab(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const userRole = useSelector(selectRole);
  useEffect(() => {
    setData(AboutUs[0].about);
  }, []);
  useEffect(() => {
    dispatch(getUserRole(viewUser));
  }, [dispatch, viewUser]);
  if (!data) {
    return null;
  }

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
                ? props.userData.map((user) => {
                    if (user.group_name === props.groupName && user.type === 'ADMIN') {
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
                : null}
            </CardContent>
          </Card>
          <Card component={motion.div} variants={item} className="w-full mb-32 rounded-16 shadow">
            <AppBar position="static" elevation={0}>
              <Toolbar className="px-8">
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  className="flex-1 px-12 font-medium"
                >
                  Staffs
                </Typography>
              </Toolbar>
            </AppBar>
            <CardContent className="flex flex-wrap p-16">
              {props.userData
                ? props.userData.map((user) => {
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
                : null}
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
                <Typography>{userRole && userRole[0] ? userRole[0].name : null}</Typography>
              </div>

              {/* <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">Locations</Typography>

                {general.locations.map((location) => (
                  <div className="flex items-center" key={location}>
                    <Typography>{location}</Typography>
                    <Icon className="text-16 mx-4" color="action">
                      location_on
                    </Icon>
                  </div>
                ))}
              </div>

              <div className="mb-24">
                <Typography className="font-semibold mb-4 text-15">About Me</Typography>
                <Typography>{general.about}</Typography>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default AboutTab;
