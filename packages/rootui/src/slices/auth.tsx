import { createSlice } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export interface AuthState {
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { accessToken } = action.payload;

      localStorage.setItem('festify-ws-access-token', accessToken);
      state.isLoggedIn = true;
    },
    clearCredentials(state) {
      state.isLoggedIn = false;
      localStorage.removeItem('festify-ws-access-token');
    },
  },
});

interface State {
  auth: AuthState;
}

export const selectIsLoggedIn = (state: State) => state.auth.isLoggedIn;

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
