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
  accessToken: string | null;
  isLoggedIn: boolean;
  isVerified: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("festify-access-token"),
  isLoggedIn: false,
  isVerified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { accessToken, user } = action.payload;
      localStorage.setItem("festify-access-token", accessToken);
      state.user = user;
      state.accessToken = accessToken;
      state.isLoggedIn = true;
      state.isVerified = user.isVerified;
    },
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
      state.isLoggedIn = false;
      state.isVerified = false;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

interface State {
  auth: AuthState;
}

export const selectAccessToken = (state: State) => state.auth.accessToken;
export const selectUser = (state: State) => state.auth.user;
export const selectIsLoggedIn = (state: State) => state.auth.isLoggedIn;
export const selectIsVerified = (state: State) => state.auth.isVerified;

export const { setCredentials, clearCredentials, setUser } = authSlice.actions;

export default authSlice.reducer;
