import initSqlJs, { type Database } from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import type { CourseContent, SubTopic } from "@/lib/mock-data";

type CourseContentWithProgress = Omit<CourseContent, "subTopics"> & {
  subTopics: Array<SubTopic & { isCompleted?: boolean }>;
};

export interface CourseDatabaseInput {
  _id: string;
  id?: string;
  name: string;
  description?: string | null;
  price?: string | number;
  rating?: string | number | null;
  completed?: boolean;
  subscribers?: number;
  totalTopics?: number;
  requiredDuration?: number;
  contents?: CourseContentWithProgress[] | string | null;
  createdAt?: string;
  updatedAt?: string;
  skills?: string[] | string;
  image?: string | null;
}

export interface StoredCourse {
  _id: string;
  name: string;
  description: string;
  price: string;
  rating: string;
  completed: boolean;
  subscribers: number;
  totalTopics: number;
  requiredDuration: number;
  contents: CourseContentWithProgress[] | null;
  createdAt: string;
  updatedAt: string;
  skills: string[];
  image: string;
  dateRegistered?: string;
  completion?: string;
}

export interface RegisteredCourseInput extends CourseDatabaseInput {
  dateRegistered?: string;
  completion?: string;
}

const STORAGE_DATABASE = "learn-code-course-database";
const STORAGE_OBJECT_STORE = "databases";
const STORAGE_KEY = "courses";

type SqlRow = Record<string, string | number | Uint8Array | null>;
type SqlParameter = string | number | Uint8Array | null;

let databasePromise: Promise<Database> | undefined;
let storagePromise: Promise<IDBDatabase> | undefined;
let operationQueue: Promise<void> = Promise.resolve();

const openStorage = (): Promise<IDBDatabase> => {
  if (!storagePromise) {
    storagePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(STORAGE_DATABASE, 1);

      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORAGE_OBJECT_STORE);
      };
      request.onsuccess = () => {
        request.result.onversionchange = () => request.result.close();
        resolve(request.result);
      };
      request.onerror = () => {
        storagePromise = undefined;
        reject(
          request.error ?? new Error("Unable to open course database storage."),
        );
      };
    });
  }

  return storagePromise;
};

const loadDatabaseBytes = async (): Promise<Uint8Array | undefined> => {
  const storage = await openStorage();

  return new Promise((resolve, reject) => {
    const transaction = storage.transaction(STORAGE_OBJECT_STORE, "readonly");
    const request = transaction
      .objectStore(STORAGE_OBJECT_STORE)
      .get(STORAGE_KEY);

    request.onsuccess = () => {
      const bytes: unknown = request.result;
      if (bytes === undefined) {
        resolve(undefined);
      } else if (bytes instanceof Uint8Array) {
        resolve(bytes);
      } else {
        reject(new Error("Stored course database has an invalid format."));
      }
    };
    request.onerror = () => {
      reject(request.error ?? new Error("Unable to read the course database."));
    };
  });
};

const saveDatabase = async (database: Database): Promise<void> => {
  const storage = await openStorage();
  const transaction = storage.transaction(STORAGE_OBJECT_STORE, "readwrite");
  transaction
    .objectStore(STORAGE_OBJECT_STORE)
    .put(database.export(), STORAGE_KEY);

  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => {
      reject(
        transaction.error ?? new Error("Unable to save the course database."),
      );
    };
    transaction.onabort = () => {
      reject(
        transaction.error ??
          new Error("Saving the course database was aborted."),
      );
    };
  });
};

const createTables = (database: Database): void => {
  database.run(`
    CREATE TABLE IF NOT EXISTS courses (
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
      contents TEXT,
      skills TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
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
      contents TEXT,
      skills TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      dateRegistered TEXT NOT NULL,
      completion TEXT NOT NULL
    );
  `);
};

const initializeDatabase = async (): Promise<Database> => {
  const [SQL, bytes] = await Promise.all([
    initSqlJs({ locateFile: () => wasmUrl }),
    loadDatabaseBytes(),
  ]);
  const database = new SQL.Database(bytes);
  createTables(database);
  await saveDatabase(database);
  return database;
};

