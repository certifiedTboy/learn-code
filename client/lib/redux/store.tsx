import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { courseApis } from "../apis/course-apis";
import { userApis } from "../apis/user-apis";
import authSlice from "./auth-slice";

export const store = configureStore({
  reducer: {
    [userApis.reducerPath]: userApis.reducer,
    [courseApis.reducerPath]: courseApis.reducer,

    authState: authSlice,
  },

  devTools: process.env.NODE_ENV !== "production",

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApis.middleware, courseApis.middleware),
});

setupListeners(store.dispatch);
