import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

let baseUrl = process.env.EXPO_PUBLIC_API_URL;

export const courseApis = createApi({
  reducerPath: "courseApis",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers, { getState }) => {
      const authToken = await AsyncStorage.getItem("accessToken");

      headers.set("Authorization", `Bearer ${authToken}`);
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
  }),
});

export const { useGetAllCoursesMutation } = courseApis;

export const courses = [
  {
    title: "Chapter 1: What is Graphics Designing?",
    isCheckedList: true,
    items: [
      { text: "Lorem ipsum dolor sit amet consectetur.", checked: true },
      { text: "Lorem ipsum dolor sit amet consectetur.", checked: true },
      { text: "Lorem ipsum dolor sit amet consectetur.", checked: true },
      { text: "Lorem ipsum dolor sit amet consectetuer.", checked: false },
    ],
  },
  {
    title: "Chapter 2: What is Logo Designing?",
    isCheckedList: true,
    content: "Content for logo designing...",
  },
  {
    title: "Chapter 3: What is Poster Designing?",
    isCheckedList: false,
    content: "Content for poster designing...",
  },
  {
    title: "Chapter 4: What is Picture Editing?",
    isCheckedList: false,
    content: "Content for picture editing...",
  },
  {
    title: "Chapter 5: What is Picture Editing?",
    isCheckedList: false,
    content: "Content for picture editing...",
  },
  {
    title: "Chapter 6: What is Picture Editing?",
    isCheckedList: false,
    content: "Content for picture editing...",
  },
  {
    title: "Chapter 7: What is Picture Editing?",
    isCheckedList: false,
    content: "Content for picture editing...",
  },
  {
    title: "Chapter 8: What is Picture Editing?",
    isCheckedList: false,
    content: "Content for picture editing...",
  },
  {
    title: "Chapter 9: What is Picture Editing?",
    isCheckedList: false,
    content: "Content for picture editing...",
  },
  {
    title: "Chapter 10: What is Picture Editing?",
    isCheckedList: false,
    content: "Content for picture editing...",
  },
];
