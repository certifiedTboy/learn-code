import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApis } from "../../lib/apis/auth-apis";
import { courseApis } from "../../lib/apis/course-apis";
import { userApis } from "../../lib/apis/user-apis";
import { authSlice } from "../slice/auth-slice";

export const store = configureStore({
  reducer: {
    authState: authSlice.reducer,
    [authApis.reducerPath]: authApis.reducer,
    [courseApis.reducerPath]: courseApis.reducer,
    [userApis.reducerPath]: userApis.reducer,
  },

  devTools: import.meta.env.NODE_ENV !== "production",

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApis.middleware,
      courseApis.middleware,
      userApis.middleware,
    ),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
