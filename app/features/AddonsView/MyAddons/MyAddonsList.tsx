import React, {
  useState,
  useCallback,
  SyntheticEvent,
  MouseEvent,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Avatar,
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
  makeStyles,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  MenuProps,
  TableCellProps,
} from '@material-ui/core';
import {
  FolderOpen,
  ArrowRight,
  ExpandMore,
  ExpandLess,
  Launch,
} from '@material-ui/icons';
import { shell } from 'electron';
import { useAsync } from 'react-async-hook';
import { selectAddons as selectMyAddons } from './myAddonsSlice';
import { selectAddons } from '../addonsSlice';
import { selectAddonPath, selectAddonRootPath } from '../../config/configSlice';
import { InstalledAddon, AddonDirectory, AddonSearchResult } from '../types';
import { uninstallAddon, installAddon } from '../effects';
import { selectById } from '../updateAddonsSlice';
import { RootState } from '../../../store';
import AddonManager from '../AddonManager/AddonManager';

const useStyles = makeStyles({
  imageCell: {
    paddingRight: 0,
    width: 48,
    height: 48,
  },
  menuOpenExternalIcon: {
    justifyContent: 'flex-end',
    fontSize: '18px',
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
interface AnchorPosition {
  left: number;
  top: number;
}

function AddonsTable({ addons }: AddonsTableProps) {
  const [anchorPos, setAnchorPos] = useState<AnchorPosition | undefined>(
    undefined
  );
  const [contextMenuAddon, setContextMenuAddon] = useState<
    InstalledAddon | undefined
  >(undefined);

  const handleContextMenu = useCallback(
    (event: MouseEvent, addon) => {
      event.preventDefault();

      setAnchorPos({ left: event.clientX, top: event.clientY });
      setContextMenuAddon(addon);
    },
    [setContextMenuAddon]
  );

  const handleCloseContextMenu = () => setAnchorPos(undefined);
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
            <AddonRow
              key={addon.addonInfo?.name}
              data={addon}
              onContextMenu={handleContextMenu}
            />
          ))}
        </TableBody>
      </Table>
      {contextMenuAddon && (
        <AddonRowContextMenu
          onClose={handleCloseContextMenu}
          anchorPosition={anchorPos}
          addon={contextMenuAddon}
        />
      )}
    </TableContainer>
  );
}

type AddonRowProps = {
  data: InstalledAddon;
  onContextMenu(event: React.MouseEvent, addon: InstalledAddon): void;
};

/*
  Context-menu
  Reinstall
  View Addon website
  Browse folders
  View changelogs
  Delete
*/

function AddonRow({ data, onContextMenu }: AddonRowProps) {
  const classes = useStyles(data);
  const updateInfo = useSelector((state: RootState) => {
    console.log('STATE IS', state);
    return selectById(state, data.id);
  });
  const logoUrl = data.addonInfo?.attachments[0]?.thumbnailUrl;

  return (
    <TableRow
      key={data.name}
      onContextMenu={(event) => onContextMenu(event, data)}
    >
      <TableCell className={classes.imageCell} size="medium">
        <Avatar
          alt="addon-logo"
          className={classes.imageCell}
          src={logoUrl}
          variant="rounded"
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={data.addonInfo?.name}
          secondary={data.installedFile?.fileName}
        />
      </TableCell>
      <StatusCell addon={data} updateInfo={updateInfo} />
      <TableCell>
        {data.installedFile?.displayName ||
          'Unable to get addon version. Click update to download latest version.'}
      </TableCell>
      <TableCell>{data.installedFile?.gameVersion}</TableCell>
    </TableRow>
  );
}

interface StatusCell extends TableCellProps {
  addon: InstalledAddon;
  updateInfo: AddonSearchResult | undefined;
}
function StatusCell(props: StatusCell) {
  const { updateInfo, addon } = props;
  const dispatch = useDispatch();
  let hasUpdate = false;

  if (updateInfo && addon.installedFile) {
    console.log(updateInfo);
    const latestFile = AddonManager.getLatestFile(updateInfo);
    if (latestFile) {
      hasUpdate = latestFile.displayName !== addon.installedFile.displayName;
    }
  }
  const InstallButton = (
    <Button onClick={() => dispatch(installAddon(addon.id))}>Update</Button>
  );
  return (
    <TableCell>
      {!addon.linked || hasUpdate ? InstallButton : 'Latest version'}
    </TableCell>
  );
}

type ContextMenuProps = {
  anchorPosition: AnchorPosition | undefined;
  onClose(event: SyntheticEvent, reason: string): void;
  addon: InstalledAddon;
};

function AddonRowContextMenu(props: ContextMenuProps) {
  const { addon, anchorPosition, onClose } = props;
  const [anchorEl, setAnchorEl] = useState<Element | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const getAddonsPath = useSelector(selectAddonPath);
  const dispatch = useDispatch();

  return (
    <Menu
      open={!!anchorPosition}
      onClose={onClose}
      anchorPosition={anchorPosition}
      anchorReference="anchorPosition"
    >
      <MenuItem onClick={() => console.log('reinstall', addon)}>
        Reinstall
      </MenuItem>
      <MenuItem>View Addon Website</MenuItem>
      {addon.installedDirectiories?.length === 1 ? (
        <MenuItem
          onClick={() =>
            shell.openPath(getAddonsPath(addon.installedDirectiories[0].name))
          }
        >
          <ListItemIcon>
            <FolderOpen />
          </ListItemIcon>
          <ListItemText primary="Browse Addon Folder" />
        </MenuItem>
      ) : (
        <MenuItem
          onClick={() => setOpen(!open)}
          onMouseOver={(event) => setAnchorEl(event.currentTarget)}
          onFocus={(event) => setAnchorEl(event.currentTarget)}
        >
          <ListItemText primary="Browse Addon Folders" />
          <ArrowRight />
        </MenuItem>
      )}
      <BrowseFoldersMenu
        directories={addon.installedDirectiories || []}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(undefined)}
        getContentAnchorEl={null}
      />
      <MenuItem onClick={() => dispatch(uninstallAddon(addon.id))}>
        <Typography color="error">Uninstall Addon</Typography>
      </MenuItem>
    </Menu>
  );
}

interface BrowseMenuProps extends MenuProps {
  directories: AddonDirectory[];
  onClose: Exclude<MenuProps['onClose'], undefined>;
}

function BrowseFoldersMenu(props: BrowseMenuProps) {
  const { directories, anchorEl, onClose } = props;
  const getAddonPath = useSelector(selectAddonPath);
  const classes = useStyles();

  return (
    <Menu
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={onClose}
      getContentAnchorEl={null}
      MenuListProps={{ onMouseLeave: (e) => onClose(e, 'backdropClick') }}
    >
      {directories.map((dir) => (
        <MenuItem
          key={dir.name}
          onClick={() => shell.openPath(getAddonPath(dir.name))}
        >
          <ListItemIcon>
            <FolderOpen />
          </ListItemIcon>
          <ListItemText primary={dir.name} />
          <ListItemIcon className={classes.menuOpenExternalIcon}>
            <Launch fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      ))}
    </Menu>
  );
}
