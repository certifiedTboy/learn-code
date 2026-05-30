import {
  getRegisteredCourseById,
  markSubTopicAsCompleted,
} from "@/helpers/db/course-db";
import { createContext, useContext, useState } from "react";

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
    const result = await markSubTopicAsCompleted(courseId, topicId, subTopicId);

    // trigger certificate issue if completion percentage is 100%

    // set the updated registered course in state to trigger re-render and update progress UI
  };

  const onGetRegisteredCourseById = async (id: string) => {
    const course = await getRegisteredCourseById(id);
    setRegisteredCourse(course);
  };

  const value = {
    registeredCourses,
    setRegisteredCourses,
    registeredCourse,
    markTopicAsCompleted,
    onGetRegisteredCourseById,
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
