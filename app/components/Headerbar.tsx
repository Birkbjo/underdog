import React, { ReactNode } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import removeCurseSrc from '../assets/removecurse.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    height: 42,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Headerbar() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <img
          className={classes.menuButton}
          src={removeCurseSrc}
          alt="removecurse"
        />
        <Typography variant="h6" className={classes.title}>
          RemoveCurse
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
}
