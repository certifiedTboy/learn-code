import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Platform } from "react-native";

let baseUrl = process.env.EXPO_PUBLIC_API_URL;

export const userApis = createApi({
  reducerPath: "userApis",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers, { getState }) => {
      const authToken = await AsyncStorage.getItem("access_token");

      headers.set("Authorization", `Bearer ${authToken}`);
      headers.set("x-client-type", "mobile");
      headers.set("X-Platform", Platform.OS);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getCurrentUser: builder.mutation({
      query: () => ({
        url: `/users/current-user`,
        method: "GET",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error: unknown) {
          // @ts-ignore
          if (error?.error?.data?.message === "jwt expired") {
            dispatch(
              userApis.endpoints.getNewToken.initiate({
                refreshToken: await AsyncStorage.getItem("refreshToken"),
              }),
            );
          }
        }
      },
    }),

    getUserProfile: builder.mutation({
      query: (payload) => ({
        url: `/auth/user/${payload}/profile`,
        method: "GET",
      }),
    }),

    updateUserProfile: builder.mutation({
      query: (payload) => ({
        url: `/users/current-user/update`,
        method: "PATCH",
        body: payload,
      }),
    }),

    getNewToken: builder.mutation({
      query: () => ({
        url: `/auth/new-token`,
        method: "GET",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data) {
            const { accessToken } = data.data;

            await AsyncStorage.setItem("access_token", accessToken);
          }
        } catch (error) {
          // console.log(error);
        }
      },
    }),
  }),
});

export const {
  useGetCurrentUserMutation,
  useGetUserProfileMutation,
  useUpdateUserProfileMutation,
} = userApis;
