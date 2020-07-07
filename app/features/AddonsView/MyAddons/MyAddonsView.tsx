import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import routes from '../../../constants/routes.json';
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
import { Search } from '@material-ui/icons';
import Header from './Header';
import MyAddonsList from './MyAddonsList';
import ErrorBoundary from '../../../components/ErrorBoundary';
export default function NewAddonsView() {
  return (
    <ErrorBoundary>
      <Header />
      <MyAddonsList />
    </ErrorBoundary>
  );
}
