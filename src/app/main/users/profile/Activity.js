import { useEffect, useState } from 'react';
import {
  AppBar,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Card,
  Grid,
  CardContent,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { motion } from 'framer-motion';
import { DatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getUserActivity, selectActivity } from '../store/activitySlice';
import { getUserGeofence, selectGeofence } from '../store/geofenceSlice';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'XOF',
  minimumFractionDigits: 2,
});
const columns = [
  { id: 'date', label: 'Date', minWidth: 20, align: 'center' },
  { id: 'geofence', label: 'Geofence', minWidth: 170, align: 'center' },
  {
    id: 'start_time',
    label: 'Enter Time',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'end_time',
    label: 'Leave Time',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'hours',
    label: 'Time(hour)',
    minWidth: 30,
    align: 'center',
  },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});
// eslint-disable-next-line consistent-return
const activityFunc = (param1, param2) => {
  if (param1 && param2) {
    const tempGeofenceX = [];
    param1.forEach((element) => {
      let tempGeofence = {};
      tempGeofence = param2[element.geofence_id];
      const obj = {
        _id: element._id,
        start_time: element.start_time,
        end_time: element.end_time,
        hours: element.hours,
        date: element.date,
        geofence: tempGeofence.address,
      };
      tempGeofenceX.push(obj);
    });
    return tempGeofenceX;
  }
};
function Activity(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedDate, handleDateChange] = useState(new Date());
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const activityData = useSelector(selectActivity);
  const geofenceData = useSelector(selectGeofence);

  useEffect(() => {
    if (props.uid) {
      const data = {
        uid: props.uid,
        date: selectedDate,
      };
      dispatch(getUserActivity(data));
      dispatch(getUserGeofence());
    }
  }, [selectedDate, props.uid]);
  useEffect(() => {
    if (
      activityData !== [] &&
      activityData[0] !== undefined &&
      geofenceData &&
      geofenceData !== undefined
    ) {
      let tempHours = 0;
      activityData[0].forEach((element) => {
        tempHours += element.hours;
      });
      const rate = props.rate === undefined || props.rate === null ? 0 : props.rate;
      const salary = props.salary === undefined || props.salary === null ? 0 : props.salary;
      setTotalSalary(Number(tempHours) * Number(rate) + Number(salary));
      setTotalHours(tempHours);
      const activities = activityFunc(activityData[0], geofenceData[0]);
      setRows(activities);
    }
  }, [activityData, geofenceData]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
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
      <div className="md:flex max-w-2xl">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
          <Card component={motion.div} variants={item} className="w-full rounded-16 shadow">
            <AppBar position="static" elevation={0}>
              <Toolbar className="px-8 flex flex-row">
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  className="basis-3/4 px-12 font-medium"
                >
                  Activity
                </Typography>
              </Toolbar>
            </AppBar>

            <CardContent>
              <Grid container className="mb-24 basis-1/4 justify-between rounded-t-lg bg-white">
                <Grid item className="flex">
                  <Typography variant="h6" color="inherit" className="basis-3/4 px-6 font-small">
                    {'You have worked total '}
                    {totalHours}
                    {' hours '}
                    {'this month'}
                  </Typography>
                </Grid>
                <Grid item>
                  <DatePicker
                    className="font-bold"
                    views={['year', 'month']}
                    maxDate={new Date()}
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </Grid>
              </Grid>
              {/* table */}
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column, i) => (
                        <TableCell
                          key={i}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      ? rows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => {
                            return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                {columns.map((column, i) => {
                                  const value = row[column.id];
                                  return (
                                    <TableCell key={i} align={column.align}>
                                      {column.format && typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })
                      : null}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows ? rows.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default Activity;
