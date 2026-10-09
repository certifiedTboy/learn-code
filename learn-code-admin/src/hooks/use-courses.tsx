import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useSelector } from "react-redux";
import { useGetAllCoursesMutation } from "../lib/apis/course-apis";
import { type Course } from "../lib/mock-data";
import type { RootState } from "../redux/store/store";
import { getAllRegisteredCourse } from "@/helpers/course-database";

interface CoursesContextType {
  courses: Course[];
  registeredCourses: Course[];
  getCourse: (id: string) => Course | undefined;
  updateCourse: (id: string, data: Partial<Omit<Course, "id">>) => void;
  deleteCourse: (id: string) => void;
  getRegisteredCourse: (id: string) => Course | undefined;
}

const CoursesContext = createContext<CoursesContextType | null>(null);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [getAllCourses, { data, isSuccess }] = useGetAllCoursesMutation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);

  const { currentUser, isAuthenticated } = useSelector(
    (state: RootState) => state.authState,
  );

  useEffect(() => {
    getAllCourses(null);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setCourses(
        (data?.data ?? []).map((course: any) => ({
          ...course,
          id: course._id,
        })),
      );
    }
  }, [data, isSuccess]);

  useEffect(() => {
    (async () => {
      if (!isAuthenticated || !currentUser || !data?.data) {
        setRegisteredCourses([]);
        return;
      }

      const registered = await getAllRegisteredCourse();

      if (registered) {
        const normalizedRegisteredCourses = (registered as any[]).map(
          (course: any) => ({
            ...course,
            id: course.id ?? course._id,
            contents: Array.isArray(course.contents) ? course.contents : [],
          }),
        ) as Course[];

        setRegisteredCourses(normalizedRegisteredCourses);
      }
    })();
  }, [currentUser, isAuthenticated, data]);

  const getCourse = (id: string) => courses.find((course) => course.id === id);

  const getRegisteredCourse = (id: string) =>
    registeredCourses.find((course) => course.id === id);

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
        registeredCourses,
        getRegisteredCourse,
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
