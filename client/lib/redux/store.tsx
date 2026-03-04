import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApis } from "../apis/user-apis";
import authSlice from "./auth-slice";

export const store = configureStore({
  reducer: {
    [userApis.reducerPath]: userApis.reducer,
    authState: authSlice,
  },

  devTools: process.env.NODE_ENV !== "production",

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApis.middleware),
});

setupListeners(store.dispatch);
