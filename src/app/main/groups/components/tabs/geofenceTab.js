/* eslint-disable no-restricted-syntax */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Map from 'app/fuse-layouts/shared-components/Map';
import { makeStyles } from '@material-ui/core/styles';
import FuseLoading from '@fuse/core/FuseLoading';
import FirebaseService from 'app/services/firebaseService';

const useStyles = makeStyles((theme) => ({
  customSize: {
    width: 'calc(60vw)',
    height: 'calc(100vh - 400px)',
  },
}));
const GeofenceTab = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchGetWidgets();
  }, []);

  const fetchGetWidgets = async () => {
    await FirebaseService.getGeofence().then(
      (widget) => {
        const tempWidgets = [];
        if (widget) {
          for (const key in widget) {
            if (Object.hasOwnProperty.call(widget, key)) {
              const element = widget[key];
              if (element.group_name === props.groupName) {
                tempWidgets.push(element);
              }
            }
          }
          setData(tempWidgets);
        }
        return widget;
      },
      (error) => {
        return error;
      }
    );
  };

  return (
    <motion.div initial="hidden" animate="show">
      <div className={classes.customSize}>
        {data && data.length !== 0 ? (
          <Map
            zoom={12}
            markers={data}
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDIrEBxeneMNEsVrdnTRZaadT4bV1JjGdI&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ width: 'calc(60vw)', height: 'calc(100vh - 400px)' }} />}
            containerElement={
              <div style={{ width: 'calc(60vw)', height: 'calc(100vh - 400px)' }} />
            }
            mapElement={<div style={{ width: 'calc(60vw)', height: 'calc(100vh - 400px)' }} />}
          />
        ) : (
          <FuseLoading />
        )}
      </div>
    </motion.div>
  );
};
export default GeofenceTab;
