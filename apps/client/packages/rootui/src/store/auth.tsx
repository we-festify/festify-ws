import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action) {
      state.token = action.payload;
    },
    clearCredentials(state) {
      state.token = null;
    },
  },
});

interface State {
  auth: AuthState;
}

export const selectIsLoggedIn = (state: State) => state.auth.token !== null;

export const { setAccessToken, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
