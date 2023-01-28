import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import reducer from '../store';
import RegistrationPageHeader from './RegistrationPageHeader';
import RegistrationPageContent from './RegistrationPageContent';

function RegistrationPage() {
  return (
    <FusePageCarded
      classes={{
        content: 'flex',
        contentCard: 'overflow-hidden',
        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
      }}
      header={<RegistrationPageHeader />}
      content={<RegistrationPageContent />}
      innerScroll
    />
  );
}

export default withReducer('Registration', reducer)(RegistrationPage);
