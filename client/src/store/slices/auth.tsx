import { createSlice } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isVerified: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isVerified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { accessToken, user } = action.payload;

      localStorage.setItem("festify-ws-access-token", accessToken);
      state.isLoggedIn = true;
      state.isVerified = user.isEmailVerified;
      state.user = user;
    },
    clearCredentials(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.isVerified = false;
      localStorage.removeItem("festify-ws-access-token");
    },
  },
});

interface State {
  auth: AuthState;
}

export const selectUser = (state: State) => state.auth.user;
export const selectIsLoggedIn = (state: State) => state.auth.isLoggedIn;
export const selectIsVerified = (state: State) => state.auth.isVerified;

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
