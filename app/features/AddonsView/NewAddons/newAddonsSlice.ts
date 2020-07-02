import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddonSearchResult } from '../types';
// eslint-disable-next-line import/no-cycle
import type { RootState } from '../../../store';

export interface NewAddonsSlice {
  addons: AddonSearchResult[];
}
const initialState: NewAddonsSlice = {
  addons: [],
};
const newAddonsSlice = createSlice({
  name: 'newAddons',
  initialState,
  reducers: {
    setSearchResult: (state, action: PayloadAction<AddonSearchResult[]>) => {
      const list = action.payload;

      state.addons = list;
    },
  },
});

export const { setSearchResult } = newAddonsSlice.actions;

export default newAddonsSlice.reducer;

export const selectResult = (state: RootState): AddonSearchResult[] =>
  state.addons.newAddons.addons;
