import React, {Fragment, useState, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import FlagIcon from '@material-ui/icons/Flag';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CssBaseline from '@material-ui/core/CssBaseline';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Amplify } from 'aws-amplify';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsExports from "../aws-exports";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,

  },
    appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  rightToolbar: {
    marginLeft: 'auto',
    marginRight: 0,
  },
  leftToolbar: {
    marginRight: 'auto',
    marginLeft: 0,
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

Amplify.configure(awsExports);


const Navigation = ({authopen, setAuthopen, authState, setAuthState, user, setUser }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [draweropen, setDrawerOpen] = useState(false);


    const handleClose = () => {

    // setAuthopen(false)
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleAuthNav = () => {
      console.log('authNav: ')
      setAuthopen(true)


  };

 useEffect(() => {

    return onAuthUIStateChange((nextAuthState, authData) => {
            console.log('state:', nextAuthState)
            setAuthState(nextAuthState);
            if (nextAuthState === 'signedin'){
                setUser(authData);
                handleClose()
            }
            if (nextAuthState === 'signedout'){
                setUser(null);
                handleClose()
            }

        });
  });

  return (

    <div className={classes.root}>
      <CssBaseline />

      <AppBar
        color="secondary"
        position="static"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: draweropen,
        })}
      >
        <Toolbar >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={ handleDrawerOpen }
              edge="start"
              className={clsx(classes.menuButton, draweropen && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Example Application
            </Typography>
            <>
            {authState === AuthState.SignedIn && user ? (
                <AmplifySignOut />
                )
           : (
                    <>
                    <IconButton color="primary" onClick={handleAuthNav}><AccountCircle /></IconButton>

                        </>
                )
                }
            </>

        </Toolbar>

      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={draweropen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
            <ListItem
              button
              key="items"
              component={Link} to="/items"
              user={user}
              onClick={handleDrawerClose}
            >
                <ListItemIcon>
                  <FlagIcon />
                </ListItemIcon>
                <ListItemText primary="items" />
            </ListItem>

            <ListItem
              button
              key="home"
              component={Link} to="/"
              onClick={handleDrawerClose}
            >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="home" />
            </ListItem>
        </List>
        <Divider />

      </Drawer>
    </div>
  );
};

export default Navigation;
