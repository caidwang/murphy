import { app } from 'electron';
import path from 'path';
import Database from 'better-sqlite3';

let _db: import("better-sqlite3").Database | null = null;

// The database will be stored in the app's user data directory.
const dbPath = path.join(app.getPath('userData'), 'murphy.db');

/**
 * Initializes the database and creates tables if they don't exist.
 * This function should be called once at application startup.
 * @returns The initialized database instance.
 */
export function initializeDatabase(): import("better-sqlite3").Database {
  if (_db) {
    return _db; // Already initialized
  }

  _db = new Database(dbPath, { verbose: console.log });

  // Use a transaction to ensure all schema setup is atomic.
  const initStmt = _db.transaction(() => {
    // Create classrooms table
    _db!.prepare(`
      CREATE TABLE IF NOT EXISTS classrooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        background_image_path TEXT,
        theme_color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // Create students table
    _db!.prepare(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        student_number TEXT NOT NULL,
        avatar_path TEXT,
        classroom_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (classroom_id) REFERENCES classrooms (id) ON DELETE SET NULL,
        UNIQUE (classroom_id, student_number)
      )
    `).run();
  });

  initStmt();
  console.log('Database initialized successfully.');
  return _db;
}

/**
 * Returns the initialized database instance.
 * Throws an error if the database has not been initialized yet.
 */
export function getDb(): import("better-sqlite3").Database {
  if (!_db) {
    throw new Error('Database has not been initialized. Call initializeDatabase() first.');
  }
  return _db;
}