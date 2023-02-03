import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { memo, useState, useEffect } from 'react';
import CoreService from 'app/services/coreService';

function Widget3(props) {
  const [totalGroupNum, setTotalGroupNum] = useState(0);
  useEffect(() => {
    if (props && props.allUser) {
      const groupList = CoreService.getGroupList(props.allUser);
      setTotalGroupNum(groupList.length);
    }
  }, [props]);
  return (
    <Paper className="w-full rounded-20 shadow flex flex-col justify-between">
      <div className="flex items-center justify-between px-4 pt-8">
        <Typography className="text-16 px-16 font-medium" color="textSecondary">
          Total Groups
        </Typography>
      </div>
      <div className="text-center py-12">
        <Typography className="text-72 font-semibold leading-none text-orange tracking-tighter">
          {totalGroupNum}
        </Typography>
        <Typography className="text-18 font-normal text-orange-800">groups</Typography>
      </div>
    </Paper>
  );
}

export default memo(Widget3);
