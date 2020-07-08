import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes.json';
import { makeStyles } from '@material-ui/styles';
import {
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
  Tab,
  Tabs,
  Collapse,
  CircularProgress,
} from '@material-ui/core';
import { TabPanel, TabContext, TabList } from '@material-ui/lab';
import MyAddonsView from './MyAddons/MyAddonsView';
import SelectWoWDir from '../config/SelectWowDir';
import {
  getAddonUpdateInfo,
  getAddonFileInfo,
  installAddonByFile,
} from '../effects';
import { selectById } from '../addonsSlice';
import {
  InstalledAddon,
  AddonSearchResult,
  AddonUpdateResult,
  GameFlavor,
} from '../types';
import {
  selectUpdateInfoById,
  selectMeta as selectUpdateMeta,
} from '../updateAddonsSlice';
import { RootState } from '../../../store';

const useStyles = makeStyles({
  tabPanelContainer: {
    height: '100%',
  },
  tabPanel: {
    height: '100%',
  },
});

interface AddonInfoProps {
  addon: InstalledAddon;
  open: boolean;
}

export default function AddonInfo({
  addon,
  open,
}: React.PropsWithChildren<AddonInfoProps>) {
  const [tab, setTab] = useState('0');
  const dispatch = useDispatch();

  const handleChange = (_, newTab: string) => setTab(newTab);

  return (
    <TableRow>
      <CollapsedCell open={open}>
        <TabContext value={tab}>
          <TabList onChange={handleChange} centered aria-label="addons">
            <Tab label="Overview" value="0" />
            <Tab label="Versions" value="1" />
          </TabList>
          <TabPanels>
            <TabPanel value="0">Some Overview</TabPanel>
            <TabPanel value="1">
              <VersionList addon={addon} />
            </TabPanel>
          </TabPanels>
        </TabContext>
      </CollapsedCell>
    </TableRow>
  );
}

function CollapsedCell({ children, open }) {
  return (
    <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
      <Collapse in={open} unmountOnExit>
        <Box margin={1}>{children}</Box>
      </Collapse>
    </TableCell>
  );
}

interface VersionListProps {
  addon: InstalledAddon;
}
function VersionList({ addon }: VersionListProps) {
  const dispatch = useDispatch();
  const addonInfo = useSelector((state: RootState) =>
    selectUpdateInfoById(state, addon.id)
  );
  const { loading } = useSelector(selectUpdateMeta);

  useEffect(() => {
    dispatch(getAddonUpdateInfo(addon.id));
  }, [addon.id, dispatch]);

  if (!addonInfo || (loading && addonInfo.latestFiles.length < 1)) {
    return <CircularProgress />;
  }

  const versions = addonInfo.latestFiles.filter(
    (f) => f.gameVersionFlavor === 'wow_retail'
  );
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Addon</TableCell>
            <TableCell>Addon Version</TableCell>
            <TableCell>Game Version</TableCell>
            <TableCell>Release Type</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {versions?.map((addonFile) => (
            <TableRow key={addonFile.fileName}>
              <TableCell>
                {new Date(addonFile.fileDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{addonFile.fileName}</TableCell>
              <TableCell>{addonFile.gameVersion}</TableCell>
              <TableCell>
                {['Release', 'Beta', 'Alpha'][addonFile.releaseType - 1]}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() =>
                    dispatch(
                      installAddonByFile({ addonId: addon.id, addonFile })
                    )
                  }
                  variant="outlined"
                  color="secondary"
                >
                  Install
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TabPanels({ children }) {
  const classes = useStyles();
  return (
    <div className={classes.tabPanelContainer}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { classes: { root: classes.tabPanel } })
      )}
    </div>
  );
}
