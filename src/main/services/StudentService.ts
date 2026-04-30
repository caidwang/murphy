import { StudentRepository, StudentCreationData, StudentUpdateData } from '../repositories/StudentRepository';
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
    return this.studentRepository.findByClassroomId(classroomId);
  }

  /**
   * Creates a new student.
   * @param data - The data for the new student.
   * @returns The ID of the newly created student.
   */
  create(data: StudentCreationData): number {
    return this.studentRepository.create(data);
  }

  /**
   * Updates an existing student.
   * @param id - The ID of the student to update.
   * @param data - The data to update.
   * @returns The number of changes made.
   */
  update(id: number, data: StudentUpdateData): number {
    return this.studentRepository.update(id, data);
  }

  /**
   * Deletes a student by their ID.
   * @param id - The ID of the student to delete.
   * @returns The number of changes made.
   */
  delete(id: number): number {
    return this.studentRepository.delete(id);
  }

  /**
   * Inserts multiple students in a single transaction.
   * @param studentsData - An array of student data to insert.
   */
  bulkInsert(studentsData: StudentCreationData[]): void {
    this.studentRepository.bulkInsert(studentsData);
  }

  /**
   * Deletes multiple students by their IDs in a single transaction.
   * @param ids - An array of student IDs to delete.
   */
  bulkDelete(ids: number[]): void {
    this.studentRepository.bulkDelete(ids);
  }

  /**
   * Finds a student by their ID.
   * @param id - The ID of the student to find.
   * @returns The student object or undefined if not found.
   */
  findById(id: number): Student | undefined {
    return this.studentRepository.findById(id);
  }

  /**
   * Gets the count of students in a specific classroom.
   * @param classroomId - The ID of the classroom.
   * @returns The number of students in the classroom.
   */
  getCountByClassroomId(classroomId: number): number {
    return this.studentRepository.countByClassroomId(classroomId);
  }
}
