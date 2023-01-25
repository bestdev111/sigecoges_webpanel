import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseNavBadge from '@fuse/core/FuseNavigation/FuseNavBadge';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Avatar } from '@material-ui/core';
import { motion } from 'framer-motion';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import reducer from './store';
import Activity from './tabs/Activity';
import { getUserProfile, selectProfile } from './store/profileSlice';
import { getUserRole, selectRole } from './store/roleSlice';

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
    height: 200,
    minHeight: 150,
    [theme.breakpoints.down('md')]: {
      height: 100,
      minHeight: 150,
    },
  },
  badge: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

function ProfilePage() {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const classes = useStyles();
  // const user = useSelector(({ auth }) => auth.user);
  const selectedUser = useSelector(selectProfile);
  const selectedRole = useSelector(selectRole);
  useEffect(() => {
    const { userId } = routeParams;
    if (userId) {
      dispatch(getUserProfile(userId));
      dispatch(getUserRole(userId));
    }
  }, [routeParams]);
  // function handleTabChange(event, value) {
  //   setSelectedTab(value);
  // }
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
                src={selectedUser[0] ? selectedUser[0].photo : 'assets/images/avatars/profile.jpg'}
              />
            </motion.div>
            <div className="flex flex-col md:flex-row flex-1 items-left justify-between p-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                {selectedUser && selectedRole ? (
                  <>
                    <Grid container className="pb-10">
                      <Grid item>
                        <Typography
                          className="md:px-16 text-24 md:text-32 font-semibold tracking-tight"
                          variant="h4"
                          color="inherit"
                        >
                          {selectedUser[0] ? selectedUser[0].name : 'guest'}
                        </Typography>
                      </Grid>
                      <Grid item className={classes.badge}>
                        {selectedUser[0] ? (
                          <FuseNavBadge
                            className="mx-4"
                            badge={
                              selectedUser[0].type === 'ADMIN'
                                ? {
                                    title: selectedUser[0].type,
                                    bg: '#F44336',
                                    fg: '#FFFFFF',
                                  }
                                : {
                                    title: selectedUser[0].type,
                                    bg: '#ff6f00',
                                    fg: '#FFFFFF',
                                  }
                            }
                          />
                        ) : null}
                      </Grid>
                    </Grid>
                    <Grid container spacing={4}>
                      <Grid item xs={6}>
                        <Typography variant="h6" gutterBottom>
                          {'Phone: '}
                          {selectedUser[0] ? `+${selectedUser[0].phone}` : ''}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6" gutterBottom>
                          {'Group: '}
                          {selectedUser[0] ? selectedUser[0].group_name : ''}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6" gutterBottom>
                          {'Rate: '}
                          {selectedUser[0] && selectedUser[0].rate !== undefined
                            ? `$${selectedUser[0].rate}/hour`
                            : null}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6" gutterBottom>
                          {'Info: '}
                          {selectedUser[0] ? selectedUser[0].info : null}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6" gutterBottom>
                          {'Role: '}
                          {selectedRole[0] ? selectedRole[0].name : null}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6" gutterBottom>
                          {'Salary: '}
                          {selectedRole[0] && selectedRole[0].salary !== undefined
                            ? `$${selectedRole[0].salary}`
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
          {selectedUser[0] && selectedRole[0] ? (
            <Activity
              uid={selectedUser[0].id}
              rate={selectedUser[0].rate}
              salary={selectedRole[0].salary}
            />
          ) : null}
        </div>
      }
    />
  );
}
export default withReducer('Profile', reducer)(ProfilePage);
