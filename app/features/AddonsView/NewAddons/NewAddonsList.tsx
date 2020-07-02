import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
} from '@material-ui/core';
import { selectResult } from './newAddonsSlice';
import { installAddon } from '../effects';
import { AddonSearchResult } from '../types';

type AddonsTableProps = {
  addons: AddonSearchResult[];
};

const useStyles = makeStyles({
  tableContainer: {
    height: '100%',
  },
});

export default function NewAddonsList() {
  const searchResult = useSelector(selectResult);
  if (searchResult.length < 1)
    return (
      <Typography align="center" variant="body1">
        Search for new addons
      </Typography>
    );

  return <NewAddonsTable addons={searchResult} />;
}

function NewAddonsTable({ addons }: AddonsTableProps) {
  const classes = useStyles();
  return (
    <TableContainer
      component={Paper}
      classes={{ root: classes.tableContainer }}
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell></TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Game Version</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {addons.map((addon) => (
            <AddonRow key={addon.name} data={addon} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

type AddonRowProps = {
  data: AddonSearchResult;
};

function AddonRow({ data }: AddonRowProps) {
  const { latestFiles } = data;
  const dispatch = useDispatch();
  console.log(latestFiles);
  const thumb = data.attachments[0];

  const handleInstall = async (id) => {
    const installedAddon = await dispatch(installAddon(id));
  };
  //const latestFile = latestFiles.sort((a, b) => b.fileDate - a.fileDate)[0];
  return (
    <TableRow key={data.name}>
      <TableCell>
        {thumb ? (
          <img src={thumb.thumbnailUrl} width={64} alt="addonThumbnail" />
        ) : (
          ''
        )}
      </TableCell>
      <TableCell>{data.name}</TableCell>
      <TableCell>
        <Button onClick={() => handleInstall(data.id)}>Install</Button>
      </TableCell>
      <TableCell>N/A</TableCell>
    </TableRow>
  );
}
