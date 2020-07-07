import { combineReducers } from '@reduxjs/toolkit';

import myAddonsReducer from './MyAddons/myAddonsSlice';
import newAddonsReducer from './NewAddons/newAddonsSlice';
import updateAddonsReducer from './updateAddonsSlice';
import installedAddonsReducer from './addonsSlice';

export default combineReducers({
  myAddons: myAddonsReducer,
  newAddons: newAddonsReducer,
  installed: installedAddonsReducer,
  updates: updateAddonsReducer,
});
