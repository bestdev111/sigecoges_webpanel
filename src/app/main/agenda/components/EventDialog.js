import { useState, useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import formatISO from 'date-fns/formatISO';
import { useForm } from 'react-hook-form';
import FuseUtils from '@fuse/utils/FuseUtils';
import { AppBar, Avatar, Dialog, DialogContent, Toolbar, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import * as yup from 'yup';
import {
  removeEvent,
  updateEvent,
  addEvent,
  closeNewEventDialog,
  closeEditEventDialog,
} from '../store/agendaSlice';
import { selectUsers, getUsers } from '../store/usersSlice';

const defaultValues = {
  id: FuseUtils.generateGUID(),
  title: '',
  allDay: true,
  start: formatISO(new Date()),
  end: formatISO(new Date()),
  extendedProps: { desc: '' },
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title: yup.string().required('You must enter a title'),
});

function EventDialog(props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const eventDialog = useSelector(({ Agenda }) => Agenda.events.eventDialog);
  const users = useSelector(selectUsers);

  const { reset, formState, watch, control, getValues, handleSubmit } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    dispatch(getUsers()).then(() => setLoading(false));
  }, []);
  const { isValid, dirtyFields, errors } = formState;

  const start = watch('start');
  const end = watch('end');
  const id = watch('id');

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (eventDialog.type === 'edit' && eventDialog.data) {
      reset({ ...eventDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (eventDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...eventDialog.data,
        id: FuseUtils.generateGUID(),
      });
    }
  }, [eventDialog.data, eventDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (eventDialog.props.open) {
      initDialog();
    }
  }, [eventDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return eventDialog.type === 'edit'
      ? dispatch(closeEditEventDialog())
      : dispatch(closeNewEventDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (eventDialog.type === 'new') {
      dispatch(addEvent(data));
    } else {
      dispatch(updateEvent({ ...eventDialog.data, ...data }));
    }
    closeComposeDialog();
  }

  /**
   * Remove Event
   */
  function handleRemove() {
    dispatch(removeEvent(id));
    closeComposeDialog();
  }
  if (loading) {
    return <FuseLoading />;
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
              {eventDialog && eventDialog.data && users && users[0] !== undefined
                ? users[0].map((user, index) => {
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
