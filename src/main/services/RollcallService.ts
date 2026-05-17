import { RollcallRecordRepository, RollcallRecordCreationData } from '../repositories/RollcallRecordRepository';
import { RollcallRecord, FeedbackType } from '../models/RollcallRecord';

export interface RollcallStudentState {
  classroom_id: number;
  student_id: number;
  weight: number;
  is_drawn: 0 | 1;
  updated_at: string;
}

export interface RollcallStudentStateInput {
  classroomId: number;
  studentId: number;
  weight: number;
  isDrawn: boolean;
}

export class RollcallService {
  private rollcallRecordRepository: RollcallRecordRepository;

  constructor(rollcallRecordRepo: RollcallRecordRepository) {
    this.rollcallRecordRepository = rollcallRecordRepo;
  }

  /**
   * Records a rollcall event with optional feedback.
   */
  recordRollcall(
    studentId: number,
    classroomId: number,
    feedback: FeedbackType = null
  ): number {
    const data: RollcallRecordCreationData = {
      student_id: studentId,
      classroom_id: classroomId,
      feedback,
    };
    return this.rollcallRecordRepository.create(data);
  }

  /**
   * Updates the feedback for a rollcall record.
   */
  updateFeedback(recordId: number, feedback: FeedbackType): number {
    const stmt = this.rollcallRecordRepository.getDb().prepare(
      'UPDATE rollcall_records SET feedback = ? WHERE id = ?'
    );
    const result = stmt.run(feedback, recordId);
    return result.changes;
  }

  /**
   * Persists drawing state for one student without touching leaderboard records.
   */
  saveStudentState(state: RollcallStudentStateInput): void {
    const normalizedWeight = Math.max(1, Math.floor(state.weight));
    const stmt = this.rollcallRecordRepository.getDb().prepare(`
      INSERT INTO rollcall_student_states (classroom_id, student_id, weight, is_drawn, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(classroom_id, student_id) DO UPDATE SET
        weight = excluded.weight,
        is_drawn = excluded.is_drawn,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(state.classroomId, state.studentId, normalizedWeight, state.isDrawn ? 1 : 0);
  }

  /**
   * Gets persisted drawing state for a classroom.
   */
  getStudentStates(classroomId: number): RollcallStudentState[] {
    const stmt = this.rollcallRecordRepository.getDb().prepare(`
      SELECT classroom_id, student_id, weight, is_drawn, updated_at
      FROM rollcall_student_states
      WHERE classroom_id = ?
    `);

    return stmt.all(classroomId) as RollcallStudentState[];
  }

  /**
   * Clears draw range and magic multipliers only.
   */
  resetStudentStates(classroomId: number): number {
    const stmt = this.rollcallRecordRepository.getDb().prepare(
      'DELETE FROM rollcall_student_states WHERE classroom_id = ?'
    );
    const result = stmt.run(classroomId);
    return result.changes;
  }

  /**
   * Clears leaderboard/history records only.
   */
  clearRecordsByClassroomId(classroomId: number): number {
    const stmt = this.rollcallRecordRepository.getDb().prepare(
      'DELETE FROM rollcall_records WHERE classroom_id = ?'
    );
    const result = stmt.run(classroomId);
    return result.changes;
  }

  /**
   * Gets the most recent rollcall record for a classroom.
   */
  getLatestRecord(classroomId: number): RollcallRecord | undefined {
    const records = this.rollcallRecordRepository.findByClassroomId(classroomId);
    return records.length > 0 ? records[0] : undefined;
  }

  /**
   * Gets rollcall statistics for a classroom.
   */
  getStats(classroomId: number): {
    totalRollcalls: number;
    likeCount: number;
    angryCount: number;
  } {
    return this.rollcallRecordRepository.getStatsByClassroomId(classroomId);
  }

  /**
   * Gets students who received the most likes.
   */
  getTopLikedStudents(
    classroomId: number,
    limit: number = 10
  ): Array<{
    student_id: number;
    student_name: string;
    student_number: string;
    rollcall_count: number;
    like_count: number;
    angry_count: number;
  }> {
    return this.rollcallRecordRepository.getTopLikedStudents(classroomId, limit);
  }

  /**
   * Gets students who received the most "needs improvement" feedback.
   */
  getTopAngryStudents(
    classroomId: number,
    limit: number = 10
  ): Array<{
    student_id: number;
    student_name: string;
    student_number: string;
    rollcall_count: number;
    like_count: number;
    angry_count: number;
  }> {
    return this.rollcallRecordRepository.getTopAngryStudents(classroomId, limit);
  }

  /**
   * Gets all rollcall records for a classroom.
   */
  getRecordsByClassroomId(classroomId: number): RollcallRecord[] {
    return this.rollcallRecordRepository.findByClassroomId(classroomId);
  }
}
