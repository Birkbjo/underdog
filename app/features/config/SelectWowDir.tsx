import React, { useCallback, useState, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { remote } from 'electron';
import { setPath, selectPath } from './configSlice';

function getDefaultPath() {
  const os = process.platform;
  if (os === 'darwin') {
    return '/Applications/World of Warcraft/_retail_';
  }
  if (os === 'win32') {
    return 'C:/';
  }
  return '';
}

export default function SelectWoWDir() {
  const dispatch = useDispatch();
  const path = useSelector(selectPath);
  const [open, setOpen] = useState(!path);

  const handleSetPath = useCallback(() => {
    const promise = remote.dialog
      .showOpenDialog({
        title: 'Select WoW installation path',
        defaultPath: getDefaultPath(),
        properties: ['openDirectory'],
      })
      .then((res) => {
        if (!res.canceled && res.filePaths) {
          console.log(res.filePaths);
          dispatch(setPath({ path: res.filePaths[0] }));
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
