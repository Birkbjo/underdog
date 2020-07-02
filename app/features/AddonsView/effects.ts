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
    console.log('install addon act');
    const state = thunkAPI.getState() as RootState;
    console.log(state);
    const manager = getAddonManager();
    console.log('manager is', manager);
    const searchResult = selectResult(state).find((sr) => sr.id === id);
    console.log(searchResult);
    if (!searchResult) {
      console.log('no search res');
      return thunkAPI.rejectWithValue('No searchresult with id ');
    }
    const installed = await manager.installLatestFile(searchResult);
    console.log('Installed addon', installed);
    thunkAPI.dispatch(addAddon(installed));
    return installed;
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

// export const scanAndGetAddonInfo = createAsyncThunk(
//   'addons/scanAndGetAddonInfo',
//   async (args, thunkAPI => {
//     thunkAPI.dispatch()
//   }
// );

//export const installedAddons;
