/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
import { motion } from 'framer-motion';
import { makeStyles } from '@material-ui/core/styles';
// import { getAllNews, selectAllNews } from '../store/newsSlice';
// import { allUsers, selectAllUser } from '../store/allUserSlice';
import 'react-single-image-viewer/dist/index.css'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  description: {
    width: '500px'
  },
  media: {
    width : '100px',
    height : '100px',
  }
}));

function RegistrationPageContent() {
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
      <div className="md:flex">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32 p-32" />
      </div>
    </motion.div>
  );
}
export default RegistrationPageContent;
