import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TableCell, TableHead, TableRow, TableSortLabel, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const rows = [
  {
    id: 'id',
    align: 'center',
    disablePadding: false,
    label: 'No',
    sort: true,
  },
  {
    id: 'date',
    align: 'center',
    disablePadding: false,
    label: 'Date',
    sort: true,
  },
  {
    id: 'name',
    align: 'center',
    disablePadding: false,
    label: 'Name',
    sort: true,
  },
  {
    id: 'geofence',
    align: 'center',
    disablePadding: false,
    label: 'Geofence',
    sort: true,
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },
];

const useStyles = makeStyles((theme) => ({
  actionsButtonWrapper: {
    background: theme.palette.background.paper,
  },
}));

function ActivityTableHead(props) {
  const classes = useStyles(props);

  const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);

  const dispatch = useDispatch();

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  function openSelectedProductsMenu(event) {
    setSelectedProductsMenu(event.currentTarget);
  }

  function closeSelectedProductsMenu() {
    setSelectedProductsMenu(null);
  }

  return (
    <TableHead>
      <TableRow className="h-48 sm:h-64">
        {rows.map((row, index) => {
          return (
            <TableCell
              className="p-4 md:p-16"
              key={index}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'normal'}
              sortDirection={props.order.id === row.id ? props.order.direction : false}
            >
              {row.sort && (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={props.order.id === row.id}
                    direction={props.order.direction}
                    onClick={createSortHandler(row.id)}
                    className="font-semibold"
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              )}
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
}

export default ActivityTableHead;
