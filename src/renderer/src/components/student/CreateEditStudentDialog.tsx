import { useState, useEffect } from 'react';
import { Student } from 'src/main/models/Student';
import { StudentCreationData, StudentUpdateData } from 'src/main/repositories/StudentRepository';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  classroomId: number;
  initialStudentData?: Student | null;
}

export function CreateEditStudentDialog({
  isOpen,
  onClose,
  onSave,
  classroomId,
  initialStudentData,
}: Props) {
  const [name, setName] = useState(initialStudentData?.name || '');
  const [studentNumber, setStudentNumber] = useState(initialStudentData?.student_number || '');
  const [avatarPath, setAvatarPath] = useState(initialStudentData?.avatar_path || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialStudentData) {
      setName(initialStudentData.name);
      setStudentNumber(initialStudentData.student_number);
      setAvatarPath(initialStudentData.avatar_path || '');
    } else {
      setName('');
      setStudentNumber('');
      setAvatarPath('');
    }
  }, [initialStudentData]);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      if (initialStudentData && initialStudentData.id) {
        const data: StudentUpdateData = {
          name,
          student_number: studentNumber,
          avatar_path: avatarPath || undefined,
        };
        await window.electron.ipcRenderer.invoke('students:update', initialStudentData.id, data);
      } else {
        const data: StudentCreationData = {
          name,
          student_number: studentNumber,
          avatar_path: avatarPath || null,
          classroom_id: classroomId,
        };
        await window.electron.ipcRenderer.invoke('students:create', data);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save student:', error);
      alert('保存学生信息失败: ' + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialStudentData ? '编辑学生' : '添加学生'}</DialogTitle>
          <DialogDescription>
            {initialStudentData ? '修改学生信息。' : '填写学生信息以添加一个新学生。'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              姓名
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="请输入学生姓名"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="studentNumber" className="text-right">
              学号
            </Label>
            <Input
              id="studentNumber"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              className="col-span-3"
              placeholder="请输入学号"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatarPath" className="text-right">
              头像URL
            </Label>
            <Input
              id="avatarPath"
              value={avatarPath}
              onChange={(e) => setAvatarPath(e.target.value)}
              className="col-span-3"
              placeholder="请输入头像URL（可选）"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
