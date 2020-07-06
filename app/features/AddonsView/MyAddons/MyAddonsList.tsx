import React, {
  useState,
  useCallback,
  SyntheticEvent,
  MouseEvent,
} from 'react';
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
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  MenuProps,
} from '@material-ui/core';
import {
  FolderOpen,
  ArrowRight,
  ExpandMore,
  ExpandLess,
} from '@material-ui/icons';
import { shell } from 'electron';
import { useAsync } from 'react-async-hook';
import { selectAddons as selectMyAddons } from './myAddonsSlice';
import { selectAddons } from '../addonsSlice';
import { selectAddonPath, selectAddonRootPath } from '../../config/configSlice';
import { InstalledAddon, AddonDirectory } from '../types';
import { uninstallAddon } from '../effects';

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

  const handleCloseContext = () => setAnchorPos(undefined);
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
      <AddonRowContextMenu
        onClose={handleCloseContext}
        anchorPosition={anchorPos}
        addon={contextMenuAddon}
      />
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
  const logoUrl = data.addonInfo?.attachments[0]?.thumbnailUrl;
  const mainDir = data.installedDirectiories?.find(
    (dir) => dir.isModule === false
  );

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
      <TableCell>N/A</TableCell>
      <TableCell>{data.installedFile?.displayName}</TableCell>
      <TableCell>{data.installedFile?.gameVersion}</TableCell>
    </TableRow>
  );
}

type ContextMenuProps = {
  anchorPosition: AnchorPosition | undefined;
  onClose(event: SyntheticEvent, reason: string): void;
  addon: InstalledAddon | undefined;
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
      {addon?.installedDirectiories?.length === 1 ? (
        <MenuItem
          onClick={() =>
            shell.openPath(getAddonsPath(addon?.installedDirectiories[0].name))
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
        directories={addon?.installedDirectiories || []}
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
}

function BrowseFoldersMenu(props: BrowseMenuProps) {
  const { directories, anchorEl, onClose } = props;
  const getAddonPath = useSelector(selectAddonPath);

  return (
    <Menu
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={onClose}
      getContentAnchorEl={null}
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
        </MenuItem>
      ))}
    </Menu>
  );
}
