import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { motion } from 'framer-motion';
import { DatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
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
  Avatar,
} from '@material-ui/core';
import CoreService from 'app/services/coreService';
import { selectPayments, getPayments } from '../../store/salarySlice';
import { selectGroups, getGroups } from '../../store/groupsSlice';

const columns = [
  { id: 'id', label: 'ID', minWidth: 20, align: 'center' },
  { id: 'date', label: 'Date', minWidth: 20, align: 'center' },
  { id: 'uid', label: 'Staff', minWidth: 170, align: 'center' },
  {
    id: 'salary',
    label: 'Total Salary',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'role',
    label: 'Role',
    minWidth: 170,
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
const PaymentTab = (props) => {
  const dispatch = useDispatch();
  const [selectedDate, handleDateChange] = useState(new Date());
  const payments = useSelector(selectPayments);
  const users = useSelector(selectGroups);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getPayments());
    dispatch(getGroups());
  }, []);
  useEffect(() => {
    if (payments && payments[0] !== undefined) {
      const selectedYear = new Date(selectedDate).getFullYear();
      const selectedMonth = new Date(selectedDate).getMonth();
      const temp = [];
      payments[0].forEach((element) => {
        if (
          element.group_name === props.groupName &&
          element.year === selectedYear &&
          element.created.month === selectedMonth
        ) {
          temp.push(element);
        }
      });
      setRows(temp);
    }
  }, [payments, props.groupName, selectedDate]);

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
                  Salary
                </Typography>
              </Toolbar>
            </AppBar>

            <CardContent>
              <Grid container className="mb-24 basis-1/4 justify-between rounded-t-lg bg-white">
                <Grid item className="flex">
                  <Typography variant="h6" color="inherit" className="basis-3/4 px-6 font-small">
                    {/* {totalHours} */}
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
                                <TableCell
                                  align="center"
                                  className="p-4 md:p-16"
                                  component="th"
                                  scope="row"
                                >
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className="p-4 md:p-16"
                                  component="th"
                                  scope="row"
                                >
                                  {CoreService.getDateStringFromTimestamp(row.created.time)}{' '}
                                  {CoreService.getTimeStringFromTimestamp(row.created.time)}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className="p-4 md:p-16"
                                  component="th"
                                  scope="row"
                                >
                                  <Grid className="flex justify-center">
                                    {users && users[0] !== undefined
                                      ? users[0].map((user, key) => {
                                          if (
                                            user.id === row.uid &&
                                            user.group_name === props.groupName
                                          ) {
                                            return <Avatar key={key} src={user.photo} />;
                                          }
                                        })
                                      : ''}
                                  </Grid>
                                  {users && users[0] !== undefined
                                    ? users[0].map((user, key) => {
                                        if (
                                          user.id === row.uid &&
                                          user.group_name === props.groupName
                                        ) {
                                          return <Typography key={key}>{user.name}</Typography>;
                                        }
                                      })
                                    : ''}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className="p-4 md:p-16"
                                  component="th"
                                  scope="row"
                                >
                                  {Number(row.fixed)}
                                  {' XOF + '}
                                  {Number(row.hourly)}
                                  {' XOF = '}
                                  {Number(row.fixed) + Number(row.hourly)}
                                  {' XOF'}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className="p-4 md:p-16"
                                  component="th"
                                  scope="row"
                                >
                                  {row.roles && row.roles.length > 0
                                    ? row.roles.map((item, index) => {
                                        return <div key={index}>{item.name}</div>;
                                      })
                                    : null}
                                </TableCell>
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
};
export default PaymentTab;
