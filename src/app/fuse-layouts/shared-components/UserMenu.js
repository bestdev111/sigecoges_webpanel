import {
  Avatar,
  Button,
  Icon,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from 'app/auth/store/userSlice';
import FirebaseService from 'app/services/firebaseService';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  collapse: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'normal',
    display: 'block',
    maxWidth: '150px',
  },
});
function UserMenu(props) {
  const classes = useStyles();
  const [name, setName] = useState(null);
  const dispatch = useDispatch();
  const [userMenu, setUserMenu] = useState(null);
  const user = useSelector(({ auth }) => auth.user);
  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };
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
    <>
      <Button className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6" onClick={userMenuClick}>
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className={clsx(classes.collapse, 'font-semibold flex')}>
            {name !== null ? name : ''}
          </Typography>
        </div>

        {user && user.photoURL ? (
          <Avatar className="md:mx-4" alt="user photo" src={user.photoURL} />
        ) : (
          <Avatar className="md:mx-4" src="assets/images/avatars/profile.jpg" />
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        <MenuItem
          component={Link}
          to="/myprofile"
          onClick={() => {
            userMenuClose();
          }}
          role="button"
        >
          <ListItemIcon className="min-w-40">
            <Icon>account_circle</Icon>
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(logoutUser());
            userMenuClose();
          }}
        >
          <ListItemIcon className="min-w-40">
            <Icon>exit_to_app</Icon>
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Popover>
    </>
  );
}

export default UserMenu;
