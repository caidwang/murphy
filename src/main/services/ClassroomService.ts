import { ClassroomRepository, ClassroomCreationData, ClassroomUpdateData } from '../repositories/ClassroomRepository';
import { Classroom } from '../models/Classroom';
import { StudentRepository } from '../repositories/StudentRepository';
import { getDb } from '../repositories/database';

export class ClassroomService {
  private classroomRepository: ClassroomRepository;
  private studentRepository: StudentRepository;

  constructor(classroomRepo: ClassroomRepository, studentRepo: StudentRepository) {
    this.classroomRepository = classroomRepo;
    this.studentRepository = studentRepo;
  }

  /**
   * Creates a new classroom.
   * @param data - The data for the new classroom.
   * @returns The ID of the newly created classroom.
   */
  create(data: ClassroomCreationData): number {
    // In a more complex scenario, you might have business logic here,
    // e.g., checking for duplicate names, validating data, etc.
    return this.classroomRepository.create(data);
  }

  /**
   * Retrieves all classrooms.
   * @returns An array of all classrooms.
   */
  getAll(): Classroom[] {
    return this.classroomRepository.findAll();
  }

  /**
   * Deletes a classroom and all its students.
   * This operation is performed in a transaction.
   * @param id - The ID of the classroom to delete.
   */
  delete(id: number): void {
    const deleteTransaction = getDb().transaction(() => {
      // First, delete all students in the classroom
      this.studentRepository.deleteByClassroomId(id);
      // Then, delete the classroom itself
      this.classroomRepository.delete(id);
    });

    deleteTransaction();
  }

  /**
   * Finds a classroom by its ID.
   * @param id - The ID of the classroom to find.
   * @returns The classroom object or undefined if not found.
   */
  findById(id: number): Classroom | undefined {
    return this.classroomRepository.findById(id);
  }

  /**
   * Updates an existing classroom.
   * @param id - The ID of the classroom to update.
   * @param data - The data to update.
   * @returns The number of changes made.
   */
  update(id: number, data: ClassroomUpdateData): number {
    return this.classroomRepository.update(id, data);
  }
}
