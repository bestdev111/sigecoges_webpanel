import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { useState } from 'react';
import reducer from '../store';
import UsersHeader from './UsersHeader';
import UsersTable from './UsersTable';

function UsersPage() {
  const [openModal, setOpenModal] = useState(false);
  const openModalFunc = (param) => {
    setOpenModal(param);
  };
  const closeModalFunc = (param) => {
    setOpenModal(param);
  };
  return (
    <FusePageCarded
      classes={{
        content: 'flex',
        contentCard: 'overflow-hidden',
        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
      }}
      header={<UsersHeader openDialog={openModalFunc} />}
      content={<UsersTable open={openModal} closeDialog={closeModalFunc} />}
      innerScroll
    />
  );
}

export default withReducer('Users', reducer)(UsersPage);
