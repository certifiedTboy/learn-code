import { User } from "../../features/context/auth-context";
import { getDatabase } from "./db";

/**
 * Creates the user profile table if it doesn't exist.
 * The table has fields for id, phoneNumber, and roomId.
 */
export const createUserProfileTable = async () => {
  try {
    const db = await getDatabase();

    if (!db) {
      console.log("Database not ready");
      return null;
    }

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_profile_db (
        _id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL,
        firstName TEXT DEFAULT NULL,
        lastName TEXT DEFAULT NULL,
        profilePicture TEXT DEFAULT NULL,
        isVerified INTEGER DEFAULT 0
      );
    `);

    console.log("User profile table created");
  } catch (error) {
    console.log("Error creating table:", error);
  }
};

/**
 * Inserts or updates a user profile in the user_profile table.
 */
export const upsertUserProfile = async (userProfile: User) => {
  try {
    const db = await getDatabase();

    if (!db) {
      console.log("Database not ready");
      return null;
    }

    await db.runAsync(
      `
      INSERT INTO user_profile_db (
        _id,
        email,
        firstName,
        lastName,
        profilePicture,
        isVerified
      )
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(_id) DO UPDATE SET
        email = excluded.email,
        firstName = COALESCE(excluded.firstName, user_profile_db.firstName),
        lastName = COALESCE(excluded.lastName, user_profile_db.lastName),
        profilePicture = excluded.profilePicture,
        isVerified = excluded.isVerified
      `,
      [
        userProfile._id,
        userProfile.email,
        userProfile.firstName || null,
        userProfile.lastName || null,
        userProfile.profilePicture || null,
        userProfile.isVerified ? 1 : 0,
      ],
    );

    console.log("User profile upserted successfully");
  } catch (error) {
    console.log("Error upserting user profile:", error);
  }
};

export const deleteUserProfile = async (_id: string) => {
  try {
    const db = await getDatabase();
    if (!db) {
      console.log("Database not ready");
      return null;
    }

    await db.runAsync(
      `
      DELETE FROM user_profile_db WHERE _id = ?
    `,
      [_id],
    );
    console.log("User profile deleted successfully");
  } catch (error) {
    console.log("Error deleting user profile:", error);
  }
};

export const getCurrentUserFromDb = async () => {
  try {
    const db = await getDatabase();
    if (!db) {
      console.log("Database not ready");
      return null;
    }

    const row = await db.getFirstAsync(
      `
      SELECT * FROM user_profile_db LIMIT 1
    `,
    );

    return row as User | null;
  } catch (error) {
    console.log("Error getting current user from db:", error);
    return null;
  }
};
