/* eslint-disable react/jsx-fragments */
/* eslint-disable prefer-const */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseLoading from '@fuse/core/FuseLoading';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
  Badge,
  Dialog,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  Button,
  TextField,
} from '@material-ui/core';
import _ from '@lodash';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FirebaseService from 'app/services/firebaseService';
import * as yup from 'yup';
import { getUserAllData, selectAllUsers } from '../store/usersSlice';
import UsersTableHead from './UsersTableHead';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const useStyles = makeStyles({
  formControl: {
    minWidth: 120,
    marginBottom: '40px',
  },
  selectEmpty: {
    marginTop: '20px',
  },
});
const schema = yup.object().shape({
  phone: yup.number().required('You must enter valid phone number'),
});
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const StyledBadge0 = withStyles((theme) => ({
  badge: {
    backgroundColor: 'grey',
    color: 'grey',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentColor',
      content: '""',
    },
  },
}))(Badge);
const StyledBadge1 = withStyles((theme) => ({
  badge: {
    backgroundColor: 'green',
    color: 'green',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentColor',
      content: '""',
    },
  },
}))(Badge);
const StyledBadge2 = withStyles((theme) => ({
  badge: {
    backgroundColor: 'orange',
    color: '#F44336',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentColor',
      content: '""',
    },
  },
}))(Badge);
function UsersTable(props) {
  const classes = useStyles(props);
  const [selectType, setSelectType] = useState('');
  const [open, setOpen] = useState();
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const user = useSelector(({ auth }) => auth.user);
  const { control, formState, handleSubmit, reset, setError } = useForm({
    mode: 'onChange',
    defaultValues: { phone: '' },
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const [errorText, setErrorText] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(users);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  useEffect(() => {
    dispatch(getUserAllData()).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    setOpen(props.open);
  }, [props]);

  useEffect(() => {
    if (users && users[0] && users[0].length > 0 && user) {
      if (user.role === 'SUPER_ADMIN') {
        let temp = [];
        users[0].forEach((element) => {
          temp.push(element);
        });
        setData(temp);
      }
      if (user.role === 'ADMIN') {
        FirebaseService.getUserWithEmail(user.email).then((currentUser) => {
          let temp = [];
          users[0].forEach((element) => {
            if (currentUser.group_name === element.group_name) {
              temp.push(element);
            }
          });
          setData(temp);
        });
      }
    }
  }, [users, user]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      id,
    });
  }
  const handleChange = (event) => {
    setSelectType(event.target.value);
  };
  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.forEach((n) => n.uid));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function handleClick(index) {
    props.history.push(`/userprofile/${index}`);
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }
  function onSubmit(model) {
    if (selectType.length === 0) {
      setErrorText(true);
      return;
    }
    model.type = selectType;
    if (model && model.phone) {
      console.log('model===>', model);
      FirebaseService.registerStaff(model).then((result) => {
        if (result) {
          if (!result.success) {
            setError('phone', {
              type: 'manual',
              message: result.message,
            });
            setSelectType('');
            setErrorText(false);
          } else {
            console.log('success made!!!!');
            handleClose();
            reset({ phone: '' });
            setSelectType('');
            setErrorText(false);
          }
        }
      });
    }
  }
  if (loading) {
    return <FuseLoading />;
  }
  if (!data || data.length === 0) {
    return (
      <div className="w-full flex flex-col">
        <FuseScrollbars className="flex-grow overflow-x-auto">
          <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
            <UsersTableHead
              selectedProductIds={selected}
              order={order}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={0}
              onMenuItemClick={handleDeselect}
            />
          </Table>
          <Typography className="mt-5" color="textSecondary" variant="h6" align="center">
            There are no Users!
          </Typography>
        </FuseScrollbars>
      </div>
    );
  }
  const handleClose = () => {
    props.closeDialog(false);
  };
  return (
    <div className="w-full flex flex-col">
      {data && data.length > 0 ? (
        <>
          <FuseScrollbars className="flex-grow overflow-x-auto">
            <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
              <UsersTableHead
                selectedProductIds={selected}
                order={order}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={data.length}
                onMenuItemClick={handleDeselect}
              />

              <TableBody>
                {_.orderBy(
                  data,
                  [
                    (o) => {
                      switch (order.uid) {
                        case 'categories': {
                          return o.categories[0];
                        }
                        default: {
                          return o[order.uid];
                        }
                      }
                    },
                  ],
                  [order.direction]
                )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((n, index) => {
                    const isSelected = selected.indexOf(index) !== -1;
                    return (
                      <TableRow
                        className="h-72 cursor-pointer"
                        hover
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isSelected}
                        onClick={(event) => handleClick(n.id)}
                      >
                        <TableCell
                          align="center"
                          className="p-4 md:p-16"
                          component="th"
                          scope="row"
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          className="w-52 px-4 md:pr-0 md:pl-20"
                          component="th"
                          scope="row"
                          padding="none"
                          align="left"
                        >
                          {n.status === 1 ? (
                            <StyledBadge1
                              overlap="circular"
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                              variant="dot"
                            >
                              <Avatar
                                alt={n.name}
                                src={n.photo ? n.photo : 'assets/images/avatars/profile.jpg'}
                              />
                            </StyledBadge1>
                          ) : n.status === 0 ? (
                            <StyledBadge0
                              overlap="circular"
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                              variant="dot"
                            >
                              <Avatar
                                alt={n.name}
                                src={n.photo ? n.photo : 'assets/images/avatars/profile.jpg'}
                              />
                            </StyledBadge0>
                          ) : (
                            <StyledBadge2
                              overlap="circular"
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                              variant="dot"
                            >
                              <Avatar
                                alt={n.name}
                                src={n.photo ? n.photo : 'assets/images/avatars/profile.jpg'}
                              />
                            </StyledBadge2>
                          )}
                        </TableCell>

                        <TableCell
                          align="center"
                          className="p-4 md:p-16"
                          component="th"
                          scope="row"
                        >
                          {n.name}
                        </TableCell>

                        <TableCell
                          align="center"
                          className="p-4 md:p-16 truncate"
                          component="th"
                          scope="row"
                        >
                          +{n.phone}
                        </TableCell>

                        <TableCell
                          align="center"
                          className="p-4 md:p-16"
                          component="th"
                          scope="row"
                        >
                          {n.info}
                        </TableCell>
                        <TableCell
                          align="center"
                          className="p-4 md:p-16"
                          component="th"
                          scope="row"
                        >
                          {n.rate}
                        </TableCell>
                        <TableCell
                          align="center"
                          className="p-4 md:p-16"
                          component="th"
                          scope="row"
                        >
                          {n.type}
                        </TableCell>
                        <TableCell
                          align="center"
                          className="p-4 md:p-16"
                          component="th"
                          scope="row"
                        >
                          {n.group_name}
                        </TableCell>
                        {/* <TableCell align='center' className="p-4 md:p-16" component="th" scope="row">
                          {n.state ? (
                            <Icon className="text-green text-20">check_circle</Icon>
                          ) : (
                            <Icon className="text-red text-20">remove_circle</Icon>
                          )}
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </FuseScrollbars>

          <TablePagination
            className="flex-shrink-0 border-t-1"
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : null}
      <Dialog
        maxWidth="sm"
        fullWidth
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          User Registration
        </DialogTitle>
        <DialogContent dividers className="flex justify-center">
          <form
            name="registerForm"
            noValidate
            className="flex flex-col justify-center w-192"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl
              name="type"
              variant="outlined"
              className={classes.formControl}
              control={control}
            >
              <InputLabel id="demo-simple-select-outlined-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={selectType}
                onChange={handleChange}
                label="Type"
                type="type"
                error={!!errors.type}
              >
                <MenuItem value="">
                  <em>Please select type</em>
                </MenuItem>
                {user.role === 'ADMIN' ? (
                  <MenuItem value="STAFF">Staff</MenuItem>
                ) : (
                  ['ADMIN', 'STAFF'].map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errorText ? (
                <FormHelperText className="text-red-700">Please select a type</FormHelperText>
              ) : null}
            </FormControl>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-16"
                  label="Phone"
                  autoFocus
                  placeholder="+2251234567890"
                  type="phone"
                  error={!!errors.phone}
                  helperText={errors?.phone?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Button
              variant="contained"
              color="primary"
              className="w-full mx-auto mt-16"
              aria-label="Register"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
            >
              Create an account
            </Button>
          </form>
        </DialogContent>
        {/* <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Save changes
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}

export default withRouter(UsersTable);
