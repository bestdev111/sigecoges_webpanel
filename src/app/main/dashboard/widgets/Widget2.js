import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { memo, useEffect, useState } from 'react';
import FirebaseService from 'app/services/firebaseService';
import { useSelector } from 'react-redux';

function Widget2(props) {
  const [totalUserNum, setTotalUserNum] = useState(0);
  const user = useSelector(({ auth }) => auth.user);
  useEffect(() => {
    if (user && props.allUser) {
      if (user.role === 'SUPER_ADMIN') {
        setTotalUserNum(props.allUser.length);
      }
      if (user.role === 'ADMIN') {
        FirebaseService.getUserWithEmail(user.email).then((data) => {
          const temp = [];
          props.allUser.forEach((element) => {
            if (element.group_name === data.group_name) {
              temp.push(element);
            }
          });
          setTotalUserNum(temp.length);
        });
      }
    }
  }, [props, user]);
  return (
    <Paper className="w-full rounded-20 shadow flex flex-col justify-between">
      <div className="flex items-center justify-between px-4 pt-8">
        <Typography className="text-16 px-16 font-medium" color="textSecondary">
          Total Users
        </Typography>
      </div>
      <div className="text-center py-12">
        <Typography className="text-72 font-semibold leading-none text-red tracking-tighter">
          {totalUserNum}
        </Typography>
        <Typography className="text-18 font-normal text-red-800">users</Typography>
      </div>
    </Paper>
  );
}

export default memo(Widget2);
