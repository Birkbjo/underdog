import React, { useState, useEffect } from 'react';
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
import MyAddonsView from './MyAddons/MyAddonsView';
import SelectWoWDir from '../config/SelectWowDir';
import NewAddonsView from './NewAddons/NewAddonsView';
import { initAddons } from './effects';
import { selectPath } from '../config/configSlice';

const useStyles = makeStyles({
  tabPanelContainer: {
    height: 'calc(100vh - 215px)',
  },
  tabPanel: {
    height: '100%',
  },
});
export default function AddonsView() {
  const [tab, setTab] = useState('0');
  const path = useSelector(selectPath);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAddons());
  }, [dispatch, path]);

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
            <MyAddonsView />
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
