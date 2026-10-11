export const convertSkillsToString = (skills: string[]) => {
  let concatenatedSkills = "";
  for (let skill of skills) {
    concatenatedSkills += `${skill} `;
  }
  return concatenatedSkills;
};

export const convertSkillsToArray = (skills: string) => {
  return skills.split(" ");
};

export const isAtLeast31DaysAgo = (dateInput: string) => {
  const inputDate: Date = new Date(dateInput);
  const now: Date = new Date();

  const diffInMs = now.getTime() - inputDate.getTime();
  const daysDiff = diffInMs / (1000 * 60 * 60 * 24);

  return daysDiff <= 31;
};

// export const syncRegisteredCourses = (
//   registeredCourses: any,
//   updatedAvailableCourses: any,
// ) => {
//   const updatedCoursesMap = new Map(
//     updatedAvailableCourses.map((course: any) => [
//       course._id.toString(),
//       course,
//     ]),
//   );

//   return registeredCourses.map((registeredCourse: any) => {
//     const updatedCourse = updatedCoursesMap.get(
//       registeredCourse._id.toString(),
//     );

//     // If an updated version exists, use it.
//     // Otherwise, retain the registered course.
//     return updatedCourse
//       ? { ...registeredCourse, ...updatedCourse }
//       : registeredCourse;
//   });
// };

export const syncRegisteredCourses = (
  registeredCourses: any,
  updatedAvailableCourses: any,
) => {
  const updatedCoursesMap = new Map(
    updatedAvailableCourses.map((course: any) => [
      course._id.toString(),
      course,
    ]),
  );

  return registeredCourses.map((registeredCourse: any) => {
    const updatedCourse = updatedCoursesMap.get(
      registeredCourse._id.toString(),
    );

    // Keep the registered course if no update is available
    if (!updatedCourse) {
      return registeredCourse;
    }

    // Capture completion status from registered subtopics
    const registeredTopicsMap = new Map();

    registeredCourse.contents?.forEach((topic: any) => {
      topic.subTopics?.forEach((subTopic: any) => {
        registeredTopicsMap.set(
          `${topic.mainTopic}::${subTopic.title}`,
          subTopic.isCompleted,
        );
      });
    });

    // Sync latest course data and restore completion status
    // @ts-ignore
    const syncedContents = updatedCourse.contents?.map((topic: any) => ({
      ...topic,
      subTopics: topic.subTopics?.map((subTopic: any) => {
        const key = `${topic.mainTopic}::${subTopic.title}`;

        return {
          ...subTopic,
          isCompleted: registeredTopicsMap.has(key)
            ? registeredTopicsMap.get(key)
            : false,
        };
      }),
    }));

    return {
      ...registeredCourse,
      ...updatedCourse,
      // @ts-ignore
      contents: syncedContents ?? updatedCourse.contents,
    };
  });
};
