import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import FirebaseService from 'app/services/firebaseService';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { selectWidgets } from './store/widgetsSlice';
import Widget2 from './widgets/Widget2';
import Widget3 from './widgets/Widget3';
import Widget4 from './widgets/Widget4';
import Widget5 from './widgets/Widget5';

function DashboardContent() {
  const [allUser, setAllUser] = useState(null);
  const widgets = useSelector(selectWidgets);
  useEffect(() => {
    FirebaseService.getUserAllData().then((result) => {
      if (!_.isEmpty(result)) {
        setAllUser(result);
      }
    });
  }, []);
  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/3 p-12">
        <Widget2 allUser={allUser} />
      </motion.div>
      <motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/3 p-12">
        <Widget3 allUser={allUser} />
      </motion.div>
      <motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/3 p-12">
        <Widget4 />
      </motion.div>
      <motion.div variants={item} className="widget flex w-full p-12">
        <Widget5 widget={widgets.widget5} allUser={allUser} />
      </motion.div>
    </motion.div>
  );
}

export default DashboardContent;