const getDatabase = (): Promise<Database> => {
  if (!databasePromise) {
    const pending = initializeDatabase();
    databasePromise = pending;
    void pending.catch(() => {
      if (databasePromise === pending) {
        databasePromise = undefined;
      }
    });
  }

  return databasePromise;
};

const withDatabase = <T>(
  operation: (database: Database) => T,
  persist = false,
): Promise<T> => {
  const pending = operationQueue.then(async () => {
    const database = await getDatabase();
    const result = operation(database);
    if (persist) {
      await saveDatabase(database);
    }
    return result;
  });

  operationQueue = pending.then(
    () => undefined,
    () => undefined,
  );

  return pending;
};

const readRows = (
  database: Database,
  sql: string,
  params: SqlParameter[] = [],
): SqlRow[] => {
  const statement = database.prepare(sql);

  try {
    statement.bind(params);
    const rows: SqlRow[] = [];
    while (statement.step()) {
      rows.push(statement.getAsObject());
    }
    return rows;
  } finally {
    statement.free();
  }
};

const readFirstRow = (
  database: Database,
  sql: string,
  params: SqlParameter[] = [],
): SqlRow | null => readRows(database, sql, params)[0] ?? null;

const stringValue = (value: SqlRow[string], fallback = ""): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
};

const numberValue = (value: SqlRow[string]): number =>
  typeof value === "number" ? value : Number(value ?? 0);

const parseJsonArray = <T>(value: SqlRow[string], fallback: T[]): T[] => {
  if (typeof value !== "string" || value.length === 0) return fallback;
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) {
    throw new Error("Course database contains invalid JSON array data.");
  }
  return parsed as T[];
};

const mapCourseRow = (row: SqlRow): StoredCourse => ({
  _id: stringValue(row._id),
  name: stringValue(row.name),
  description: stringValue(row.description),
  price: stringValue(row.price, "0"),
  rating: stringValue(row.rating, "0"),
  completed: numberValue(row.completed) !== 0,
  subscribers: numberValue(row.subscribers),
  totalTopics: numberValue(row.totalTopics),
  requiredDuration: numberValue(row.requiredDuration),
  contents:
    typeof row.contents === "string" && row.contents.length > 0
      ? parseJsonArray<CourseContentWithProgress>(row.contents, [])
      : null,
  createdAt: stringValue(row.createdAt),
  updatedAt: stringValue(row.updatedAt),
  skills: parseJsonArray<string>(row.skills, []),
  image: stringValue(row.course_image),
});

const mapRegisteredCourseRow = (row: SqlRow): StoredCourse => ({
  ...mapCourseRow(row),
  dateRegistered: stringValue(row.dateRegistered),
  completion: stringValue(row.completion, "0"),
});

const jsonValue = (value: unknown, fallback: unknown): string =>
  typeof value === "string" ? value : JSON.stringify(value ?? fallback);

const courseValues = (course: CourseDatabaseInput) => [
  course._id,
  course.name,
  course.description ?? "",
  course.price ?? "0",
  course.rating ?? "0",
  course.completed ? 1 : 0,
  course.subscribers ?? 0,
  course.totalTopics ?? 0,
  course.requiredDuration ?? 0,
  jsonValue(course.contents, []),
  course.createdAt ?? "",
  course.updatedAt ?? "",
  jsonValue(course.skills, []),
  course.image ?? "",
];

export const createCourseTable = async (): Promise<void> => {
  await getDatabase();
};

export const createRegisteredCourseTable = async (): Promise<void> => {
  await getDatabase();
};

export const upsertCourse = async (
  course: CourseDatabaseInput,
): Promise<boolean> => {
  if (!course._id) throw new Error("Course ID is required.");

  return withDatabase((database) => {
    database.run(
      `INSERT INTO courses (
          _id, name, description, price, rating, completed, subscribers,
          totalTopics, requiredDuration, contents, createdAt, updatedAt,
          skills, course_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          createdAt = excluded.createdAt,
          updatedAt = excluded.updatedAt,
          skills = excluded.skills,
          course_image = excluded.course_image`,
      courseValues(course),
    );
    return true;
  }, true);
};

