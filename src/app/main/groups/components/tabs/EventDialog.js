/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-nested-ternary */
import formatISO from 'date-fns/formatISO';
import FuseUtils from '@fuse/utils/FuseUtils';
import { AppBar, Dialog, DialogContent, Toolbar, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import FuseNavBadge from '@fuse/core/FuseNavigation/FuseNavBadge';
import FirebaseService from 'app/services/firebaseService';
import CoreService from 'app/services/coreService';

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
  const [eventDialog, setEventDialog] = useState();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    FirebaseService.getSchedules(props.groupName).then(
      (schedule) => {
        // eslint-disable-next-line prefer-const
        let temp = [];
        if (schedule && schedule[0] !== undefined) {
          schedule.forEach((element, index) => {
            // if (element.type === 'SPECIFIC') {
            // eslint-disable-next-line prefer-const
            let obj = {
              id: index,
              title: element.content,
              start: formatISO(new Date(element.specific_date.time)),
              end: formatISO(new Date(element.specific_date.time)),
              allDay: false,
              d: CoreService.getDateStringFromTimestamp(element.specific_date.time),
              isOnDuty: element.isOnDuty,
              type: element.type,
              sTime: element.start_time,
              eTime: element.end_time,
            };
            temp.push(obj);
            // }
          });
        }
        setEventDialog(temp);
        return temp;
      },
      (error) => {
        return error;
      }
    );
  };

  function handleClose() {
    props.closeFunc(false);
  }
  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="xs" component="form">
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            Schedule
          </Typography>
        </Toolbar>
      </AppBar>

      <div>
        {props.openId ? (
          <DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>
            <Typography id="title" className="mt-8 mb-16">
              {'Title : '}
              {eventDialog ? eventDialog[props.openId].title : ''}
            </Typography>
            <Typography id="Date" className="mt-8 mb-16">
              {'Date : '}
              {eventDialog ? eventDialog[props.openId].d : ''}
            </Typography>
            <Typography id="start" className="mt-8 mb-16">
              {'Start Time : '}
              {eventDialog && eventDialog[props.openId].sTime
                ? eventDialog[props.openId].sTime.hour < 10
                  ? `0${eventDialog[props.openId].sTime.hour}`
                  : eventDialog[props.openId].sTime.hour
                : ''}
              {' : '}
              {eventDialog && eventDialog[props.openId].sTime
                ? eventDialog[props.openId].sTime.minute < 10
                  ? `0${eventDialog[props.openId].sTime.minute}`
                  : eventDialog[props.openId].sTime.minute
                : ''}
            </Typography>
            <Typography id="end" className="mt-8 mb-16">
              {'End Time : '}
              {eventDialog && eventDialog[props.openId].eTime
                ? eventDialog[props.openId].eTime.hour < 10
                  ? `0${eventDialog[props.openId].eTime.hour}`
                  : eventDialog[props.openId].eTime.hour
                : ''}
              {' : '}
              {eventDialog && eventDialog[props.openId].eTime
                ? eventDialog[props.openId].eTime.minute < 10
                  ? `0${eventDialog[props.openId].eTime.minute}`
                  : eventDialog[props.openId].eTime.minute
                : ''}
            </Typography>
            <Typography id="type" className="mt-8 mb-16">
              {'Type : '}
              {eventDialog ? eventDialog[props.openId].type : ''}
            </Typography>
            <div id="isOnDuty" className="mt-8 mb-16">
              {eventDialog ? (
                eventDialog[props.openId].isOnDuty ? (
                  <FuseNavBadge
                    className="w-64"
                    badge={{ bg: '#f44336', fg: '#ffffff', title: 'On Duty' }}
                  />
                ) : (
                  <FuseNavBadge
                    className="w-64"
                    badge={{ bg: '#f44336', fg: '#ffffff', title: 'Off Duty' }}
                  />
                )
              ) : (
                ''
              )}
            </div>
          </DialogContent>
        ) : null}
      </div>
    </Dialog>
  );
}

export default EventDialog;
