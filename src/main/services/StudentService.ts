import { StudentRepository } from '../repositories/StudentRepository';
import { Student } from '../models/Student';

export class StudentService {
  private studentRepository: StudentRepository;

  constructor(studentRepo: StudentRepository) {
    this.studentRepository = studentRepo;
  }

  /**
   * Retrieves all students belonging to a specific classroom.
   * @param classroomId - The ID of the classroom.
   * @returns An array of students.
   */
  getByClassroomId(classroomId: number): Student[] {
    // Business logic could be added here in the future, e.g.,
    // checking if the classroom exists or if the user has permission.
    return this.studentRepository.findByClassroomId(classroomId);
  }
}
