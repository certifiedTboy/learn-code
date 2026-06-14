import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Platform } from "react-native";

let baseUrl = process.env.EXPO_PUBLIC_API_URL;

export const courseApis = createApi({
  reducerPath: "courseApis",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers, { getState }) => {
      const authToken = await AsyncStorage.getItem("accessToken");

      headers.set("Authorization", `Bearer ${authToken}`);
      headers.set("x-client-type", "mobile");
      headers.set("X-Platform", Platform.OS);
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

    updateRegisteredCoursesProgress: builder.mutation({
      query: (payload) => ({
        url: "/courses/update-progress",
        method: "PUT",
        body: payload,
      }),
    }),

    getRegisteredCourses: builder.mutation({
      query: () => ({
        url: "/courses/registered-courses",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllCoursesMutation,
  useUpdateRegisteredCoursesProgressMutation,
  useGetRegisteredCoursesMutation,
} = courseApis;
