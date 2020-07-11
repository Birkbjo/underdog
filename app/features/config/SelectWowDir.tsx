import React, { useCallback, useState, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Snackbar, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import { setPath, selectPath } from './configSlice';

function getDefaultPath() {
  const os = process.platform;
  if (os === 'darwin') {
    return '/Applications/World of Warcraft/_retail_';
  }
  if (os === 'win32') {
    return 'C:\\Program Files (x86)\\World of Warcraft\\_retail_';
  }
  return '';
}

function validateSelectedPath(wowDir: string) {
  const addonFolder = path.join(wowDir, 'Interface', 'Addons');

  console.log('Checking filepath: ' + addonFolder);

  if (fs.existsSync(addonFolder)) {
    console.log('Path is valid: ' + addonFolder);
    return true;
  } else {
    console.log('Invalid path selected: ' + addonFolder);
    return false;
  }
}

export default function SelectWoWDir() {
  const dispatch = useDispatch();
  const path = useSelector(selectPath);
  const [open, setOpen] = useState(!path);
  const [scanning, setScanning] = useState(false);

  const handleSetPath = useCallback(() => {
    const promise = remote.dialog
      .showOpenDialog({
        title: 'Select WoW installation path',
        defaultPath: getDefaultPath(),
        properties: ['openDirectory'],
      })
      .then((res) => {
        if (
          !res.canceled &&
          res.filePaths &&
          validateSelectedPath(res.filePaths[0])
        ) {
          const filePath = res.filePaths[0];
          dispatch(setPath({ path: filePath }));
          setOpen(false);
          setScanning(true);
        }
        return res;
      })
      .catch((e) => {
        console.log(e);
      });
  }, [dispatch]);

  const handleClose = (e: SyntheticEvent, reason: string): void => {
    if (reason !== 'clickaway') {
      setOpen(false);
    }
  };

  return (
    <Snackbar open={open} onClose={handleClose}>
      <Alert severity="warning">
        Addon directory not set. Please find your World of Warcraft directory.
        <Button onClick={handleSetPath}>Select WoW Path</Button>
      </Alert>
    </Snackbar>
  );
}
