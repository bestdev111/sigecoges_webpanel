import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import reducer from '../store';
import GroupsHeader from './GroupsHeader';
import GroupsTable from './GroupsTable';

function GroupsPage() {
  return (
    <FusePageCarded
      classes={{
        content: 'flex',
        contentCard: 'overflow-hidden',
        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
      }}
      header={<GroupsHeader />}
      content={<GroupsTable />}
      innerScroll
    />
  );
}

export default withReducer('Groups', reducer)(GroupsPage);
