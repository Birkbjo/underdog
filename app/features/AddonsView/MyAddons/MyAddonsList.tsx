import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import routes from '../../../constants/routes.json';

import {
  Avatar,
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
  makeStyles,
} from '@material-ui/core';
import { useAsync } from 'react-async-hook';
import { selectAddons as selectMyAddons } from './myAddonsSlice';
import { selectAddons } from '../addonsSlice';
import SelectWoWDir from '../../config/SelectWowDir';
import { InstalledAddon } from '../types';

const useStyles = makeStyles({
  imageCell: {
    paddingRight: 0,
    width: 48,
    height: 48,
    //  backgroundPosition: 'center',
    //backgroundSize: 'cover',
  },
});
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
            <TableCell width="1px" />
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
  const classes = useStyles(data);
  const logoUrl = data.addonInfo?.attachments[0]?.thumbnailUrl;
  return (
    <TableRow key={data.name}>
      <TableCell className={classes.imageCell} size="medium">
        <Avatar
          alt="addon-logo"
          className={classes.imageCell}
          src={logoUrl}
          variant="rounded"
        />
        {
          //logoUrl && <img src={logoUrl} alt="addon logo" height="36px" />}
        }
      </TableCell>
      <TableCell>{data.addonInfo?.name}</TableCell>
      <TableCell>N/A</TableCell>
      <TableCell>{data.version || data.installedFile?.fileName}</TableCell>
      <TableCell>{data.installedFile?.gameVersion}</TableCell>
    </TableRow>
  );
}
