import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { updateToken } from "../../helpers/user-session";
import { setCurrentUser } from "../../redux/slice/auth-slice";

const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

export const authApis = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    createAdminAccount: builder.mutation({
      query: (payload) => ({
        url: "/users/create",
        method: "POST",
        body: payload,
      }),
    }),

    verifyAdminAccount: builder.mutation({
      query: (payload) => ({
        url: "/users/verify",
        method: "PATCH",
        body: payload,
      }),
    }),

    loginAdminAccount: builder.mutation({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),

      async onQueryStarted(__, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setCurrentUser(data.data?.user));
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

      async onQueryStarted(__, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data) {
            const { accessToken, user } = data.data;

            if (accessToken && user) {
              await updateToken(accessToken);

              dispatch(setCurrentUser({ currentUser: user }));
            }
          }
        } catch (error) {
          console.log(error);
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
  useCreateAdminAccountMutation,
  useVerifyAdminAccountMutation,
  useLoginAdminAccountMutation,
  useGetNewTokenMutation,
  useGetNewVerificationCodeMutation,
  useRequestPasscodeResetMutation,
  useUpdatePasscodeMutation,
} = authApis;
