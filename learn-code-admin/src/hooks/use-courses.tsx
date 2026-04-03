import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useGetAllCoursesMutation } from "../lib/apis/course-apis";
import { type Course } from "../lib/mock-data";

interface CoursesContextType {
  courses: Course[];
  getCourse: (id: string) => Course | undefined;
  createCourse: (data: Omit<Course, "id" | "subscribers" | "rating">) => Course;
  updateCourse: (id: string, data: Partial<Omit<Course, "id">>) => void;
  deleteCourse: (id: string) => void;
}

const CoursesContext = createContext<CoursesContextType | null>(null);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [getAllCourses, { data }] = useGetAllCoursesMutation();

  useEffect(() => {
    getAllCourses(null);
  }, []);

  const getCourse = (id: string) => data?.data?.find((c: any) => c._id === id);

  const createCourse = (
    data: Omit<Course, "id" | "subscribers" | "rating">,
  ): Course => {
    const newCourse: Course = {
      ...data,
      id: Date.now().toString(),
      subscribers: 0,
      rating: 0,
    };
    // setCourses((prev) => [...prev, newCourse]);
    return newCourse;
  };

  const updateCourse = (id: string, data: Partial<Omit<Course, "id">>) => {
    // setCourses((prev) =>
    //   prev.map((c) => (c.id === id ? { ...c, ...data } : c)),
    // );
  };

  const deleteCourse = (id: string) => {
    // setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CoursesContext.Provider
      value={{
        courses: data?.data?.map((course: any) => {
          return {
            ...course,
            id: course._id,
          };
        }),
        getCourse,
        createCourse,
        updateCourse,
        deleteCourse,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error("useCourses must be used within CoursesProvider");
  return ctx;
}
