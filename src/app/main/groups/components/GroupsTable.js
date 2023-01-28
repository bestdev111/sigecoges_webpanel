/* eslint-disable no-return-assign */
/* eslint-disable no-lone-blocks */
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
  Grid,
} from '@material-ui/core';
import _ from '@lodash';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { makeStyles } from '@material-ui/core/styles';
import CoreService from 'app/services/coreService';
import { getGroups, selectGroups } from '../store/groupsSlice';
import UsersTableHead from './GroupsTableHead';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
  },
  ellipsis: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    display: 'block',
    width: '100px',
  },
});
function GroupsTable(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userData = useSelector(selectGroups);
  const searchText = useSelector(({ Groups }) => Groups.groups.searchText);

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(userData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [groupsList, setGroupsList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState();
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  useEffect(() => {
    dispatch(getGroups()).then(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(userData, (item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
      );
      setPage(0);
    } else {
      setData(userData);
    }
  }, [userData, searchText]);

  useEffect(() => {
    const tempGroups = [];
    if (data[0] !== undefined) {
      const groupList = CoreService.getGroupList(data[0]);
      setGroupsList(groupList);
    }
  }, [data]);
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
  const handleClick = (index) => {
    props.history.push(`/groupprofile/${index}`);
  };
  const handleClick1 = (e, n) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedGroup(n);
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setAnchorEl(null);
  };
  function handleSelectAllClick(e) {
    if (e.target.checked) {
      setSelected(data[0].forEach((n) => n.id));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function handleChangePage(e, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(e) {
    setRowsPerPage(e.target.value);
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
          There are no products!
        </Typography>
      </motion.div>
    );
  }
  const filterFunc = (n) => {
    let bool = 0;
    {
      userData[0].forEach((item) => {
        if (item.group_name === n && item.type === 'STAFF') {
          bool++;
        }
      });
    }
    return bool;
  };
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
              groupsList,
              [
                (o) => {
                  switch (order.id) {
                    case 'categories': {
                      return o.categories[0];
                    }
                    default: {
                      return o[order.id];
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
                    onClick={() => handleClick(index)}
                  >
                    <TableCell className="p-4 md:p-16" component="td" scope="row" align="center">
                      {index + 1}
                    </TableCell>
                    <TableCell className={clsx('p-4 md:p-16')} component="td" scope="row">
                      <Grid container justifyContent="space-around">
                        {userData
                          ? userData[0].map((item, i) => {
                              if (item.group_name === n && item.type === 'ADMIN') {
                                return (
                                  <Grid key={i} item className="w-70">
                                    <Grid align="center">
                                      <Avatar alt="" src={item.photo} />
                                    </Grid>
                                    <Typography
                                      variant="button"
                                      display="block"
                                      gutterBottom
                                      align="center"
                                    >
                                      <span className={classes.ellipsis}>{item.name}</span>
                                    </Typography>
                                    <Typography
                                      variant="button"
                                      display="block"
                                      gutterBottom
                                      align="center"
                                    >
                                      +{item.phone}
                                    </Typography>
                                  </Grid>
                                );
                              }
                            })
                          : null}
                      </Grid>
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="td" scope="row" align="center">
                      {n}
                    </TableCell>
                    <TableCell
                      className={clsx('p-4 md:p-16 truncate')}
                      component="td"
                      scope="row"
                      align="center"
                    >
                      {filterFunc(n) > 0 ? `${filterFunc(n)} Staffs` : 'No staffs'}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        className="flex-shrink-0 border-t-1"
        component="div"
        count={groupsList.length}
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

export default withRouter(GroupsTable);
