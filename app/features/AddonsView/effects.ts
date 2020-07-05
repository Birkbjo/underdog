import { createAsyncThunk } from '@reduxjs/toolkit';
import CurseForgeAPI from './CurseForgeAPI';
import { ScannedAddonData, InstalledAddon } from './types';
import { addAddon, selectAddons } from './addonsSlice';
import { selectResult } from './NewAddons/newAddonsSlice';
import { setAddons as setScannedAddons } from './MyAddons/myAddonsSlice';
import { getWithState as getAddonManager } from './AddonManager/AddonManager';
import { RootState } from './../../store';

export const scanAddons = createAsyncThunk(
  'myAddons/scan',
  async (args, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const addonManager = getAddonManager();
    const installedAddons = selectAddons(state);

    const installedDirs = installedAddons.flatMap((a) =>
      a.installedDirectiories?.map((d) => d.name)
    );

    console.log('installedolfders', installedDirs);
    const scanResult = await addonManager.scan();

    const addonMatches = [];
    const unmatched = [];
    const unknownAddons = scanResult
      .filter((s) => !installedDirs.includes(s.shortName))
      .map(async (sa) => {
        console.log('no info for', sa);
        const searchResult = await CurseForgeAPI.search(sa.title);
        const addonMatch = searchResult.find((sr) => sr.name === sa.title);
        if (addonMatch) {
        } else {
          console.warn('No info found for', sa.title);
          return null;
          //    searchResult[0].lat;
        }
      });
  }
  // const
);

export const installAddon = createAsyncThunk(
  'addons/installAddon',
  async (id: number, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const manager = getAddonManager();
    const searchResult = selectResult(state).find((sr) => sr.id === id);

    if (!searchResult) {
      console.log('no search res');
      return thunkAPI.rejectWithValue('No searchresult with id ');
    }

    const installed = await manager.installLatestFile(searchResult);
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
