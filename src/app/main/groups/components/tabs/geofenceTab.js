import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Widget from 'app/fuse-layouts/shared-components/Widget';
import { makeStyles } from '@material-ui/core/styles';
import { selectWidgetsEntities, getWidgets } from '../../store/widgetsSlice';
import { selectGroups, getGroups } from '../../store/groupsSlice';

const useStyles = makeStyles((theme) => ({
  customSize: {
    width: 'calc(60vw)',
    height: 'calc(100vh - 400px)',
  },
}));
const GeofenceTab = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgetsEntities);
  const users = useSelector(selectGroups);

  useEffect(() => {
    dispatch(getWidgets());
    dispatch(getGroups());
  }, []);

  return (
    <motion.div initial="hidden" animate="show">
      {widgets && widgets.length !== 0 && users[0] !== undefined ? (
        <Widget style={classes.customSize} data={widgets} users={users[0]} />
      ) : (
        <>no widget</>
      )}
    </motion.div>
  );
};
export default GeofenceTab;
