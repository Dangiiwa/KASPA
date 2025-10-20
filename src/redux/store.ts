import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import fieldsSlice from './slices/fieldsSlice';
import satelliteSlice from './slices/satelliteSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    fields: fieldsSlice,
    satellite: satelliteSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;