import FusePageCarded from '@fuse/core/FusePageCarded';
import MyProfilePageHeader from './MyProfilePageHeader';
import MyProfilePageContent from './MyProfilePageContent';

function MyProfilePage() {
  return (
    <FusePageCarded
      classes={{
        content: 'flex justify-center mt-8',
        contentCard: 'overflow-hidden',
        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
      }}
      header={<MyProfilePageHeader />}
      content={<MyProfilePageContent />}
      innerScroll
    />
  );
}

export default MyProfilePage;
