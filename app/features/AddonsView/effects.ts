import { createAsyncThunk } from '@reduxjs/toolkit';
import CurseForgeAPI from './CurseForgeAPI';
import { ScannedAddonData, InstalledAddon } from './types';
import { addAddon } from './addonsSlice';
import { selectResult } from './NewAddons/newAddonsSlice';
import { getWithState as getAddonManager } from './AddonManager/AddonManager';
import { RootState } from './../../store';

export const installAddon = createAsyncThunk(
  'addons/installAddon',
  async (id: number, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const manager = getAddonManager();
    const searchResult = selectResult(state).find((sr) => sr.id === id);
    if (!searchResult) {
      return thunkAPI.rejectWithValue('No searchresult with id ');
    }
    manager.installLatestFile(searchResult);
  }
);

export const getInstalledAddonInfo = createAsyncThunk(
  'addons/getInstalledAddonInfo',
  async (scannedAddon: ScannedAddonData, { dispatch, getState }) => {
    const searchRes = await CurseForgeAPI.search(scannedAddon.title);

    const addonMatch = searchRes.find((sr) => sr.name === scannedAddon.title);
    if (addonMatch) {
      const addon: InstalledAddon = {
        scannedAddon,
        addonInfo: addonMatch,
        linked: true,
        installed: true,
        id: addonMatch.id,
      };
      if (scannedAddon.shortName === 'Details') {
        console.log('INSTALL LATEST');
        const manager = getAddonManager();
        console.log('manager is', manager);
        manager.installLatestFile(addonMatch);
      }
      dispatch(addAddon(addon));
    } else {
      console.log('NO MATCH!', scannedAddon, searchRes);
    }
  }
);

//export const installedAddons;
