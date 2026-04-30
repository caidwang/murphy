export type FeedbackType = 'like' | 'angry' | null;

export interface RollcallRecord {
  id: number;
  student_id: number;
  classroom_id: number;
  feedback: FeedbackType;
  created_at: string;
}

export interface RollcallRecordWithStudent extends RollcallRecord {
  student_name: string;
  student_number: string;
}
