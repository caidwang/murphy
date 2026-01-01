import { Classroom } from '../models/Classroom';
import { Statement } from 'better-sqlite3';

// Type for the data needed to create a new classroom
export type ClassroomCreationData = Omit<Classroom, 'id' | 'created_at'>;

// Type for the data needed to update an existing classroom
export type ClassroomUpdateData = Partial<Omit<Classroom, 'id' | 'created_at'>>;

export class ClassroomRepository {
  private db: import("better-sqlite3").Database;
  private findAllStmt: Statement;
  private findByIdStmt: Statement;

  constructor(dbInstance: import("better-sqlite3").Database) {
    this.db = dbInstance;
    this.findAllStmt = this.db.prepare('SELECT * FROM classrooms');
    this.findByIdStmt = this.db.prepare('SELECT * FROM classrooms WHERE id = ?');
  }

  /**
   * Creates a new classroom.
   * @param data - The data for the new classroom.
   * @returns The ID of the newly created classroom.
   */
  create(data: ClassroomCreationData): number {
    const stmt = this.db.prepare(
      'INSERT INTO classrooms (name, background_image_path, theme_color) VALUES (@name, @background_image_path, @theme_color)'
    );
    const result = stmt.run(data);
    return result.lastInsertRowid as number;
  }

  /**
   * Updates an existing classroom.
   * @param id - The ID of the classroom to update.
   * @param data - The data to update.
   * @returns The number of changes made.
   */
  update(id: number, data: ClassroomUpdateData): number {
    const fields = Object.keys(data);
    const values = Object.values(data);

    if (fields.length === 0) {
      return 0;
    }

    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const stmt = this.db.prepare(`UPDATE classrooms SET ${setClause} WHERE id = ?`);
    const result = stmt.run(...values, id);

    return result.changes;
  }

  /**
   * Deletes a classroom by its ID.
   * @param id - The ID of the classroom to delete.
   * @returns The number of changes made.
   */
  delete(id: number): number {
    const stmt = this.db.prepare('DELETE FROM classrooms WHERE id = ?');
    const result = stmt.run(id);
    return result.changes;
  }

  /**
   * Finds a classroom by its ID.
   * @param id - The ID of the classroom to find.
   * @returns The classroom object or undefined if not found.
   */
  findById(id: number): Classroom | undefined {
    return this.findByIdStmt.get(id) as Classroom | undefined;
  }

  /**
   * Finds all classrooms.
   * @returns An array of all classrooms.
   */
  findAll(): Classroom[] {
    return this.findAllStmt.all() as Classroom[];
  }
}
