import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../../store';

let ID = 0;
const myAddonsSlice = createSlice({
  name: 'myAddons',
  initialState: {
    list: [], // TODO: mark as module and isOwnedByAddonId
    scanned: false,
    lastScanned: undefined,
  },
  reducers: {
    setAddons: (state, action) => {
      console.log('SET ADDONS');
      const list = action.payload.map((addon) => {
        return {
          id: ID++,
          ...addon,
        };
      });
      state.list = list;
      state.scanned = true;
      state.lastScanned = new Date().toISOString();
    },
  },
});

export const { setAddons } = myAddonsSlice.actions;

export default myAddonsSlice.reducer;

export const selectAddons = (state: RootState): Record<string, string>[] =>
  state.addons.myAddons.list;
