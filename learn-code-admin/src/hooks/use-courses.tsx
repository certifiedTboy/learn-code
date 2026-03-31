import { createContext, useContext, useState, type ReactNode } from "react";
import { INITIAL_COURSES, type Course } from "../lib/mock-data";

interface CoursesContextType {
  courses: Course[];
  getCourse: (id: string) => Course | undefined;
  createCourse: (data: Omit<Course, "id" | "subscribers" | "rating">) => Course;
  updateCourse: (id: string, data: Partial<Omit<Course, "id">>) => void;
  deleteCourse: (id: string) => void;
}

const CoursesContext = createContext<CoursesContextType | null>(null);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);

  const getCourse = (id: string) => courses.find((c) => c.id === id);

  const createCourse = (
    data: Omit<Course, "id" | "subscribers" | "rating">,
  ): Course => {
    const newCourse: Course = {
      ...data,
      id: Date.now().toString(),
      subscribers: 0,
      rating: 0,
    };
    setCourses((prev) => [...prev, newCourse]);
    return newCourse;
  };

  const updateCourse = (id: string, data: Partial<Omit<Course, "id">>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c)),
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CoursesContext.Provider
      value={{ courses, getCourse, createCourse, updateCourse, deleteCourse }}
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
