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
import AddonManager from '../AddonManager/AddonManager';

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
            <TableCell>Addon Version</TableCell>
            <TableCell>Game Version</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {addons.map((addon) => (
            <AddonRow key={addon.name} addonInfo={addon} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

type AddonRowProps = {
  data: AddonSearchResult;
};

function AddonRow({ addonInfo }: AddonRowProps) {
  const { latestFiles } = addonInfo;
  const dispatch = useDispatch();
  const latestFile = AddonManager.getLatestFile(addonInfo);
  const thumb = addonInfo.attachments[0];

  if (!latestFile) {
    return null;
  }

  const handleInstall = async (id) => {
    const installedAddon = await dispatch(installAddon(id));
  };
  //const latestFile = latestFiles.sort((a, b) => b.fileDate - a.fileDate)[0];
  return (
    <TableRow key={addonInfo.name}>
      <TableCell>
        {thumb ? (
          <img src={thumb.thumbnailUrl} width={64} alt="addonThumbnail" />
        ) : (
          ''
        )}
      </TableCell>
      <TableCell>{addonInfo.name}</TableCell>
      <TableCell>
        <Button onClick={() => handleInstall(addonInfo.id)}>Install</Button>
      </TableCell>
      <TableCell>N/A</TableCell>
      <TableCell>{latestFile?.displayName || 'No version found'}</TableCell>
      <TableCell>N/A</TableCell>
    </TableRow>
  );
}
