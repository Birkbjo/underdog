import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../../store';
import AddonManager from './AddonManager/AddonManager';
import { selectors as updateAddonsSelectors } from './updateAddonsSlice';
import { selectors as addonsSelectors } from './addonsSlice';

// in own file due to dependendency cycles

export const selectHasUpdate = createSelector(
  addonsSelectors.selectById,
  updateAddonsSelectors.selectById,
  (installedAddon, updateInfo) => {
    if (!installedAddon || !updateInfo) {
      return false;
    }
    const latestFile = AddonManager.getLatestFile(updateInfo);
    if (!latestFile) {
      return false;
    }
    return (
      latestFile?.displayName !== installedAddon?.installedFile?.displayName
    );
  }
);

// TODO: maybe add .hasUpdate in InstalledAddon-type
export const selectSortedAddons = createSelector(
  (state) => state,
  addonsSelectors.selectAll,
  (state, addons) => {
    return addons.concat().sort((a, b) => {
      return +selectHasUpdate(state, b.id) - +selectHasUpdate(state, a.id);
    });
  }
);
