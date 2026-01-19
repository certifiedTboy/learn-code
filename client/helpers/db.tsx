import * as SQLite from "expo-sqlite";

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("code_db");
    await dbInstance.execAsync(`PRAGMA journal_mode = WAL`);
    await dbInstance.execAsync(`PRAGMA foreign_keys = ON`);
  }
  return dbInstance;
};

export const runWithLock = async (fn: () => Promise<void>) => {
  let dbLock = false;
  while (dbLock) {
    await new Promise((res) => setTimeout(res, 50));
  }
  dbLock = true;
  try {
    await fn();
  } finally {
    dbLock = false;
  }
};

/**
 * Creates the user profile table if it doesn't exist.
 * The table has fields for id, phoneNumber, and roomId.
 */
export const createUserProfileTable = async () => {
  try {
    const db = await getDatabase();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_profile (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL,
        profilePicture TEXT DEFAULT NULL
      );
    `);
  } catch (error) {
    console.log("Error creating table:", error);
  }
};

/**
 * Inserts or updates a user profile in the user_profile table.
 */
export const upsertUserProfile = async (userProfile: {
  id: string;
  email: string;
  profilePicture: string;
}) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `
      INSERT INTO user_profile (id, email, profilePicture)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        email = excluded.email,
        profilePicture = excluded.profilePicture
    `,
      [userProfile.id, userProfile.email, userProfile.profilePicture],
    );
  } catch (error) {
    console.log("Error upserting user profile:", error);
  }
};

/**
 * Gets a user profile by ID.
 */
export const getUserProfileById = async (email: string) => {
  try {
    const db = await getDatabase();
    const row = await db.getFirstAsync(
      `
      SELECT * FROM user_profile WHERE email = ?
    `,
      [email],
    );
    return row as {
      id: string;
      email: string;
      profilePicture: string;
    };
  } catch (error) {
    console.log("Error getting user profile:", error);
  }
};

/**
 * update user profile picture
 * @param email - The email of the user
 * @param profilePicture - The new profile picture URL
 */
export const updateUserProfilePicture = async (
  email: string,
  profilePicture: string,
) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `
      UPDATE user_profile SET profilePicture = ? WHERE email = ?
    `,
      [profilePicture, email],
    );
  } catch (error) {
    console.log("Error updating user profile picture:", error);
  }
};
