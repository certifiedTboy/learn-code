import { getDatabase } from "./db";

/**
 * Creates the user profile table if it doesn't exist.
 * The table has fields for id, phoneNumber, and roomId.
 */
export const createCourseTable = async () => {
  try {
    const db = await getDatabase();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS  new_course (
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
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS registered_course_new2 (
        _id TEXT PRIMARY KEY NOT NULL,
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
  try {
    const db = await getDatabase();

    // 🔥 Step 1: Delete all existing records
    await db.runAsync(`DELETE FROM new_course`);

    // 🔥 Step 2: Insert fresh record
    await db.runAsync(
      `
      INSERT INTO new_course (
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
};

/**
 * Gets a course by ID.
 */
export const getCourseById = async (_id: string) => {
  try {
    const db = await getDatabase();
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
      SELECT * FROM new_course WHERE _id = ?
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
    console.log("Error getting course:", error);
  }
};

/**
 * @function getAllCourse
 * @description Gets all courses from the database.
 */

export const getAllCourse = async () => {
  try {
    const db = await getDatabase();
    const rows = await db.getAllAsync(`
      SELECT * FROM new_course
    `);

    return rows.map((row: any) => ({
      ...row,
      contents: row.contents ? JSON.parse(row.contents) : null,
      skills: row.skills ? JSON.parse(row.skills) : [], // Parse skills JSON string into an array
      image: row.course_image,
    }));
  } catch (error) {
    console.log("Error getting courses:", error);
  }
};

/**
 * Inserts or updates a user profile in the user_profile table.
 */
export const upsertRegisteredCourse = async (course: {
  _id: string;
  dateRegistered: string;
  completion: string;
}) => {
  try {
    const db = await getDatabase();

    await db.runAsync(
      `
      INSERT INTO registered_course_new2 (
        _id,
       dateRegistered,
       completion
      )
      VALUES (?, ?, ?)
      ON CONFLICT(_id) DO UPDATE SET
        dateRegistered = excluded.dateRegistered,
        completion = excluded.completion
      `,
      [course._id, course.dateRegistered, course.completion],
    );

    console.log("Registered Course upserted:", course._id);
  } catch (error) {
    console.log("Error upserting registered course:", error);
  }
};

/**
 * get all registered courses
 */
export const getAllRegisteredCourse = async () => {
  try {
    const db = await getDatabase();

    const allCourserows = await db.getAllAsync(`
      SELECT * FROM new_course
    `);

    const registeredCourserows = await db.getAllAsync(`
      SELECT * FROM registered_course_new2
    `);

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
  } catch (error) {
    console.log("Error getting courses:", error);
  }
};
