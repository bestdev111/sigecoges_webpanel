import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import reducer from '../store';
import NewsHeader from './NewsHeader';
import NewsContent from './NewsContent';

function NewsPage() {
  return (
    <FusePageCarded
      classes={{
        content: 'flex',
        contentCard: 'overflow-hidden',
        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
      }}
      header={<NewsHeader />}
      content={<NewsContent />}
      innerScroll
    />
  );
}

export default withReducer('News', reducer)(NewsPage);
