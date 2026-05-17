import { ipcMain } from 'electron';
import { RollcallService } from '../services/RollcallService';
import { FeedbackType } from '../models/RollcallRecord';

export function registerRollcallHandlers(rollcallService: RollcallService): void {
  // Handler for recording a rollcall
  ipcMain.handle(
    'rollcall:record',
    async (_event, studentId: number, classroomId: number, feedback: FeedbackType) => {
      if (typeof studentId !== 'number' || typeof classroomId !== 'number') {
        throw new Error('Invalid student ID or classroom ID provided.');
      }
      try {
        const recordId = rollcallService.recordRollcall(studentId, classroomId, feedback);
        return recordId;
      } catch (error) {
        console.error('Failed to record rollcall:', error);
        throw new Error('Failed to record rollcall.');
      }
    }
  );

  // Handler for updating feedback on a rollcall record
  ipcMain.handle(
    'rollcall:updateFeedback',
    async (_event, recordId: number, feedback: FeedbackType) => {
      if (typeof recordId !== 'number') {
        throw new Error('Invalid record ID provided.');
      }
      try {
        const changes = rollcallService.updateFeedback(recordId, feedback);
        return changes;
      } catch (error) {
        console.error(`Failed to update feedback for record ${recordId}:`, error);
        throw new Error('Failed to update feedback.');
      }
    }
  );

  ipcMain.handle('rollcall:getStudentStates', async (_event, classroomId: number) => {
    if (typeof classroomId !== 'number') {
      throw new Error('Invalid classroom ID provided.');
    }
    try {
      return rollcallService.getStudentStates(classroomId);
    } catch (error) {
      console.error(`Failed to get rollcall states for classroom ${classroomId}:`, error);
      throw new Error('Failed to get rollcall states.');
    }
  });

  ipcMain.handle(
    'rollcall:saveStudentState',
    async (
      _event,
      state: { classroomId: number; studentId: number; weight: number; isDrawn: boolean }
    ) => {
      if (
        !state ||
        typeof state.classroomId !== 'number' ||
        typeof state.studentId !== 'number' ||
        typeof state.weight !== 'number' ||
        typeof state.isDrawn !== 'boolean'
      ) {
        throw new Error('Invalid rollcall state provided.');
      }
      try {
        rollcallService.saveStudentState(state);
        return true;
      } catch (error) {
        console.error('Failed to save rollcall state:', error);
        throw new Error('Failed to save rollcall state.');
      }
    }
  );

  ipcMain.handle('rollcall:resetStudentStates', async (_event, classroomId: number) => {
    if (typeof classroomId !== 'number') {
      throw new Error('Invalid classroom ID provided.');
    }
    try {
      return rollcallService.resetStudentStates(classroomId);
    } catch (error) {
      console.error(`Failed to reset rollcall states for classroom ${classroomId}:`, error);
      throw new Error('Failed to reset rollcall states.');
    }
  });

  ipcMain.handle('rollcall:clearRecords', async (_event, classroomId: number) => {
    if (typeof classroomId !== 'number') {
      throw new Error('Invalid classroom ID provided.');
    }
    try {
      return rollcallService.clearRecordsByClassroomId(classroomId);
    } catch (error) {
      console.error(`Failed to clear rollcall records for classroom ${classroomId}:`, error);
      throw new Error('Failed to clear rollcall records.');
    }
  });

  // Handler for getting rollcall stats
  ipcMain.handle('rollcall:getStats', async (_event, classroomId: number) => {
    if (typeof classroomId !== 'number') {
      throw new Error('Invalid classroom ID provided.');
    }
    try {
      const stats = rollcallService.getStats(classroomId);
      return stats;
    } catch (error) {
      console.error(`Failed to get stats for classroom ${classroomId}:`, error);
      throw new Error('Failed to get rollcall stats.');
    }
  });

  // Handler for getting top liked students
  ipcMain.handle(
    'rollcall:getTopLikedStudents',
    async (_event, classroomId: number, limit: number = 10) => {
      if (typeof classroomId !== 'number') {
        throw new Error('Invalid classroom ID provided.');
      }
      try {
        const students = rollcallService.getTopLikedStudents(classroomId, limit);
        return students;
      } catch (error) {
        console.error(`Failed to get top liked students for classroom ${classroomId}:`, error);
        throw new Error('Failed to get top liked students.');
      }
    }
  );

  // Handler for getting top angry students
  ipcMain.handle(
    'rollcall:getTopAngryStudents',
    async (_event, classroomId: number, limit: number = 10) => {
      if (typeof classroomId !== 'number') {
        throw new Error('Invalid classroom ID provided.');
      }
      try {
        const students = rollcallService.getTopAngryStudents(classroomId, limit);
        return students;
      } catch (error) {
        console.error(`Failed to get top angry students for classroom ${classroomId}:`, error);
        throw new Error('Failed to get top angry students.');
      }
    }
  );

  // Handler for getting the latest rollcall record
  ipcMain.handle('rollcall:getLatestRecord', async (_event, classroomId: number) => {
    if (typeof classroomId !== 'number') {
      throw new Error('Invalid classroom ID provided.');
    }
    try {
      const record = rollcallService.getLatestRecord(classroomId);
      return record;
    } catch (error) {
      console.error(`Failed to get latest record for classroom ${classroomId}:`, error);
      throw new Error('Failed to get latest rollcall record.');
    }
  });
}
