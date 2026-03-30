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
      ON CONFLICT(_id) DO UPDATE SET
        name = excluded.name,
        description = excluded.description,
        price = excluded.price,
        rating = excluded.rating,
        completed = excluded.completed,
        subscribers = excluded.subscribers,
        totalTopics = excluded.totalTopics,
        requiredDuration = excluded.requiredDuration,
        contents = excluded.contents,
        updatedAt = excluded.updatedAt,
        skills = excluded.skills,
        course_image = excluded.course_image
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

    console.log("Course upserted:", course.name);
  } catch (error) {
    console.log("Error upserting course:", error);
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
