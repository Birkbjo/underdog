import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import routes from '../../../constants/routes.json';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
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
import { Search, Refresh } from '@material-ui/icons';
import Header from './Header';
import MyAddonsList from './MyAddonsList';
import { getAddonsUpdateInfo } from '../effects';

export default function NewAddonsView() {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(getAddonsUpdateInfo());
    setRefreshing(false);
  }, [dispatch]);

  return (
    <Toolbar>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleRefresh}
        startIcon={<Refresh />}
        disabled={refreshing}
      >
        Refresh
      </Button>
    </Toolbar>
  );
}
