import { ipcMain } from 'electron';
import { StudentService } from '../services/StudentService';
import { StudentCreationData, StudentUpdateData } from '../repositories/StudentRepository';

export function registerStudentHandlers(studentService: StudentService): void {
  // Handler for getting all students in a classroom
  ipcMain.handle(
    'students:getByClassroomId',
    async (_event, classroomId: number) => {
      if (typeof classroomId !== 'number') {
        throw new Error('Invalid classroomId provided. Must be a number.');
      }
      try {
        const students = studentService.getByClassroomId(classroomId);
        return students;
      } catch (error) {
        console.error(`Failed to get students for classroom ${classroomId}:`, error);
        throw new Error('Failed to get students for the classroom.');
      }
    }
  );

  // Handler for creating a new student
  ipcMain.handle(
    'students:create',
    async (_event, data: StudentCreationData) => {
      try {
        const newStudentId = studentService.create(data);
        return newStudentId;
      } catch (error) {
        console.error('Failed to create student:', error);
        throw new Error('Failed to create student.');
      }
    }
  );

  // Handler for updating a student
  ipcMain.handle(
    'students:update',
    async (_event, id: number, data: StudentUpdateData) => {
      if (typeof id !== 'number') {
        throw new Error('Invalid student ID provided. Must be a number.');
      }
      try {
        const changes = studentService.update(id, data);
        return changes;
      } catch (error) {
        console.error(`Failed to update student ${id}:`, error);
        throw new Error('Failed to update student.');
      }
    }
  );

  // Handler for deleting a student
  ipcMain.handle('students:delete', async (_event, id: number) => {
    if (typeof id !== 'number') {
      throw new Error('Invalid student ID provided. Must be a number.');
    }
    try {
      studentService.delete(id);
    } catch (error) {
      console.error(`Failed to delete student ${id}:`, error);
      throw new Error('Failed to delete student.');
    }
  });

  // Handler for bulk inserting students
  ipcMain.handle(
    'students:bulkInsert',
    async (_event, studentsData: StudentCreationData[]) => {
      if (!Array.isArray(studentsData)) {
        throw new Error('Invalid students data provided. Must be an array.');
      }
      try {
        studentService.bulkInsert(studentsData);
      } catch (error) {
        console.error('Failed to bulk insert students:', error);
        throw new Error('Failed to bulk insert students.');
      }
    }
  );

  // Handler for bulk deleting students
  ipcMain.handle('students:bulkDelete', async (_event, ids: number[]) => {
    if (!Array.isArray(ids)) {
      throw new Error('Invalid IDs provided. Must be an array.');
    }
    try {
      studentService.bulkDelete(ids);
    } catch (error) {
      console.error('Failed to bulk delete students:', error);
      throw new Error('Failed to bulk delete students.');
    }
  });

  // Handler for getting student count by classroom ID
  ipcMain.handle(
    'students:getCountByClassroomId',
    async (_event, classroomId: number) => {
      if (typeof classroomId !== 'number') {
        throw new Error('Invalid classroomId provided. Must be a number.');
      }
      try {
        const count = studentService.getCountByClassroomId(classroomId);
        return count;
      } catch (error) {
        console.error(`Failed to get student count for classroom ${classroomId}:`, error);
        throw new Error('Failed to get student count.');
      }
    }
  );
}
