import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

const configSlice = createSlice({
  name: 'config',
  initialState: { path: '' },
  reducers: {
    setPath: (state, action) => {
      const { path } = action.payload;
      state.path = path;
    },
  },
});

export const { setPath } = configSlice.actions;

export default configSlice.reducer;

export const selectPath = (state: RootState) => state.config.path;
