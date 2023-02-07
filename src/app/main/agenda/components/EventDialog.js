import { useState, useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import formatISO from 'date-fns/formatISO';
import { useForm } from 'react-hook-form';
import FuseUtils from '@fuse/utils/FuseUtils';
import { AppBar, Avatar, Dialog, DialogContent, Toolbar, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import FirebaseService from 'app/services/firebaseService';
import {
  updateEvent,
  addEvent,
  closeNewEventDialog,
  closeEditEventDialog,
} from '../store/agendaSlice';

const defaultValues = {
  id: FuseUtils.generateGUID(),
  title: '',
  allDay: true,
  start: formatISO(new Date()),
  end: formatISO(new Date()),
  extendedProps: { desc: '' },
};

const schema = yup.object().shape({
  title: yup.string().required('You must enter a title'),
});

function EventDialog(props) {
  const dispatch = useDispatch();
  const [allUsers, setAllUsers] = useState([]);
  const eventDialog = useSelector(({ Agenda }) => Agenda.events.eventDialog);

  const { reset, formState, watch, control, getValues, handleSubmit } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    FirebaseService.getUserAllData().then((result) => {
      if (result) {
        setAllUsers(result);
      }
    });
  }, []);

  const initDialog = useCallback(() => {
    if (eventDialog.type === 'edit' && eventDialog.data) {
      reset({ ...eventDialog.data });
    }
  }, [eventDialog.data, eventDialog.type, reset]);

  useEffect(() => {
    if (eventDialog.props.open) {
      initDialog();
    }
  }, [eventDialog.props.open, initDialog]);

  function closeComposeDialog() {
    return eventDialog.type === 'edit'
      ? dispatch(closeEditEventDialog())
      : dispatch(closeNewEventDialog());
  }

  function onSubmit(data) {
    if (eventDialog.type === 'new') {
      dispatch(addEvent(data));
    } else {
      dispatch(updateEvent({ ...eventDialog.data, ...data }));
    }
    closeComposeDialog();
  }
  return (
    <Dialog
      {...eventDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
      component="form"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            Agenda
            {/* {eventDialog.type === 'new' ? 'New Event' : 'Edit Event'} */}
          </Typography>
        </Toolbar>
      </AppBar>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>
          <Typography id="title" className="mt-8 mb-16">
            {'Title : '}
            {eventDialog && eventDialog.data ? eventDialog.data.title : ''}
          </Typography>
          <Typography id="Date" className="mt-8 mb-16">
            {'Date : '}
            {eventDialog && eventDialog.data ? eventDialog.data.extendedProps.d : ''}
          </Typography>
          <div className="flex">
            <Typography id="Users" className="flex items-center mt-8 mb-16">
              {'Who : '}
            </Typography>
            <div id="Users" className="mt-8 mb-16">
              {eventDialog && eventDialog.data && allUsers && allUsers.length > 0
                ? allUsers.map((user, index) => {
                    if (eventDialog.data.extendedProps.uid === user.id) {
                      return (
                        <div key={index} className="flex">
                          <Avatar className="ml-5" src={user.photo} />
                          <p className="flex items-center ml-5">{user.name}</p>
                        </div>
                      );
                    }
                  })
                : ''}
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default EventDialog;
