import {
  createSlice,
  combineReducers,
  createSelector,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit';
import {
  ScannedAddonData,
  AddonUpdateResult,
  InstalledAddon,
  AddonFile,
} from './types';
import { selectById as selectAddonById } from './addonsSlice';

import type { RootState } from '../../store';
import AddonManager from './AddonManager/AddonManager';

const updateAddonsAdapter = createEntityAdapter<AddonUpdateResult>({
  selectId: (addon) => addon.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export interface AddonUpdatesMeta {
  loading: boolean;
  lastCheck: number | null;
}

export type AddonUpdatesState = EntityState<AddonUpdateResult> &
  AddonUpdatesMeta;

const initialState: AddonUpdatesMeta = {
  loading: false,
  lastCheck: null,
};

const updateAddonsSlice = createSlice({
  name: 'update',
  initialState: updateAddonsAdapter.getInitialState(initialState),
  reducers: {
    addAddon: updateAddonsAdapter.upsertOne,
    addManyAddons: updateAddonsAdapter.upsertMany,
    removeAddon: updateAddonsAdapter.removeOne,
    removeManyAddons: updateAddonsAdapter.removeMany,
  },
  extraReducers: (builder) =>
    builder
      .addCase('updates/getUpdateInfo/pending', (state, action) => {
        state.loading = true;
      })
      .addCase('updates/getUpdateInfo/fulfilled', (state, action) => {
        state.loading = false;
        state.lastCheck = new Date().getTime();
        updateAddonsAdapter.upsertMany(state, action.payload);
      })
      .addCase('updates/getUpdateInfoById/pending', (state, action) => {
        state.loading = true;
      })
      .addCase('updates/getFileInfoById/pending', (state, action) => {
        state.loading = true;
      })
      .addCase('updates/getUpdateInfoById/fulfilled', (state, action) => {
        state.loading = false;
        updateAddonsAdapter.upsertOne(state, action.payload);
      }),
  //.addMatcher((action) => action.endsWith()),
});

export const {
  addAddon,
  addManyAddons,
  removeAddon,
  removeManyAddons,
} = updateAddonsSlice.actions;

export const {
  selectAll,
  selectTotal,
  selectIds,
  selectEntities,
  selectById,
} = updateAddonsAdapter.getSelectors(
  (state: RootState) => state.addons.updates
);

export const selectUpdateState = (state: RootState) => state.addons.updates;

export const selectAddonFileById = createSelector(
  (state: RootState, addonId: number) => selectById(state, addonId),
  (_, __, fileId: number) => fileId,
  (addon: AddonUpdateResult | undefined, fileId: number) =>
    addon?.latestFiles?.find((f) => f.id === fileId)
);

export const selectMeta = createSelector(selectUpdateState, (updates) => {
  return {
    loading: updates.loading,
    lastCheck: updates.lastCheck,
  };
});

export const selectUpdateInfoById = selectById;
//  createSelector(
//   selectById,
//   (entity) => entity
//);

export const selectAddons = (state: RootState) => selectAll(state);

export const selectHasUpdate = createSelector(
  selectAddonById,
  selectUpdateInfoById,
  (installedAddon, updateInfo) => {
    if (!installedAddon || !updateInfo) {
      return undefined;
    }
    const latestFile = AddonManager.getLatestFile(updateInfo);
    if (!latestFile) {
      return undefined;
    }
    return latestFile.displayName !== installedAddon.installedFile.displayName;
  }
);

export default updateAddonsSlice.reducer;