export const getCourseById = async (
  _id: string,
): Promise<StoredCourse | null> =>
  withDatabase((database) => {
    const row = readFirstRow(database, "SELECT * FROM courses WHERE _id = ?", [
      _id,
    ]);
    return row ? mapCourseRow(row) : null;
  });

export const getAllCourse = async (): Promise<StoredCourse[]> =>
  withDatabase((database) =>
    readRows(database, "SELECT * FROM courses").map(mapCourseRow),
  );

export const upsertRegisteredCourse = async (
  course: RegisteredCourseInput,
): Promise<boolean> => {
  if (!course._id) throw new Error("Registered course ID is required.");

  return withDatabase((database) => {
    database.run(
      `INSERT INTO registered_courses (
          _id, name, description, price, rating, completed, subscribers,
          totalTopics, requiredDuration, contents, createdAt, updatedAt,
          skills, course_image, dateRegistered, completion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          createdAt = excluded.createdAt,
          updatedAt = excluded.updatedAt,
          skills = excluded.skills,
          course_image = excluded.course_image,
          dateRegistered = excluded.dateRegistered,
          completion = excluded.completion`,
      [
        ...courseValues(course),
        course.dateRegistered ?? new Date().toISOString(),
        course.completion ?? "0",
      ],
    );
    return true;
  }, true);
};

export const getAllRegisteredCourse = async (): Promise<StoredCourse[]> =>
  withDatabase((database) =>
    readRows(database, "SELECT * FROM registered_courses").map(
      mapRegisteredCourseRow,
    ),
  );

export const getRegisteredCourseById = async (
  _id: string,
): Promise<StoredCourse | null> =>
  withDatabase((database) => {
    const row = readFirstRow(
      database,
      "SELECT * FROM registered_courses WHERE _id = ?",
      [_id],
    );
    return row ? mapRegisteredCourseRow(row) : null;
  });

export const markSubTopicAsCompleted = async (
  courseId: string,
  mainTopic: string,
  subTopicTitle: string,
): Promise<{
  success: true;
  completion: string;
  contents: CourseContentWithProgress[];
} | null> => {
  if (!courseId || !mainTopic || !subTopicTitle) {
    throw new Error("Course ID, main topic, and subtopic title are required.");
  }

  return withDatabase(async (database) => {
    const row = readFirstRow(
      database,
      "SELECT * FROM registered_courses WHERE _id = ?",
      [courseId],
    );
    if (!row) return null;

    const course = mapRegisteredCourseRow(row);
    const contents = course.contents;
    if (!contents) {
      throw new Error("Registered course has invalid contents.");
    }

    let totalSubTopics = 0;
    let completedSubTopics = 0;
    let foundSubTopic = false;

    const updatedContents = contents.map((chapter) => {
      const subTopics = Array.isArray(chapter.subTopics)
        ? chapter.subTopics
        : [];
      const updatedSubTopics = subTopics.map((subTopic) => {
        const isTarget =
          chapter.mainTopic === mainTopic && subTopic.title === subTopicTitle;
        const isCompleted = isTarget || Boolean(subTopic.isCompleted);

        if (isTarget) foundSubTopic = true;
        totalSubTopics += 1;
        if (isCompleted) completedSubTopics += 1;

        return { ...subTopic, isCompleted };
      });

      return { ...chapter, subTopics: updatedSubTopics };
    });

    if (!foundSubTopic) return null;

    const completionPercentage =
      totalSubTopics > 0
        ? Math.round((completedSubTopics / totalSubTopics) * 100)
        : 0;
    const completion = `${completionPercentage}%`;

    database.run(
      "UPDATE registered_courses SET contents = ?, completion = ? WHERE _id = ?",
      [JSON.stringify(updatedContents), completion, courseId],
    );
    await saveDatabase(database);

    console.log("course updated!");
    return { success: true, completion, contents: updatedContents };
  }, false);
};

export const deleteAllRegisteredCourses = async (): Promise<void> => {
  await withDatabase(
    (database) => database.run("DELETE FROM registered_courses"),
    true,
  );
};

export const deleteAllCourse = async (): Promise<void> => {
  await withDatabase((database) => database.run("DELETE FROM courses"), true);
};
