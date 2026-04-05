import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useGetAllCoursesMutation } from "../lib/apis/course-apis";
import { type Course } from "../lib/mock-data";

interface CoursesContextType {
  courses: Course[];
  getCourse: (id: string) => Course | undefined;
  updateCourse: (id: string, data: Partial<Omit<Course, "id">>) => void;
  deleteCourse: (id: string) => void;
}

const CoursesContext = createContext<CoursesContextType | null>(null);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [getAllCourses, { data, isSuccess }] = useGetAllCoursesMutation();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    getAllCourses(null);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setCourses(
        data?.data?.map((course: any) => {
          return {
            ...course,
            id: course._id,
          };
        }),
      );
    }
  }, [isSuccess]);

  const getCourse = (id: string) => data?.data?.find((c: any) => c._id === id);

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
      value={{
        courses,
        getCourse,
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
