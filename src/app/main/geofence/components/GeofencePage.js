import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import withReducer from 'app/store/withReducer';
import { Grid } from '@material-ui/core';
import Widget from 'app/fuse-layouts/shared-components/Widget';
import { makeStyles } from '@material-ui/core/styles';
import reducer from '../store';
import { selectWidgetsEntities, getWidgets } from '../store/widgetsSlice';
import { selectUsers, getUsers } from '../store/usersSlice';

const useStyles = makeStyles((theme) => ({
  customSize1: {
    width: 'calc(100vw - 312px)',
    height: 'calc(100vh - 115px)',
  },
  customSize2: {
    width: 'calc(100vw)',
    height: 'calc(100vh - 115px)',
  },
}));

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
const GeofencePage = (props) => {
  const classes = useStyles(props);

  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgetsEntities);
  const users = useSelector(selectUsers);
  const navbarToggle = useSelector(({ fuse }) => fuse.navbar.navbarToggle);
  const navbarToggleFolded = useSelector(({ fuse }) => fuse.navbar.navbarToggleFolded);

  useEffect(() => {
    dispatch(getWidgets());
    dispatch(getUsers());
  }, []);
  useEffect(() => {
    console.log(navbarToggleFolded);
  }, [navbarToggleFolded]);
  console.log('navbarToggleFolded', navbarToggleFolded);
  return (
    <Grid container>
      <Grid item>
        <motion.div variants={item} className="widget w-full p-16 pb-32">
          {widgets && widgets.length !== 0 && users[0] !== undefined ? (
            <Widget
              style={!navbarToggle ? classes.customSize1 : classes.customSize2}
              data={widgets}
              users={users[0]}
            />
          ) : (
            <>no widget</>
          )}
        </motion.div>
      </Grid>
    </Grid>
  );
};
export default withReducer('Geofence', reducer)(GeofencePage);
