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
import {
  getAllRegisteredCourse,
  upsertCourse,
} from "@/helpers/course-database";
import { markSubTopicAsCompleted } from "@/helpers/course-database";
import { checkIfPaymentIsExpired } from "@/helpers/payment";

interface CoursesContextType {
  courses: Course[];
  registeredCourses: Course[];
  getCourse: (id: string) => Course | undefined;
  updateCourse: (id: string, data: Partial<Omit<Course, "id">>) => void;
  deleteCourse: (id: string) => void;
  getRegisteredCourse: (id: string) => Course | undefined;
  markTopicAsCompleted: (
    courseId: string,
    topicId: string,
    subTopicId: string,
  ) => void;
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

      (async () => {
        if (data && data?.data) {
          for (let course of data?.data) {
            await upsertCourse(course);
          }
        }
      })();
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
            isExpired: checkIfPaymentIsExpired(course?.dateRegistered),
            contents: course.contents,
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

  async function markTopicAsCompleted(
    courseId: string,
    topicId: string,
    subTopicId: string,
  ) {
    await markSubTopicAsCompleted(courseId, topicId, subTopicId);
  }

  return (
    <CoursesContext.Provider
      value={{
        courses,
        getCourse,
        updateCourse,
        deleteCourse,
        registeredCourses,
        getRegisteredCourse,
        markTopicAsCompleted,
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
