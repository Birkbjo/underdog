import { createAsyncThunk } from '@reduxjs/toolkit';
import CurseForgeAPI from './CurseForgeAPI';
import {
  ScannedAddonData,
  InstalledAddon,
  AddonDirectory,
  AddonSearchResult,
} from './types';
import {
  addAddon,
  addManyAddons,
  selectAddons,
  selectById,
  removeAddon,
  removeManyAddons,
} from './addonsSlice';
import { selectResult } from './NewAddons/newAddonsSlice';
import { setAddons as setScannedAddons } from './MyAddons/myAddonsSlice';
import AddonManager, {
  getWithState as getAddonManager,
} from './AddonManager/AddonManager';
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
    const unmatched: ScannedAddonData[] = [];
    const matchedDirs: string[] = [];
    const matchedAddonsPromise = scanResult
      .filter((s) => !installedDirs.includes(s.shortName))
      .map(async (sa) => {
        if (matchedDirs.includes(sa.shortName)) {
          console.log('skipping ', sa.shortName, ' part of other addon');
          return null;
        }
        console.log('no info for', sa, ' ', matchedDirs);

        const searchResult = await CurseForgeAPI.search(sa.title);
        console.log('searched for', sa.title);
        // TODO: check sa.shortName against modules of matches
        let addonMatch: AddonSearchResult | undefined;
        const addonDirectMatch = searchResult.find(
          (sr) => sr.name === sa.title
        );
        addonMatch = addonDirectMatch;
        console.log('searchRes', searchResult);
        const moduleMatch = searchResult.find((sr) => {
          const latestFile = AddonManager.getLatestFile(sr);
          return (
            !!latestFile &&
            latestFile.modules.find(
              (m) => m.foldername === sa.shortName && m.type === 2
            )
          );
        });

        if (!addonMatch && moduleMatch) {
          console.log(
            'No direct match found, but found matching module',
            sa.shortName,
            ' on ',
            moduleMatch.name
          );
          addonMatch = moduleMatch;
        }

        if (addonMatch) {
          console.log(addonMatch);
          const latestFile = AddonManager.getLatestFile(addonMatch);
          let matchedVersion;
          let installedDirectiories: AddonDirectory[] | undefined;
          if (latestFile) {
            installedDirectiories = latestFile.modules.map((m) => {
              matchedDirs.push(m.foldername);
              return {
                name: m.foldername,
                isModule: m.foldername === sa.shortName && m.type === 2,
              };
            });

            if (sa.version && latestFile.displayName.includes(sa.version)) {
              matchedVersion = latestFile.displayName;
            }
          }

          const addon: InstalledAddon = {
            addonInfo: addonMatch,
            scannedAddon: sa,
            linked: !!matchedVersion,
            installed: true,
            id: addonMatch.id,
            name: addonMatch.name,
            version: matchedVersion,
            installedFile: latestFile || undefined,
            installedDirectiories,
          };
          return addon;
        }

        unmatched.push(sa);
        console.warn('No info found for', sa.title);
        return null;
        //    searchResult[0].lat;
      });

    const matchedAddons: InstalledAddon[] = (
      await Promise.all(matchedAddonsPromise)
    ).filter((ma) => !!ma);

    // As matching above is async
    // and some module may be loaded before the matched one,
    // we need to filter out modules that are apart of other addon "again"
    const unmatchedFiltered = unmatched.filter(
      (d) =>
        !matchedAddons.find(
          (a) =>
            a.addonInfo &&
            AddonManager.getLatestFile(a.addonInfo)?.modules.find(
              (m) => m.foldername === d.shortName
            )
        )
    );
    console.log('MATCHED', matchedAddons);
    console.log('UNMATCHED', unmatched);
    console.log('unatchfiltered', unmatchedFiltered);
    thunkAPI.dispatch(addManyAddons(matchedAddons));
    // Remove addons that are installed in Underdog, but not found in folder
    const notFoundDirs = installedDirs
      .filter((dirName) => !scanResult.find((sr) => sr.shortName === dirName))
      .map(
        (dirName) =>
          // find the addon with this directory
          installedAddons.find((addon) =>
            addon.installedDirectiories?.find((dir) => dir.name === dirName)
          )?.id
      )
      .filter((dir) => dir !== undefined) as number[];
    console.log('Dirs installed but not found', notFoundDirs);
    thunkAPI.dispatch(removeManyAddons(notFoundDirs));
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

export const uninstallAddon = createAsyncThunk(
  'addons/uninstall',
  async (id: number, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const addon = selectById(state, id);
    const addonManager = getAddonManager();

    if (addon === undefined) {
      return rejectWithValue(`Addon with id ${id} not found`);
    }
    try {
      await addonManager.uninstallAddon(addon);
      dispatch(removeAddon(id));
      return id;
    } catch (e) {
      return rejectWithValue(e);
    }
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
