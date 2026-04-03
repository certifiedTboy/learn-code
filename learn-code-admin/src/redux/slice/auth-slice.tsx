import { createSlice } from "@reduxjs/toolkit";

interface CurrentUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthState {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "authState",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = authSlice.actions;

export default authSlice.reducer;
