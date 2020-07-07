import {
  createSlice,
  combineReducers,
  createSelector,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit';
import { ScannedAddonData, AddonSearchResult, InstalledAddon } from './types';
import type { RootState } from '../../store';

const updateAddonsAdapter = createEntityAdapter<AddonSearchResult>({
  selectId: (addon) => addon.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export type InstalledAddonsState = EntityState<AddonSearchResult>;

export interface UpdateAddonsMeta {
  loading: boolean;
  lastCheck: number | null;
}

const initialState: UpdateAddonsMeta = {
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
      .addCase('addons/getUpdateInfo/pending', (state, action) => {
        state.loading = true;
      })
      .addCase('addons/getUpdateInfo/fulfilled', (state, action) => {
        state.loading = false;
        state.lastCheck = new Date().getTime();
        updateAddonsAdapter.upsertMany(state, action.payload);
      }),
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

export const selectAddons = (state: RootState) => selectAll(state);

export default updateAddonsSlice.reducer;
