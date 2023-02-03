import { Icon, Typography, Button } from '@material-ui/core';
import { motion } from 'framer-motion';

function UsersHeader(props) {
  const handleClickOpen = () => {
    props.openDialog(true);
  };
  return (
    <div className="flex flex-1 w-full items-center justify-between">
      <div className="flex items-center">
        <Icon
          component={motion.span}
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { delay: 0.2 } }}
          className="text-24 md:text-32"
        >
          person
        </Icon>
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
        >
          Users
        </Typography>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
      >
        <Button
          className="whitespace-nowrap"
          variant="contained"
          color="secondary"
          onClick={handleClickOpen}
        >
          <span className="hidden sm:flex">Add New User</span>
          <span className="flex sm:hidden">New User</span>
        </Button>
      </motion.div>
    </div>
  );
}

export default UsersHeader;
