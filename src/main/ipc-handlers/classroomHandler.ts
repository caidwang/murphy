import { ipcMain } from 'electron';
import { ClassroomCreationData, ClassroomUpdateData } from '../repositories/ClassroomRepository';
import { ClassroomService } from '../services/ClassroomService';

export function registerClassroomHandlers(classroomService: ClassroomService): void {
  // Handler for creating a new classroom
  ipcMain.handle(
    'classrooms:create',
    async (_event, data: ClassroomCreationData): Promise<number> => {
      try {
        const newClassroomId = classroomService.create(data);
        return newClassroomId;
      } catch (error) {
        console.error('Failed to create classroom:', error);
        throw new Error('Failed to create classroom.'); // Propagate error to renderer
      }
    }
  );

  // Handler for getting all classrooms
  ipcMain.handle('classrooms:getAll', async () => {
    try {
      const classrooms = classroomService.getAll();
      return classrooms;
    } catch (error) {
      console.error('Failed to get all classrooms:', error);
      throw new Error('Failed to get all classrooms.'); // Propagate error to renderer
    }
  });

  // Handler for deleting a classroom
  ipcMain.handle('classrooms:delete', async (_event, id: number) => {
    if (typeof id !== 'number') {
      throw new Error('Invalid classroomId provided. Must be a number.');
    }
    try {
      classroomService.delete(id);
    } catch (error) {
      console.error(`Failed to delete classroom ${id}:`, error);
      throw new Error('Failed to delete the classroom.');
    }
  });

  // Handler for finding a classroom by ID
  ipcMain.handle('classrooms:findById', async (_event, id: number) => {
    if (typeof id !== 'number') {
      throw new Error('Invalid classroom ID provided. Must be a number.');
    }
    try {
      const classroom = classroomService.findById(id);
      return classroom;
    } catch (error) {
      console.error(`Failed to find classroom ${id}:`, error);
      throw new Error('Failed to find the classroom.');
    }
  });

  // Handler for updating a classroom
  ipcMain.handle(
    'classrooms:update',
    async (_event, id: number, data: ClassroomUpdateData) => {
      if (typeof id !== 'number') {
        throw new Error('Invalid classroom ID provided. Must be a number.');
      }
      try {
        const changes = classroomService.update(id, data);
        return changes;
      } catch (error) {
        console.error(`Failed to update classroom ${id}:`, error);
        throw new Error('Failed to update the classroom.');
      }
    }
  );
}
