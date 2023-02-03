import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import { Icon, Typography } from '@material-ui/core';
import withReducer from 'app/store/withReducer';
import _ from '@lodash';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import DashboardContent from './DashboardContent';
import { getWidgets, selectWidgets } from './store/widgetsSlice';
import reducer from './store';

const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: '10px',
    '& canvas': {
      maxHeight: '100%',
    },
  },
}));

function DashboardPage(props) {
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);

  const classes = useStyles(props);
  const pageLayout = useRef(null);

  useEffect(() => {
    dispatch(getWidgets());
  }, [dispatch]);

  if (_.isEmpty(widgets)) {
    return null;
  }

  return (
    <FusePageSimple
      classes={{
        content: classes.content,
      }}
      header={
        <div className="flex flex-1 w-full items-center justify-between">
          <div className="flex items-center ml-10">
            <Icon
              component={motion.span}
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { delay: 0.2 } }}
              className="text-24 md:text-32"
            >
              dashboard
            </Icon>
            <Typography
              component={motion.span}
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.2 } }}
              delay={300}
              className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
            >
              Dashboard
            </Typography>
          </div>
        </div>
      }
      content={<DashboardContent />}
      ref={pageLayout}
    />
  );
}

export default withReducer('Dashboard', reducer)(DashboardPage);
