import { User } from "../../lib/context/auth-context";
import { getDatabase } from "./db";

/**
 * Creates the user profile table if it doesn't exist.
 * The table has fields for id, phoneNumber, and roomId.
 */
export const createUserProfileTable = async () => {
  try {
    const db = await getDatabase();
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
    await db.runAsync(
      `
      INSERT INTO user_profile_db (_id, email, firstName, lastName, profilePicture, isVerified)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(_id) DO UPDATE SET
        email = excluded.email,
        profilePicture = excluded.profilePicture,
        isVerified = excluded.isVerified
    `,
      [
        userProfile._id,
        userProfile.email,
        userProfile.firstName,
        userProfile.lastName,
        userProfile.profilePicture,
      ],
    );

    console.log("User profile upserted successfully");
  } catch (error) {
    console.log("Error upserting user profile:", error);
  }
};

/**
 * Gets a user profile by ID.
 */
export const getUserProfileById = async (_id: string) => {
  try {
    const db = await getDatabase();
    const row = await db.getFirstAsync(
      `
      SELECT * FROM user_profile_db WHERE _id = ?
    `,
      [_id],
    );
    return row as {
      _id: string;
      email: string;
      profilePicture: string;
      isVerified: number;
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
  _id: string,
  firstName: string,
  lastName: string,
  profilePicture: string,
) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `
      UPDATE user_profile_db SET firstName = ?, lastName = ?, profilePicture = ? WHERE _id = ?
    `,
      [firstName, lastName, profilePicture, _id],
    );
    console.log("User profile picture updated successfully");
  } catch (error) {
    console.log("Error updating user profile picture:", error);
  }
};

export const deleteUserProfile = async (_id: string) => {
  try {
    const db = await getDatabase();
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
