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
  InputAdornment,
} from '@material-ui/core';
import { Search, Clear } from '@material-ui/icons';
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
  searchFieldClear: {
    cursor: 'pointer',
    visibility: (props) => (props.search ? 'visible' : 'hidden'),
  },
}));

export default function AddonSearch(props) {
  const [search, setSearch] = useState('');
  const [prevSearch, setPrevSearch] = useState(search);
  const dispatch = useDispatch();
  const classes = useStyles({ ...props, search });
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
      color="secondary"
      placeholder="Search AddOns"
      onChange={({ target: { value } }) => setSearch(value)}
      label="Search"
      onKeyDown={handleEnter}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment
            className={classes.searchFieldClear}
            position="end"
            onClick={() => setSearch('')}
          >
            <Clear />
          </InputAdornment>
        ),
        color: 'secondary',
      }}
    />
  );
}
