import { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import FirebaseService from 'app/services/firebaseService';

const useStyles = makeStyles((theme) => ({
  root: {
    '&.user': {
      '& .username, & .email': {
        transition: theme.transitions.create('opacity', {
          duration: theme.transitions.duration.shortest,
          easing: theme.transitions.easing.easeInOut,
        }),
      },
    },
  },
  avatar: {
    background: theme.palette.background.default,
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
    bottom: 0,
    '& > img': {
      borderRadius: '50%',
    },
  },
  collapse: {
    textAlign: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'normal',
    display: 'block',
    width: '150px',
  },
}));

function UserNavbarHeader(props) {
  const user = useSelector(({ auth }) => auth.user);
  const [name, setName] = useState(null);
  const classes = useStyles();
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        FirebaseService.getUserWithEmail(user.email).then((data) => {
          setName(data.name);
        });
      }
      if (user.role === 'SUPER_ADMIN') {
        FirebaseService.db.ref('tbl_admin').on('value', async (snapshot) => {
          if (snapshot) setName('Admin');
        });
      }
    }
  }, [user]);
  return (
    <AppBar
      position="static"
      color="primary"
      classes={{ root: classes.root }}
      className="user relative flex flex-col items-center justify-center pt-24 pb-64 mb-32 z-0 shadow-0"
    >
      <Typography
        className={clsx(classes.collapse, 'username text-18 whitespace-nowrap font-semibold mb-4')}
        color="inherit"
      >
        {name !== null ? name : ''}
      </Typography>
      {/* <Typography
        className="email text-13 opacity-50 whitespace-nowrap font-medium"
        color="inherit"
      >
        {user.email}
      </Typography> */}
      <div className="flex items-center justify-center absolute bottom-0 -mb-44">
        <Avatar
          className={clsx(classes.avatar, 'avatar w-72 h-72 p-8 box-content')}
          alt="user photo"
          src={user && user.photoURL ? user.photoURL : 'assets/images/avatars/profile.jpg'}
        />
      </div>
    </AppBar>
  );
}

export default UserNavbarHeader;
