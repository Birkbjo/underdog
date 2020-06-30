import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
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
  OutlinedInput,
  TextField,
  Toolbar,
  AppBar,
} from '@material-ui/core';
import { useAsync } from 'react-async-hook';
import CurseForgeAPI from '../CurseForgeAPI';
import { setSearchResult } from './newAddonsSlice';

const useStyles = makeStyles((theme) => ({
  headerbar: {
    marginBottom: '1rem',
    backgroundColor: theme.palette.background.paper,
  },
  searchField: {
    padding: 5,
  },
}));

export default function AddonSearch() {
  const [search, setSearch] = useState('');
  const [prevSearch, setPrevSearch] = useState(search);
  const dispatch = useDispatch();
  // const { loading, error, result } = useAsync(CurseForgeAPI.search, [search]);
  //const addons = useSelector(selectAddons);

  const handleSearch = (searchText: string): void => {
    if (!searchText) {
      return;
    }
    if (prevSearch === searchText) {
      return;
    }

    setPrevSearch(searchText);
    CurseForgeAPI.search(searchText)
      .then((res) => {
        console.log(res);
        dispatch(setSearchResult(res));
        return res;
      })
      .catch((e) => console.log(e));
  };

  const handleEnter = (event: React.KeyboardEvent) =>
    event.key === 'Enter' && handleSearch(search);

  return (
    <TextField
      value={search}
      placeholder="Search AddOns"
      onChange={({ target: { value } }) => setSearch(value)}
      label="Search"
      type="search"
      onKeyDown={handleEnter}
    />
  );
}
