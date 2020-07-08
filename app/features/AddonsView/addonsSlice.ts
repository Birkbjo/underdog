import {
  createSlice,
  combineReducers,
  createSelector,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import { persistReducer } from 'redux-persist';
import createElectronStorage from 'redux-persist-electron-storage';
import { setAddons as setScannedAddons } from './MyAddons/myAddonsSlice';
import { ScannedAddonData, AddonSearchResult, InstalledAddon } from './types';
import type { RootState } from '../../store';

const electronStore = createElectronStorage({
  electronStoreOpts: {
    name: 'installedAddons',
  },
});

const installedAddonsAdapter = createEntityAdapter<InstalledAddon>({
  selectId: (addon) => addon.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export type InstalledAddonsState = EntityState<InstalledAddon>;

const initialState: InstalledAddonsSlice = {
  list: [],
};

const addonsSlice = createSlice({
  name: 'installed',
  initialState: installedAddonsAdapter.getInitialState(),
  reducers: {
    addAddon: installedAddonsAdapter.upsertOne,
    addManyAddons: installedAddonsAdapter.upsertMany,
    removeAddon: installedAddonsAdapter.removeOne,
    removeManyAddons: installedAddonsAdapter.removeMany,
  },
  extraReducers: (builder) =>
    builder.addCase(setScannedAddons, (state, action) => {}),
});

const makeAddonsSlice = (name) =>
  createSlice({
    name,
    initialState: installedAddonsAdapter.getInitialState(),
    reducers: {
      addAddon: installedAddonsAdapter.addOne,
      addManyAddons: installedAddonsAdapter.addMany,
      removeAddon: installedAddonsAdapter.removeOne,
      removeManyAddons: installedAddonsAdapter.removeMany,
    },
    extraReducers: (builder) =>
      builder.addCase(setScannedAddons, (state, action) => {}),
  });

export const {
  addAddon,
  addManyAddons,
  removeAddon,
  removeManyAddons,
} = addonsSlice.actions;

export const {
  selectAll,
  selectTotal,
  selectIds,
  selectEntities,
  selectById,
} = installedAddonsAdapter.getSelectors(
  (state: RootState) => state.addons.installed
);

export const selectAddons = (state: RootState) => selectAll(state);

const persistedInstalledAddonsReducer = persistReducer<InstalledAddonsState>(
  {
    key: 'installed',
    storage: electronStore,
    stateReconciler: autoMergeLevel1,
  },
  addonsSlice.reducer
);
export default persistedInstalledAddonsReducer;

let current = makeAddonsSlice('_retail_');
current = addonsSlice;
// export default combineReducers({
//   myAddons: myAddonsReducer,
//   newAddons: newAddonsReducer,
//   installed: persistedInstalledAddonsReducer,
//   current: current.reducer,
//   updates: updateAddonsReducer,
// });
