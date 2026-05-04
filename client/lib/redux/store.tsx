import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApis } from "../apis/auth-apis";
import { courseApis } from "../apis/course-apis";
import { userApis } from "../apis/user-apis";
import authSlice from "./auth-slice";

export const store = configureStore({
  reducer: {
    [userApis.reducerPath]: userApis.reducer,
    [courseApis.reducerPath]: courseApis.reducer,
    [authApis.reducerPath]: authApis.reducer,

    authState: authSlice,
  },

  devTools: process.env.NODE_ENV !== "production",

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApis.middleware,
      courseApis.middleware,
      authApis.middleware,
    ),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
