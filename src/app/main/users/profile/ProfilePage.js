import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import firebaseService from 'app/services/firebaseService';
import { Typography, Icon, Avatar, Grid } from '@material-ui/core';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import FuseNavBadge from '@fuse/core/FuseNavigation/FuseNavBadge';
import reducer from '../store';
import Activity from './Activity';

const useStyles = makeStyles((theme) => ({
  avatar: {
    border: `4px solid ${theme.palette.background.default}`,
  },
  topBg: {
    background: 'url("assets/images/profile/morain-lake.jpg")!important',
    backgroundSize: 'cover!important',
    backgroundPosition: 'center center!important',
  },
  layoutHeader: {
    background: 'none',
    height: 100,
    minHeight: 100,
    [theme.breakpoints.down('md')]: {
      height: 80,
      minHeight: 80,
    },
  },
  badge: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
function ProfilePage() {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const classes = useStyles();
  // const user = useSelector(({ auth }) => auth.user);
  const [userData, setUserData] = useState();
  const [userRole, setUserRole] = useState();
  useEffect(() => {
    const { userId } = routeParams;
    if (userId) {
      fetchUserData(userId);
      fetchUserRole(userId);
    }
  }, [dispatch, routeParams]);

  const fetchUserData = async (id) => {
    await firebaseService.getUserData(id).then(
      (user) => {
        setUserData(user);
        return user;
      },
      (error) => {
        return error;
      }
    );
  };
  const fetchUserRole = async (id) => {
    const response = await firebaseService.getUserRole(id).then(
      (user) => {
        setUserRole(user);
        return user;
      },
      (error) => {
        return error;
      }
    );
  };

  return (
    <FusePageSimple
      classes={{
        topBg: classes.topBg,
        header: classes.layoutHeader,
        wrapper: 'bg-transparent',
        content: 'w-full max-w-2xl mx-auto',
        toolbar: 'w-full max-w-2xl mx-auto relative flex flex-col min-h-auto h-auto items-start',
      }}
      header={<></>}
      contentToolbar={
        <>
          <div className="w-full px-24 pb-10 flex flex-col md:flex-row flex-1 items-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.1 } }}>
              <Avatar
                className={clsx(classes.avatar, '-mt-128  w-128 h-128')}
                src={userData ? userData.photo : 'assets/images/avatars/profile.jpg'}
              />
            </motion.div>
            <div className="flex flex-col md:flex-row flex-1 items-left justify-between p-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                {userData && userRole ? (
                  <>
                    <Grid container className="pb-10">
                      <Grid item>
                        <Typography
                          className="md:px-16 text-24 md:text-32 font-semibold tracking-tight"
                          variant="h4"
                          color="inherit"
                        >
                          {userData ? userData.name : 'guest'}
                        </Typography>
                      </Grid>
                      <Grid item className={classes.badge}>
                        {userData ? (
                          <FuseNavBadge
                            className="mx-4"
                            badge={
                              userData.type === 'ADMIN'
                                ? {
                                    title: userData.type,
                                    bg: '#F44336',
                                    fg: '#FFFFFF',
                                  }
                                : {
                                    title: userData.type,
                                    bg: '#ff6f00',
                                    fg: '#FFFFFF',
                                  }
                            }
                          />
                        ) : null}
                      </Grid>
                    </Grid>
                    <Grid container spacing={4}>
                      <Grid item xs={6} className="flex">
                        <Icon
                          component={motion.span}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, transition: { delay: 0.2 } }}
                          className="text-24 md:text-32 mr-12"
                        >
                          call
                        </Icon>
                        <Typography variant="h6" gutterBottom>
                          {userData ? `+${userData.phone}` : ''}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} className="flex">
                        <Icon
                          component={motion.span}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, transition: { delay: 0.2 } }}
                          className="text-24 md:text-32 mr-12"
                        >
                          groups
                        </Icon>
                        <Typography variant="h6" gutterBottom>
                          {userData ? userData.group_name : ''}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} className="flex">
                        <Icon
                          component={motion.span}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, transition: { delay: 0.2 } }}
                          className="text-24 md:text-32 mr-12"
                        >
                          alarm_on
                        </Icon>
                        <Typography variant="h6" gutterBottom>
                          {userData && userData.rate !== undefined
                            ? `${userData.rate} XOF/hour`
                            : null}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} className="flex">
                        <Icon
                          component={motion.span}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, transition: { delay: 0.2 } }}
                          className="text-24 md:text-32 mr-12"
                        >
                          info
                        </Icon>
                        <Typography variant="h6" gutterBottom>
                          {userData ? userData.info : null}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} className="flex">
                        <Icon
                          component={motion.span}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, transition: { delay: 0.2 } }}
                          className="text-24 md:text-32 mr-12"
                        >
                          how_to_reg
                        </Icon>
                        <Typography variant="h6" gutterBottom>
                          {userRole ? userRole.name : null}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} className="flex">
                        <Icon
                          component={motion.span}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, transition: { delay: 0.2 } }}
                          className="text-24 md:text-32 mr-12"
                        >
                          monetization_on
                        </Icon>
                        <Typography variant="h6" gutterBottom>
                          {userRole && userRole.salary !== undefined
                            ? `${userRole.salary} XOF`
                            : null}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                ) : null}
              </motion.div>
            </div>
          </div>
        </>
      }
      content={
        <div className="p-16 sm:p-24">
          {userData && userRole ? (
            <Activity uid={userData.id} rate={userData.rate} salary={userRole.salary} />
          ) : null}
        </div>
      }
    />
  );
}
export default withReducer('Profile', reducer)(ProfilePage);
