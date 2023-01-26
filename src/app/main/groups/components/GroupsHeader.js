import { useDispatch, useSelector } from 'react-redux';
import { Icon, Typography} from '@material-ui/core';
import { motion } from 'framer-motion';

function UsersHeader(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(({ Groups }) => Groups.groups.searchText);

  return (
    <div className="flex flex-1 w-full items-center justify-between">
      <div className="flex items-center">
        <Icon
          component={motion.span}
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { delay: 0.2 } }}
          className="text-24 md:text-32"
        >
          groups
        </Icon>
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
        >
          Groups
        </Typography>
      </div>
    </div>
  );
}

export default UsersHeader;