import { ipcMain } from 'electron';
import { StudentService } from '../services/StudentService'; // Import the class for type hinting

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
}
