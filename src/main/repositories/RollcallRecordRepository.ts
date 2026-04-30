import { RollcallRecord } from '../models/RollcallRecord';
import { Statement } from 'better-sqlite3';

export type RollcallRecordCreationData = Omit<RollcallRecord, 'id' | 'created_at'>;

export class RollcallRecordRepository {
  private db: import("better-sqlite3").Database;
  private findByIdStmt: Statement;
  private findByClassroomIdStmt: Statement;
  private findByStudentIdStmt: Statement;

  constructor(dbInstance: import("better-sqlite3").Database) {
    this.db = dbInstance;
    this.findByIdStmt = this.db.prepare('SELECT * FROM rollcall_records WHERE id = ?');
    this.findByClassroomIdStmt = this.db.prepare('SELECT * FROM rollcall_records WHERE classroom_id = ? ORDER BY created_at DESC');
    this.findByStudentIdStmt = this.db.prepare('SELECT * FROM rollcall_records WHERE student_id = ? ORDER BY created_at DESC');
  }

  /**
   * Creates a new rollcall record.
   */
  create(data: RollcallRecordCreationData): number {
    const stmt = this.db.prepare(
      'INSERT INTO rollcall_records (student_id, classroom_id, feedback) VALUES (@student_id, @classroom_id, @feedback)'
    );
    const result = stmt.run(data);
    return result.lastInsertRowid as number;
  }

  /**
   * Finds a rollcall record by its ID.
   */
  findById(id: number): RollcallRecord | undefined {
    return this.findByIdStmt.get(id) as RollcallRecord | undefined;
  }

  /**
   * Finds all rollcall records for a specific classroom.
   */
  findByClassroomId(classroomId: number): RollcallRecord[] {
    return this.findByClassroomIdStmt.all(classroomId) as RollcallRecord[];
  }

  /**
   * Finds all rollcall records for a specific student.
   */
  findByStudentId(studentId: number): RollcallRecord[] {
    return this.findByStudentIdStmt.all(studentId) as RollcallRecord[];
  }

  /**
   * Gets rollcall statistics for a classroom.
   */
  getStatsByClassroomId(classroomId: number): {
    totalRollcalls: number;
    likeCount: number;
    angryCount: number;
  } {
    const totalStmt = this.db.prepare(
      'SELECT COUNT(*) as count FROM rollcall_records WHERE classroom_id = ?'
    );
    const likeStmt = this.db.prepare(
      'SELECT COUNT(*) as count FROM rollcall_records WHERE classroom_id = ? AND feedback = ?'
    );
    const angryStmt = this.db.prepare(
      'SELECT COUNT(*) as count FROM rollcall_records WHERE classroom_id = ? AND feedback = ?'
    );

    const total = (totalStmt.get(classroomId) as { count: number }).count;
    const likeCount = (likeStmt.get(classroomId, 'like') as { count: number }).count;
    const angryCount = (angryStmt.get(classroomId, 'angry') as { count: number }).count;

    return { totalRollcalls: total, likeCount, angryCount };
  }

  /**
   * Gets the top students by like count for a classroom.
   */
  getTopLikedStudents(classroomId: number, limit: number = 10): Array<{
    student_id: number;
    student_name: string;
    student_number: string;
    rollcall_count: number;
    like_count: number;
    angry_count: number;
  }> {
    const stmt = this.db.prepare(`
      SELECT
        s.id as student_id,
        s.name as student_name,
        s.student_number,
        COUNT(r.id) as rollcall_count,
        SUM(CASE WHEN r.feedback = 'like' THEN 1 ELSE 0 END) as like_count,
        SUM(CASE WHEN r.feedback = 'angry' THEN 1 ELSE 0 END) as angry_count
      FROM students s
      LEFT JOIN rollcall_records r ON s.id = r.student_id AND r.classroom_id = ?
      WHERE s.classroom_id = ?
      GROUP BY s.id
      HAVING rollcall_count > 0
      ORDER BY like_count DESC, angry_count ASC
      LIMIT ?
    `);
    return stmt.all(classroomId, classroomId, limit) as Array<{
      student_id: number;
      student_name: string;
      student_number: string;
      rollcall_count: number;
      like_count: number;
      angry_count: number;
    }>;
  }

  /**
   * Gets the top students by angry count for a classroom.
   */
  getTopAngryStudents(classroomId: number, limit: number = 10): Array<{
    student_id: number;
    student_name: string;
    student_number: string;
    rollcall_count: number;
    like_count: number;
    angry_count: number;
  }> {
    const stmt = this.db.prepare(`
      SELECT
        s.id as student_id,
        s.name as student_name,
        s.student_number,
        COUNT(r.id) as rollcall_count,
        SUM(CASE WHEN r.feedback = 'like' THEN 1 ELSE 0 END) as like_count,
        SUM(CASE WHEN r.feedback = 'angry' THEN 1 ELSE 0 END) as angry_count
      FROM students s
      LEFT JOIN rollcall_records r ON s.id = r.student_id AND r.classroom_id = ?
      WHERE s.classroom_id = ?
      GROUP BY s.id
      HAVING rollcall_count > 0
      ORDER BY angry_count DESC, like_count ASC
      LIMIT ?
    `);
    return stmt.all(classroomId, classroomId, limit) as Array<{
      student_id: number;
      student_name: string;
      student_number: string;
      rollcall_count: number;
      like_count: number;
      angry_count: number;
    }>;
  }

  /**
   * Gets the database instance for raw queries.
   */
  getDb(): import("better-sqlite3").Database {
    return this.db;
  }
}
