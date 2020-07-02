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
import { selectAddons as selectMyAddons } from './myAddonsSlice';
import { selectAddons } from '../addonsSlice';
import SelectWoWDir from '../../config/SelectWowDir';
import { InstalledAddon } from '../types';

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
  addons: InstalledAddon[];
};

function AddonsTable({ addons }: AddonsTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>AddOn</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Addon Version</TableCell>
            <TableCell>Game Version</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {addons.map((addon) => (
            <AddonRow key={addon.addonInfo?.name} data={addon} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

type AddonRowProps = {
  data: InstalledAddon;
};

function AddonRow({ data }: AddonRowProps) {
  console.log(data);
  return (
    <TableRow key={data.name}>
      <TableCell>{data.addonInfo?.name}</TableCell>
      <TableCell>N/A</TableCell>
      <TableCell>{data.version}</TableCell>
      <TableCell>{data.installedFile?.gameVersion}</TableCell>
    </TableRow>
  );
}
