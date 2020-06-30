import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import routes from '../../../constants/routes.json';

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
} from '@material-ui/core';
import { useAsync } from 'react-async-hook';
import { selectAddons } from './myAddonsSlice';
import SelectWoWDir from '../../config/SelectWowDir';

interface AddonData {
  name: string;
  title: string;
  interface: string;
}

export default function MyAddonsList() {
  const addons = useSelector(selectAddons);
  return (
    <>
      {addons.length < 1 ? (
        <Typography align="center" variant="body1">
          No addons found
        </Typography>
      ) : (
        <AddonsTable addons={addons} />
      )}
    </>
  );
}

type AddonsTableProps = {
  addons: AddonData[];
};

function AddonsTable({ addons }: AddonsTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>AddOn</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Game Version</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {addons.map((addon) => (
            <AddonRow key={addon.title} data={addon} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

type AddonRowProps = {
  data: AddonData;
};

function AddonRow({ data }: AddonRowProps) {
  return (
    <TableRow key={data.name}>
      <TableCell>{data.title}</TableCell>
      <TableCell>N/A</TableCell>
      <TableCell>{data.interface}</TableCell>
    </TableRow>
  );
}
