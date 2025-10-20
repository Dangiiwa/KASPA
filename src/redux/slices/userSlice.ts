import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserData } from '../../types';

interface UserState {
  userData: UserData;
  authenticated: boolean;
  loading: boolean;
}

const initialState: UserState = {
  userData: {} as UserData,
  authenticated: false,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
      state.authenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      state.userData = {} as UserData;
      state.authenticated = false;
      state.loading = false;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserData>>) => {
      state.userData = { ...state.userData, ...action.payload };
    },
  },
});

export const { setLoading, loginSuccess, logout, updateProfile } = userSlice.actions;
export default userSlice.reducer;