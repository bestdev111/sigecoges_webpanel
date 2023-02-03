/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import withReducer from 'app/store/withReducer';
import { Grid } from '@material-ui/core';
import Map from 'app/fuse-layouts/shared-components/Map';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import FuseLoading from '@fuse/core/FuseLoading';
import FirebaseService from 'app/services/firebaseService';
import _ from '@lodash';
import reducer from '../store';
import { selectWidgetsEntities, getWidgets } from '../store/widgetsSlice';

const useStyles = makeStyles((theme) => ({
  customSize: {
    width: 'calc(100vw - 312px)',
    height: 'calc(100vh - 115px)',
  },
  // customSize2: {
  //   width: 'calc(100vw)',
  //   height: 'calc(100vh - 115px)',
  // },
}));

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const GeofencePage = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgetsEntities);
  const [data, setData] = useState([]);
  const user = useSelector(({ auth }) => auth.user);

  useEffect(() => {
    dispatch(getWidgets());
  }, []);
  useEffect(() => {
    if (widgets && user) {
      let tempWidgets = [];
      if (user.role === 'SUPER_ADMIN') {
        _.values(widgets).forEach((widget) => {
          tempWidgets.push(widget);
        });
        setData(tempWidgets);
      }
      if (user.role === 'ADMIN') {
        FirebaseService.getUserWithEmail(user.email).then((e) => {
          _.values(widgets).forEach((widget) => {
            if (e.group_name === widget.group_name) {
              tempWidgets.push(widget);
            }
          });
          setData(tempWidgets);
        });
      }
    }
  }, [widgets, user]);
  return (
    <Grid container>
      <Grid item className={clsx(classes.customSize)}>
        <motion.div variants={item} className="widget w-full p-16 pb-32">
          {data ? (
            <Map
              zoom={12}
              markers={data}
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDIrEBxeneMNEsVrdnTRZaadT4bV1JjGdI&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={
                <div style={{ width: 'calc(100vw - 312px)', height: 'calc(100vh - 115px)' }} />
              }
              containerElement={
                <div style={{ width: 'calc(100vw - 312px)', height: 'calc(100vh - 115px)' }} />
              }
              mapElement={
                <div style={{ width: 'calc(100vw - 312px)', height: 'calc(100vh - 115px)' }} />
              }
            />
          ) : (
            <FuseLoading />
          )}
        </motion.div>
      </Grid>
    </Grid>
  );
};
export default withReducer('Geofence', reducer)(GeofencePage);
