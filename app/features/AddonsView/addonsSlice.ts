import {
  createSlice,
  combineReducers,
  createAsyncThunk,
} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import myAddonsReducer, {
  setAddons as setScannedAddons,
} from './MyAddons/myAddonsSlice';
import newAddonsReducer from './NewAddons/newAddonsSlice';
import { ScannedAddonData, AddonSearchResult, InstalledAddon } from './types';

export interface InstalledAddonsSlice {
  addons: InstalledAddon[];
}
const initialState: InstalledAddonsSlice = {
  addons: [],
};

const addonsSlice = createSlice({
  name: 'installed',
  initialState,
  reducers: {
    addAddon: (state, action) => {
      const addon = action.payload;
      state.addons.push(addon);
    },
  },
  extraReducers: (builder) =>
    builder.addCase(setScannedAddons, (state, action) => {}),
});

// export const installAddon = createAsyncThunk(
//   'addons/installAddon',
//   async ({}, thunkAPI) => {}
// );

//export const installedAddons;

export const { addAddon } = addonsSlice.actions;

//export const getLinkedAddonBy;

export default combineReducers({
  myAddons: myAddonsReducer,
  newAddons: newAddonsReducer,
  addons: addonsSlice.reducer,
});
