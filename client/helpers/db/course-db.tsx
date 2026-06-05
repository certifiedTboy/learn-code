import { getDatabase, runWithLock } from "./db";

/**
 * Creates the user profile table if it doesn't exist.
 * The table has fields for id, phoneNumber, and roomId.
 */
export const createCourseTable = async () => {
  try {
    const db = await getDatabase();

    if (!db) {
      console.log("Database not ready");
      return null;
    }

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS  courses (
        _id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        description TEXT DEFAULT NULL,
        price TEXT NOT NULL,
        rating TEXT DEFAULT NULL,
        requiredDuration INTEGER DEFAULT NULL,
        totalTopics INTEGER DEFAULT NULL,
        course_image TEXT DEFAULT NULL,
        completed INTEGER DEFAULT 0,
        subscribers INTEGER DEFAULT 0,
        contents TEXT, -- JSON string
        skills TEXT, -- JSON string
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    console.log("Course table created");
  } catch (error) {
    console.log("Error creating table:", error);
  }
};

/**
 * create a table for registered courses
 */
export const createRegisteredCourseTable = async () => {
  try {
    const db = await getDatabase();

    if (!db) {
      console.log("Database not ready");
      return null;
    }

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS registered_courses (
        _id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        description TEXT DEFAULT NULL,
        price TEXT NOT NULL,
        rating TEXT DEFAULT NULL,
        requiredDuration INTEGER DEFAULT NULL,
        totalTopics INTEGER DEFAULT NULL,
        course_image TEXT DEFAULT NULL,
        completed INTEGER DEFAULT 0,
        subscribers INTEGER DEFAULT 0,
        contents TEXT, -- JSON string,
        skills TEXT, -- JSON string,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        dateRegistered TEXT NOT NULL,
        completion TEXT NOT NULL
      );
    `);

    console.log("Registered Course table created");
  } catch (error) {
    console.log("Error creating table:", error);
  }
};

/**
 * Inserts or updates a user profile in the user_profile table.
 */
export const upsertCourse = async (course: {
  _id: string;
  name: string;
  description: string;
  price: string;
  rating: string;
  completed: boolean;
  subscribers: number;
  totalTopics: number;
  requiredDuration: number;
  contents: any;
  createdAt: string;
  updatedAt: string;
  skills: string[];
  image: string;
}) => {
  return runWithLock(async () => {
    try {
      const db = await getDatabase();

      if (!db) {
        console.log("Database not ready");
        return null;
      }

      // 🔥 Step 1: Delete all existing records
      await db.runAsync(`DELETE FROM courses`);

      // 🔥 Step 2: Insert fresh record
      await db.runAsync(
        `
      INSERT INTO courses (
        _id,
        name,
        description,
        price,
        rating,
        completed,
        subscribers,
        totalTopics,
        requiredDuration,
        contents,
        createdAt,
        updatedAt,
        skills,
        course_image
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          course._id,
          course.name,
          course.description,
          course.price,
          course.rating,
          course.completed,
          course.subscribers,
          course.totalTopics,
          course.requiredDuration,
          JSON.stringify(course.contents),
          course.createdAt,
          course.updatedAt,
          JSON.stringify(course.skills),
          course.image,
        ],
      );

      console.log("Course replaced:", course.name);
    } catch (error) {
      console.log("Error replacing course:", error);
    }
  });
};

/**
 * Gets a course by ID.
 */
export const getCourseById = async (_id: string) => {
  try {
    const db = await getDatabase();

    if (!db) {
      console.log("Database not ready");
      return null;
    }

    const row: {
      _id: string;
      name: string;
      description: string;
      price: string;
      rating: string;
      completed: boolean;
      subscribers: number;
      totalTopics: number;
      requiredDuration: number;
      contents: any; // JSON object
      createdAt: string;
      updatedAt: string;
      skills: string; // JSON array
      course_image: string;
    } | null = await db.getFirstAsync(
      `
      SELECT * FROM courses WHERE _id = ?
    `,
      [_id],
    );

    if (!row) {
      return null;
    }

    return {
      ...row,
      contents: row.contents ? JSON.parse(row.contents) : null,
      skills: row.skills ? JSON.parse(row.skills) : [], // Parse skills JSON string into an array
      image: row.course_image,
    };
  } catch (error) {
    console.log("Error getting course by id:", error);
  }
};

/**
 * @function getAllCourse
 * @description Gets all courses from the database.
 */

export const getAllCourse = async () => {
  console.log("Fetching all courses...");
  try {
    const db = await getDatabase();

    if (!db) {
      console.log("Database not ready");
      return null;
    }

    const rows = await db.getAllAsync(`
      SELECT * FROM courses
    `);

    return rows.map((row: any) => ({
      ...row,
      contents: row.contents ? JSON.parse(row.contents) : null,
      skills: row.skills ? JSON.parse(row.skills) : [], // Parse skills JSON string into an array
      image: row.course_image,
    }));
  } catch (error) {
    console.log("Error getting all courses:", error);
  }
};

