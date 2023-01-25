import { yupResolver } from '@hookform/resolvers/yup';
import formatISO from 'date-fns/formatISO';
import { useForm } from 'react-hook-form';
import FuseUtils from '@fuse/utils/FuseUtils';
import { AppBar, Dialog, DialogContent, Toolbar, Typography } from '@material-ui/core';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import FuseNavBadge from '@fuse/core/FuseNavigation/FuseNavBadge';
import { closeNewEventDialog, closeEditEventDialog } from '../../store/scheduleSlice';

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
  const eventDialog = useSelector(({ Groups }) => Groups.schedule.eventDialog);

  const { reset, formState, watch, control, getValues, handleSubmit } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

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
    // if (eventDialog.type === 'new') {
    //   dispatch(addEvent(data));
    // } else {
    //   dispatch(updateEvent({ ...eventDialog.data, ...data }));
    // }
    closeComposeDialog();
  }

  /**
   * Remove Event
   */
  // function handleRemove() {
  //   dispatch(removeEvent(id));
  //   closeComposeDialog();
  // }
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
            Schedule
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
          <Typography id="start" className="mt-8 mb-16">
            {'Start Time : '}
            {eventDialog && eventDialog.data ? eventDialog.data.extendedProps.sTime.hour : ''}
            {' : '}
            {eventDialog && eventDialog.data ? eventDialog.data.extendedProps.sTime.minute : ''}
          </Typography>
          <Typography id="end" className="mt-8 mb-16">
            {'End Time : '}
            {eventDialog && eventDialog.data ? eventDialog.data.extendedProps.eTime.hour : ''}
            {' : '}
            {eventDialog && eventDialog.data ? eventDialog.data.extendedProps.eTime.minute : ''}
          </Typography>
          <Typography id="type" className="mt-8 mb-16">
            {'Type : '}
            {eventDialog && eventDialog.data ? eventDialog.data.extendedProps.type : ''}
          </Typography>
          <Typography id="isOnDuty" className="mt-8 mb-16">
            {eventDialog && eventDialog.data ? (
              eventDialog.data.extendedProps.isOnDuty ? (
                <FuseNavBadge
                  className="w-fit"
                  badge={{ bg: '#f44336', fg: '#ffffff', title: 'On Duty' }}
                />
              ) : (
                <FuseNavBadge
                  className="w-fit"
                  badge={{ bg: '#f44336', fg: '#ffffff', title: 'Off Duty' }}
                />
              )
            ) : (
              ''
            )}
          </Typography>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default EventDialog;
