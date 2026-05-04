import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCurrentUser } from "../redux/auth-slice";

let baseUrl = process.env.EXPO_PUBLIC_API_URL;

export const authApis = createApi({
  reducerPath: "authApis",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers, { getState }) => {
      const authToken = await AsyncStorage.getItem("refresh_token");

      headers.set("Authorization", `Bearer ${authToken}`);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    createNewUser: builder.mutation({
      query: (payload) => ({
        url: "/users/create",
        method: "POST",
        body: payload,
      }),
    }),

    verifyUserAccount: builder.mutation({
      query: (payload) => ({
        url: `/users/verify`,
        method: "PATCH",
        body: payload,
      }),
    }),

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
            const { accessToken, refreshToken, user } = data.data;

            await AsyncStorage.setItem("accessToken", accessToken);
            await AsyncStorage.setItem("refreshToken", refreshToken);

            dispatch(setCurrentUser({ currentUser: user }));
          }
        } catch (error) {
          // console.log(error);
        }
      },
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
            const { accessToken, user } = data.data;

            await AsyncStorage.setItem("accessToken", accessToken);

            dispatch(setCurrentUser({ currentUser: user }));
          }
        } catch (error) {
          // console.log(error);
        }
      },
    }),

    getNewVerificationCode: builder.mutation({
      query: (payload) => ({
        url: `/users/new-verification-code`,
        method: "POST",
        body: payload,
      }),
    }),

    requestPasscodeReset: builder.mutation({
      query: (payload) => ({
        url: `/users/password/reset`,
        method: "POST",
        body: payload,
      }),
    }),

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
} = authApis;
