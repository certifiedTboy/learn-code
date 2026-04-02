import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

export const authApis = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
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
    }),

    getAdminProfile: builder.mutation({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateAdminAccountMutation,
  useVerifyAdminAccountMutation,
  useLoginAdminAccountMutation,
  useGetAdminProfileMutation,
} = authApis;
