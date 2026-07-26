/**
 * Redux Toolkit Query (RTK Query) API slice for authentication.
 * Defines endpoints for user registration, login (email and Google),
 * token refreshing, and password recovery.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Platform } from "react-native";

let baseUrl = process.env.EXPO_PUBLIC_API_URL;

export const authApis = createApi({
  reducerPath: "authApis",
  // Configures the base query, including a custom header injection for authentication
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers, { getState }) => {
      // Retrieve the refresh token from local storage to authorize protected requests
      const authToken = await AsyncStorage.getItem("refresh_token");

      headers.set("Authorization", `Bearer ${authToken}`);
      headers.set("x-client-type", "mobile");
      headers.set("X-Platform", Platform.OS);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    /**
     * Endpoint to create a new user account.
     */
    createNewUser: builder.mutation({
      query: (payload) => ({
        url: "/users/create",
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * Endpoint to verify a user's account using a verification code.
     */
    verifyUserAccount: builder.mutation({
      query: (payload) => ({
        url: `/users/verify`,
        method: "PATCH",
        body: payload,
      }),
    }),

    /**
     * Standard Email/Password login endpoint.
     * Intercepts successful responses to automatically store auth tokens.
     */
    loginUser: builder.mutation({
      query: (payload) => ({
        url: `/auth/login`,
        method: "POST",
        body: payload,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data) {
            // Persist tokens to AsyncStorage upon successful login
            const { accessToken, refreshToken } = data.data;

            await AsyncStorage.setItem("accessToken", accessToken);
            await AsyncStorage.setItem("refreshToken", refreshToken);
          }
        } catch (error) {
          // console.log(error);
        }
      },
    }),

    /**
     * Google OAuth login verification endpoint.
     * Intercepts successful responses to automatically store auth tokens.
     */
    loginWithGoogle: builder.mutation({
      query: (payload) => ({
        url: `/auth/google/login`,
        method: "POST",
        body: payload,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data) {
            // Persist tokens to AsyncStorage upon successful Google login
            const { accessToken, refreshToken } = data.data;

            await AsyncStorage.setItem("accessToken", accessToken);
            await AsyncStorage.setItem("refreshToken", refreshToken);
          }
        } catch (error) {
          // console.log(error);
        }
      },
    }),

    /**
     * Retrieves a new access token using the stored refresh token.
     */
    getNewToken: builder.mutation({
      query: () => ({
        url: `/auth/new-token`,
        method: "GET",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data) {
            // Update the access token in AsyncStorage
            const { accessToken, user } = data.data;

            await AsyncStorage.setItem("accessToken", accessToken);
          }
        } catch (error) {
          // console.log(error);
        }
      },
    }),

    /**
     * Requests a new verification code for email confirmation.
     */
    getNewVerificationCode: builder.mutation({
      query: (payload) => ({
        url: `/users/new-verification-code`,
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * Initiates the password reset process by sending a reset code.
     */
    requestPasscodeReset: builder.mutation({
      query: (payload) => ({
        url: `/users/password/reset`,
        method: "POST",
        body: payload,
      }),
    }),

    /**
     * Submits a new password using a valid reset token/code.
     */
    updatePasscode: builder.mutation({
      query: (payload) => ({
        url: `/users/password/reset/update`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useCreateNewUserMutation,
  useVerifyUserAccountMutation,
  useLoginUserMutation,
  useGetNewVerificationCodeMutation,
  useRequestPasscodeResetMutation,
  useUpdatePasscodeMutation,
  useLoginWithGoogleMutation,
} = authApis;
