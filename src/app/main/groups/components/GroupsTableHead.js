import { TableCell, TableHead, TableRow, TableSortLabel, Tooltip } from '@material-ui/core';

const rows = [
  {
    id: 'id',
    align: 'center',
    disablePadding: true,
    label: 'No',
    sort: true,
  },
  {
    id: 'group_admin',
    align: 'center',
    disablePadding: true,
    label: 'Group Admin',
    sort: true,
  },
  {
    id: 'group_name',
    align: 'center',
    disablePadding: false,
    label: 'Group Name',
    sort: true,
  },
  {
    id: 'group_staff',
    align: 'center',
    disablePadding: false,
    label: 'Group Staffs',
    sort: true,
  },
];

function GroupsTableHead(props) {
  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className="h-48 sm:h-64">
        {rows.map((row, i) => {
          return (
            <TableCell
              className="p-4 md:p-16"
              key={i}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'normal'}
              sortDirection={props.order.id === i ? props.order.direction : false}
            >
              {row.sort && (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={props.order.id === i}
                    direction={props.order.direction}
                    // onClick={createSortHandler(i)}
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

export default GroupsTableHead;
