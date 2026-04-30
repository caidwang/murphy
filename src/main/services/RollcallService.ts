import { RollcallRecordRepository, RollcallRecordCreationData } from '../repositories/RollcallRecordRepository';
import { RollcallRecord, FeedbackType } from '../models/RollcallRecord';

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
