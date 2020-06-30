import React, { useState, SyntheticEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes.json';
import { makeStyles } from '@material-ui/styles';
import {
  Button as MButton,
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
} from '@material-ui/core';
import { TabPanel, TabContext, TabList } from '@material-ui/lab';
import MyAddonsList from './MyAddons/MyAddonsList';
import SelectWoWDir from '../config/SelectWowDir';
import NewAddonsView from './NewAddons/NewAddonsView';

const useStyles = makeStyles({
  tabPanelContainer: {
    height: 'calc(100vh - 230px)',
  },
  tabPanel: {
    height: '100%',
  },
});
export default function AddonsView() {
  const [tab, setTab] = useState('0');

  const handleChange = (_, newTab: string) => setTab(newTab);

  return (
    <>
      <TabContext value={tab}>
        <TabList onChange={handleChange} centered aria-label="addons">
          <Tab label="My AddOns" value="0" />
          <Tab label="New AddOns" value="1" />
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <MyAddonsList />
          </TabPanel>
          <TabPanel value="1">
            <NewAddonsView />
          </TabPanel>
        </TabPanels>
      </TabContext>
      <SelectWoWDir />
    </>
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
