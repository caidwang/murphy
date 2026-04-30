export interface Student {
  id: number;
  name: string;
  student_number: string;
  avatar_path?: string | null;
  classroom_id: number | null;
  created_at: string;
}
