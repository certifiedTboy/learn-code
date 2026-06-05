import * as SQLite from "expo-sqlite";

let dbInstance: SQLite.SQLiteDatabase | null = null;
let dbLock = false;

export const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("app_db", {
      useNewConnection: true,
    });
    await dbInstance.execAsync(`PRAGMA journal_mode = WAL`);
    await dbInstance.execAsync(`PRAGMA foreign_keys = ON`);
  }
  return dbInstance;
};

export const runWithLock = async (fn: () => Promise<any>) => {
  while (dbLock) {
    await new Promise((res) => setTimeout(res, 50));
  }
  dbLock = true;
  try {
    return await fn();
  } finally {
    dbLock = false;
  }
};
