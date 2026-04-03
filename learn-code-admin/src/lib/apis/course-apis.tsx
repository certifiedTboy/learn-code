import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../../helpers/user-session";

const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

export const courseApis = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      const token = await getToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getAllCourses: builder.mutation({
      query: () => ({
        url: "/courses",
        method: "GET",
      }),
    }),

    createNewCourse: builder.mutation({
      query: (payload) => ({
        url: "/courses/create",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useCreateNewCourseMutation, useGetAllCoursesMutation } =
  courseApis;
