import { createContext, useState } from "react";

interface CourseDetailsContextType {
  course: any;
  setCourse: (course: any) => void;
}

export const CourseDetailsContext = createContext<CourseDetailsContextType>({
  course: null,
  setCourse: (course: any) => {},
});

const CourseDetailsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [course, setCourse] = useState<any>(null);

  const value = {
    course,
    setCourse,
  };

  return (
    <CourseDetailsContext.Provider value={value}>
      {children}
    </CourseDetailsContext.Provider>
  );
};

export default CourseDetailsContextProvider;
