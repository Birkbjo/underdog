import { createSlice, EntityState } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import createElectronStorage from 'redux-persist-electron-storage';
import path from 'path';
import type { RootState } from '../../store';

const electronStore = createElectronStorage({
  electronStoreOpts: {
    name: 'config',
  },
});

export interface Config {
  paths: Record<string, string>;
  selectedPath: string;
}

const initialState: Config = {
  paths: {},
  selectedPath: undefined,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setPath: (state, action) => {
      const { path: selectedPath } = action.payload;
      const split = selectedPath.split(path.sep);
      const lastPart = split[split.length - 1];

      state.paths[lastPart] = selectedPath;
      state.selectedPath = lastPart;
    },
  },
});

const persistedReducer = persistReducer<Config>(
  {
    key: 'config',
    storage: electronStore,
    stateReconciler: autoMergeLevel1,
  },
  configSlice.reducer
);

export default persistedReducer;
export const { setPath } = configSlice.actions;

export const selectPath = (state: RootState) =>
  state.config.paths[state.config.selectedPath];
export const selectAddonRootPath = (state: RootState) =>
  path.join(selectPath(state), 'Interface', 'AddOns');

export const selectAddonPath = (state: RootState) => (addonDir: string) =>
  path.join(selectAddonRootPath(state), addonDir);
