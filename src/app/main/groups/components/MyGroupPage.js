import { useState, useEffect } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Tab, Tabs, Typography } from '@material-ui/core';
import { motion } from 'framer-motion';
import firebaseService from 'app/services/firebaseService';
import { useSelector } from 'react-redux';
import ScheduleTab from './tabs/scheduleTab';
import DocumentTab from './tabs/documentTab';
// import GeofenceTab from './tabs/geofenceTab';
import AboutTab from './tabs/aboutTab';
import PaymentTab from './tabs/paymentTab';

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
}));

function GroupProfilePage() {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const [userData, setUserData] = useState();
  // const userData = useSelector(selectGroups);
  // const [groupList, setGroupList] = useState('');
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const user = useSelector(({ auth }) => auth.user);
  useEffect(() => {
    fetchUserData();
  }, []);
  const fetchUserData = async () => {
    await firebaseService.getUserAllData().then(
      (users) => {
        setUserData(users);
        return users;
      },
      (error) => {
        return error;
      }
    );
  };

  useEffect(() => {
    if (userData && user) {
      firebaseService.getUserWithEmail(user.email).then((result) => {
        if (result) {
          setSelectedGroupName(result.group_name);
        }
      });
    }
  }, [userData, user]);

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }
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
          <div className="w-full px-24 pb-48 flex flex-col md:flex-row flex-1 items-center">
            <div className="flex flex-col md:flex-row flex-1 items-center justify-between p-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                <Typography
                  className="md:px-16 text-24 md:text-32 font-semibold tracking-tight"
                  variant="h4"
                  color="inherit"
                >
                  {selectedGroupName}
                </Typography>
              </motion.div>
            </div>
          </div>
          <Tabs
            value={selectedTab}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="inherit"
            variant="scrollable"
            scrollButtons="off"
            className="w-full px-24 -mx-4 min-h-40"
            classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
            TabIndicatorProps={{
              children: <Divider className="w-full h-full rounded-full opacity-50" />,
            }}
          >
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4"
              disableRipple
              label="Staffs"
            />
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4"
              disableRipple
              label="Schedule"
            />
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4"
              disableRipple
              label="Document"
            />
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4"
              disableRipple
              label="Payment"
            />
          </Tabs>
        </>
      }
      content={
        <div className="p-16 sm:p-24">
          {selectedTab === 0 && (
            <AboutTab groupName={selectedGroupName} userData={userData || ''} />
          )}
          {selectedTab === 1 && <ScheduleTab groupName={selectedGroupName} />}
          {selectedTab === 2 && <DocumentTab userData={userData || ''} />}
          {selectedTab === 3 && (
            <PaymentTab groupName={selectedGroupName} userData={userData || ''} />
          )}
          {/* {selectedTab === 3 && <GeofenceTab groupName={selectedGroupName} />} */}
        </div>
      }
    />
  );
}

export default GroupProfilePage;
