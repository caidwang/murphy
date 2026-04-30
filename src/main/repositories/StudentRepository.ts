import { Student } from '../models/Student';
import { Statement } from 'better-sqlite3';

// Type for the data needed to create a new student
export type StudentCreationData = Omit<Student, 'id' | 'created_at'>;

// Type for the data needed to update an existing student
export type StudentUpdateData = Partial<Omit<Student, 'id' | 'created_at'>>;

export class StudentRepository {
  private db: import("better-sqlite3").Database;
  private findByIdStmt: Statement;
  private findByClassroomIdStmt: Statement;

  constructor(dbInstance: import("better-sqlite3").Database) {
    this.db = dbInstance;
    this.findByIdStmt = this.db.prepare('SELECT * FROM students WHERE id = ?');
    this.findByClassroomIdStmt = this.db.prepare('SELECT * FROM students WHERE classroom_id = ?');
  }

  /**
   * Creates a new student.
   * @param data The data for the new student.
   * @returns The ID of the newly created student.
   */
  create(data: StudentCreationData): number {
    const stmt = this.db.prepare(
      'INSERT INTO students (name, student_number, avatar_path, classroom_id) VALUES (@name, @student_number, @avatar_path, @classroom_id)'
    );
    const result = stmt.run(data);
    return result.lastInsertRowid as number;
  }

  /**
   * Updates an existing student.
   * @param id The ID of the student to update.
   * @param data The data to update.
   * @returns The number of changes made.
   */
  update(id: number, data: StudentUpdateData): number {
    const fields = Object.keys(data);
    const values = Object.values(data);

    if (fields.length === 0) {
      return 0;
    }

    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const stmt = this.db.prepare(`UPDATE students SET ${setClause} WHERE id = ?`);
    const result = stmt.run(...values, id);
    return result.changes;
  }

  /**
   * Deletes a student by their ID.
   * @param id The ID of the student to delete.
   * @returns The number of changes made.
   */
  delete(id: number): number {
    const stmt = this.db.prepare('DELETE FROM students WHERE id = ?');
    const result = stmt.run(id);
    return result.changes;
  }

  /**
   * Finds a student by their ID.
   * @param id The ID of the student to find.
   * @returns The student object or undefined if not found.
   */
  findById(id: number): Student | undefined {
    return this.findByIdStmt.get(id) as Student | undefined;
  }

  /**
   * Finds all students in a specific classroom.
   * @param classroomId The ID of the classroom.
   * @returns An array of students in that classroom.
   */
  findByClassroomId(classroomId: number): Student[] {
    return this.findByClassroomIdStmt.all(classroomId) as Student[];
  }

  /**
   * Inserts multiple students in a single transaction.
   * @param studentsData An array of student data to insert.
   */
  bulkInsert(studentsData: StudentCreationData[]): void {
    const insertStmt = this.db.prepare(
      'INSERT INTO students (name, student_number, avatar_path, classroom_id) VALUES (@name, @student_number, @avatar_path, @classroom_id)'
    );

    const insertMany = this.db.transaction((students) => {
      for (const student of students) {
        insertStmt.run(student);
      }
    });

    insertMany(studentsData);
  }

  /**
   * Deletes multiple students by their IDs in a single transaction.
   * @param ids An array of student IDs to delete.
   */
  bulkDelete(ids: number[]): void {
    const deleteStmt = this.db.prepare('DELETE FROM students WHERE id = ?');
    const deleteMany = this.db.transaction((studentIds) => {
      for (const id of studentIds) {
        deleteStmt.run(id);
      }
    });
    deleteMany(ids);
  }

  /**
   * Deletes all students in a specific classroom.
   * @param classroomId The ID of the classroom.
   * @returns The number of changes made.
   */
  deleteByClassroomId(classroomId: number): number {
    const stmt = this.db.prepare('DELETE FROM students WHERE classroom_id = ?');
    const result = stmt.run(classroomId);
    return result.changes;
  }

  /**
   * Counts the number of students in a specific classroom.
   * @param classroomId The ID of the classroom.
   * @returns The number of students in that classroom.
   */
  countByClassroomId(classroomId: number): number {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM students WHERE classroom_id = ?');
    const result = stmt.get(classroomId) as { count: number };
    return result.count;
  }
}