export const upsertRegisteredCourse = async (course: {
  _id: string;
  name: string;
  description: string;
  price: string;
  rating: string;
  completed: boolean;
  subscribers: number;
  totalTopics: number;
  requiredDuration: number;
  contents: any;
  createdAt: string;
  updatedAt: string;
  skills: string[];
  image: string;
  dateRegistered: string;
  completion: string;
}) => {
  return runWithLock(async () => {
    try {
      const db = await getDatabase();

      if (!db) {
        console.log("Database not ready");
        return null;
      }

      await db.runAsync("BEGIN TRANSACTION");

      // 🔥 Step 2: Insert fresh record
      await db.runAsync(
        `
      INSERT OR REPLACE INTO registered_courses (
        _id,
        name,
        description,
        price,
        rating,
        completed,
        subscribers,
        totalTopics,
        requiredDuration,
        contents,
        createdAt,
        updatedAt,
        skills,
        course_image,
        dateRegistered,
        completion
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          course._id,
          course.name,
          course.description,
          course.price,
          course.rating,
          course.completed,
          course.subscribers,
          course.totalTopics,
          course.requiredDuration,
          JSON.stringify(course.contents),
          course.createdAt,
          course.updatedAt,
          JSON.stringify(course.skills),
          course.image,
          course.dateRegistered,
          course.completion,
        ],
      );

      await db.runAsync("COMMIT");

      console.log("Registered Course upserted:", course._id);
    } catch (error) {
      console.log("Error replacing course:", error);
    }
  });
};

/**
 * get all registered courses
 */
export const getAllRegisteredCourse = async () => {
  console.log("Fetching all registered courses...");
  try {
    const db = await getDatabase();

    if (db) {
      const allCourserows = await db.getAllAsync(`SELECT * FROM courses`);

      if (allCourserows && allCourserows.length > 0) {
        const registeredCourserows = await db.getAllAsync(
          `SELECT * FROM registered_courses`,
        );

        return registeredCourserows.map((course: any) => {
          const matchedCourse = allCourserows.find(
            (newCourse: any) => newCourse?._id === course._id,
          );

          if (matchedCourse) {
            return {
              ...matchedCourse,
              completion: course?.completion,
              dateRegistered: course?.dateRegistered,
            };
          }

          return []; // or course, depending on your use case
        });
      } else {
        return [];
      }
    }
  } catch (error) {
    console.log("Error getting registered courses:", error);
  }
};

/**
 * @description get registered course by id
 */
export const getRegisteredCourseById = async (_id: string) => {
  try {
    const db = await getDatabase();

    if (!db) {
      console.log("Database not ready");
      return null;
    }
    const row: {
      _id: string;
      name: string;
      description: string;
      price: string;
      rating: string;
      completed: boolean;
      subscribers: number;
      totalTopics: number;
      requiredDuration: number;
      contents: any; // JSON object
      createdAt: string;
      updatedAt: string;
      skills: string; // JSON array
      course_image: string;
      dateRegistered: string;
      completion: string;
    } | null = await db.getFirstAsync(
      `
      SELECT * FROM registered_courses WHERE _id = ?
    `,
      [_id],
    );

    if (!row) {
      return null;
    }

    return {
      ...row,
      contents: row.contents ? JSON.parse(row.contents) : null,
      skills: row.skills ? JSON.parse(row.skills) : [], // Parse skills JSON string into an array
      image: row.course_image,
      dateRegistered: row.dateRegistered,
      completion: row.completion,
    };
  } catch (error) {
    console.log("Error getting registered course by id:", error);
  }
};

export const markSubTopicAsCompleted = async (
  courseId: string,
  mainTopic: string,
  subTopicTitle: string,
) => {
  return runWithLock(async () => {
    try {
      const db = await getDatabase();

      if (!db) {
        console.log("Database not ready");
        return null;
      }

      if (!courseId || !mainTopic || !subTopicTitle) {
        console.log("Missing required parameters");
        return null;
      }

      const course = await getRegisteredCourseById(courseId);

      if (!course) {
        console.log("Course not found");
        return null;
      }

      const contents =
        typeof course.contents === "string"
          ? JSON.parse(course.contents)
          : course.contents;

      let totalSubTopics = 0;
      let completedSubTopics = 0;
      let foundSubTopic = false;

      const updatedContents = contents.map((chapter: any) => {
        const updatedSubTopics = chapter.subTopics.map((sub: any) => {
          const isTargetSubTopic =
            chapter.mainTopic === mainTopic && sub.title === subTopicTitle;

          const isCompleted = isTargetSubTopic
            ? true
            : Boolean(sub.isCompleted);

          if (isTargetSubTopic) {
            foundSubTopic = true;
          }

          totalSubTopics += 1;

          if (isCompleted) {
            completedSubTopics += 1;
          }

          return {
            ...sub,
            isCompleted,
          };
        });

        return {
          ...chapter,
          subTopics: updatedSubTopics,
        };
      });

      if (!foundSubTopic) {
        console.log("Subtopic not found");
        return null;
      }

      const completionPercentage =
        totalSubTopics > 0
          ? Math.round((completedSubTopics / totalSubTopics) * 100)
          : 0;

      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `
        UPDATE courses
        SET contents = ?
        WHERE _id = ?
        `,
          [JSON.stringify(updatedContents), courseId],
        );

        await db.runAsync(
          `
        UPDATE registered_courses
        SET contents = ?, completion = ?
        WHERE _id = ?
        `,
          [
            JSON.stringify(updatedContents),
            `${completionPercentage}%`,
            courseId,
          ],
        );
      });
    } catch (error) {
      console.log("Error marking subtopic as completed:", error);
      return null;
    }
  });

  // const updatedCourse = await getRegisteredCourseById(courseId);

  // return updatedCourse;
};

export const deleteAllRegisteredCourses = async () => {
  try {
    const db = await getDatabase();

    await db.runAsync(`
      DELETE FROM registered_courses
    `);

    console.log("All registered courses deleted successfully");
  } catch (error) {
    console.log("Error deleting registered courses:", error);
  }
};

export const deleteAllCourse = async () => {
  try {
    const db = await getDatabase();

    await db.runAsync(`DELETE FROM courses`);

    console.log("All courses deleted successfully");
  } catch (error) {
    console.log("error deleting courses:", error);
  }
};
