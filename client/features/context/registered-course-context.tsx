import {
  getAllRegisteredCourse,
  getRegisteredCourseById,
  markSubTopicAsCompleted,
} from "@/helpers/db/course-db";
import { createContext, useContext, useEffect, useState } from "react";

interface RegisteredCourseContextType {
  registeredCourses: any[];
  registeredCourse: any;
  setRegisteredCourses: (courses: any[]) => void;
  markTopicAsCompleted: (
    courseId: string,
    topicId: string,
    subTopicId: string,
  ) => Promise<void>;

  onGetRegisteredCourseById: (id: string) => Promise<any>;
  onGetAllRegisteredCourses: () => Promise<void>;
}

const RegisteredCourseContext = createContext<RegisteredCourseContextType>({
  registeredCourses: [],
  registeredCourse: null,
  setRegisteredCourses: (courses: any[]) => {},
  markTopicAsCompleted: async (
    courseId: string,
    topicId: string,
    subTopicId: string,
  ) => {},
  onGetRegisteredCourseById: async (id: string) => {},
  onGetAllRegisteredCourses: async () => {},
});

const RegisteredCourseContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [registeredCourses, setRegisteredCourses] = useState<any[]>([]);
  const [registeredCourse, setRegisteredCourse] = useState<any>(null);

  const markTopicAsCompleted = async (
    courseId: string,
    topicId: string,
    subTopicId: string,
  ) => {
    await markSubTopicAsCompleted(courseId, topicId, subTopicId);
    await onGetAllRegisteredCourses();
    await onGetRegisteredCourseById(courseId);
  };

  const onGetRegisteredCourseById = async (id: string) => {
    const course = await getRegisteredCourseById(id);

    setRegisteredCourse(course);
  };

  const onGetAllRegisteredCourses = async () => {
    const courses = await getAllRegisteredCourse();

    if (courses) {
      setRegisteredCourses(courses);
    }
  };

  useEffect(() => {
    (async () => {
      await onGetAllRegisteredCourses();
    })();
  }, []);

  const value = {
    registeredCourses,
    setRegisteredCourses,
    registeredCourse,
    markTopicAsCompleted,
    onGetRegisteredCourseById,
    onGetAllRegisteredCourses,
  };

  return (
    <RegisteredCourseContext.Provider value={value}>
      {children}
    </RegisteredCourseContext.Provider>
  );
};

export default RegisteredCourseContextProvider;

export const useRegisteredCourseContext = () => {
  return useContext(RegisteredCourseContext);
};
