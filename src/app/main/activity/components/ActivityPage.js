import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import reducer from '../store';
import ActivityHeader from './ActivityHeader';
import ActivityTable from './ActivityTable';

function ActivityPage() {
  return (
    <FusePageCarded
      classes={{
        content: 'flex',
        contentCard: 'overflow-hidden',
        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
      }}
      header={<ActivityHeader />}
      content={<ActivityTable />}
      innerScroll
    />
  );
}

export default withReducer('Activity', reducer)(ActivityPage);
