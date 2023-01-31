/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseLoading from '@fuse/core/FuseLoading';
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
  Badge,
} from '@material-ui/core';
import _ from '@lodash';
import { motion } from 'framer-motion';
import { withStyles } from '@material-ui/core/styles';
import FirebaseService from 'app/services/firebaseService';
import { getUserAllData, selectAllUsers } from '../store/usersSlice';
import UsersTableHead from './UsersTableHead';

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
  const subscribe = FirebaseService.subscribe();
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const searchText = '';

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
    if (searchText.length !== 0) {
      setData(
        _.filter(users[0], (item) =>
          item.name.toString().toLowerCase().includes(searchText.toString().toLowerCase())
        )
      );
      setPage(0);
    } else {
      setData(users);
    }
  }, [users, searchText]);

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

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data[0].forEach((n) => n.uid));
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

  if (loading) {
    return <FuseLoading />;
  }

  if (data[0].length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There are no users!
        </Typography>
      </motion.div>
    );
  }
  return (
    <div className="w-full flex flex-col">
      <FuseScrollbars className="flex-grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <UsersTableHead
            selectedProductIds={selected}
            order={order}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data[0].length}
            onMenuItemClick={handleDeselect}
          />

          <TableBody>
            {_.orderBy(
              data[0],
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
                    <TableCell align="center" className="p-4 md:p-16" component="th" scope="row">
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

                    <TableCell align="center" className="p-4 md:p-16" component="th" scope="row">
                      {n.name}
                    </TableCell>

                    <TableCell
                      align="center"
                      className="p-4 md:p-16 truncate"
                      component="th"
                      scope="row"
                    >
                      {n.phone}
                    </TableCell>

                    <TableCell align="center" className="p-4 md:p-16" component="th" scope="row">
                      {n.info}
                    </TableCell>
                    <TableCell align="center" className="p-4 md:p-16" component="th" scope="row">
                      {n.rate}
                    </TableCell>
                    <TableCell align="center" className="p-4 md:p-16" component="th" scope="row">
                      {n.type}
                    </TableCell>
                    <TableCell align="center" className="p-4 md:p-16" component="th" scope="row">
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
        count={data[0].length}
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
    </div>
  );
}

export default withRouter(UsersTable);
