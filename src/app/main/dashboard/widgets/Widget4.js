import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { memo, useState, useEffect } from 'react';
import FirebaseService from 'app/services/firebaseService';
import { useSelector } from 'react-redux';

function Widget4() {
  const [totalGeofenceNum, setTotalGeofenceNum] = useState(0);
  const user = useSelector(({ auth }) => auth.user);

  useEffect(() => {
    if (user) {
      FirebaseService.getGeofence().then((geofences) => {
        if (geofences) {
          if (user.role === 'SUPER_ADMIN') {
            setTotalGeofenceNum(geofences.length);
          }
          if (user.role === 'ADMIN') {
            FirebaseService.getUserWithEmail(user.email).then((data) => {
              let num = 0;
              geofences.forEach((element) => {
                if (element.group_name === data.group_name) {
                  num++;
                }
              });
              setTotalGeofenceNum(num);
            });
          }
        }
      });
    }
  }, [user]);

  return (
    <Paper className="w-full rounded-20 shadow flex flex-col justify-between">
      <div className="flex items-center justify-between px-4 pt-8">
        <Typography className="text-16 px-16 font-medium" color="textSecondary">
          Total Geofences
        </Typography>
      </div>
      <div className="text-center py-12">
        <Typography className="text-72 font-semibold leading-none text-green tracking-tighter">
          {totalGeofenceNum}
        </Typography>
        <Typography className="text-18 font-normal text-green-800">geofences</Typography>
      </div>
    </Paper>
  );
}

export default memo(Widget4);
