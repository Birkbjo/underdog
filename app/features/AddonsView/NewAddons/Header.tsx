import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Button as MButton,
  Box,
  Paper,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  OutlinedInput,
  InputBase,
  Toolbar,
  AppBar,
} from '@material-ui/core';
import AddonSearch from './AddonSearch';

const useStyles = makeStyles((theme) => ({
  headerbar: {
    marginBottom: '1rem',
    backgroundColor: theme.palette.background.paper,
    padding: '8px',
  },
  searchField: {
    padding: 5,
  },
}));

export default function Header() {
  const classes = useStyles();
  //const addons = useSelector(selectAddons);
  return (
    <Card className={classes.headerbar}>
      <AddonSearch />
    </Card>
  );
}
