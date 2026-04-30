import { useState, useEffect } from 'react';
import { Classroom } from 'src/main/models/Classroom';
import { Student } from 'src/main/models/Student';
import { StudentList } from '~/components/student/StudentList';
import { CreateEditStudentDialog } from '~/components/student/CreateEditStudentDialog';
import { Button } from '~/components/ui/button';

interface Props {
  classId: number;
  onNavigateBack: () => void;
  onNavigateToRollcall: (classId: number) => void;
}

export default function ClassDetailPage({ classId, onNavigateBack, onNavigateToRollcall }: Props) {
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      const classDetail = await window.electron.ipcRenderer.invoke('classrooms:findById', classId);
      setClassroom(classDetail);
    };

    const fetchStudents = async () => {
      const result = await window.electron.ipcRenderer.invoke('students:getByClassroomId', classId);
      setStudents(result);
    };

    fetchClassDetails();
    fetchStudents();
  }, [classId]);

  const handleSaveStudent = async () => {
    const result = await window.electron.ipcRenderer.invoke('students:getByClassroomId', classId);
    setStudents(result);
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (confirm('确定要删除这个学生吗？')) {
      await window.electron.ipcRenderer.invoke('students:delete', studentId);
      handleSaveStudent();
    }
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsCreateDialogOpen(true);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="w-full h-screen flex">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onNavigateBack}>
            &lt;
          </Button>
          <h1 className="notion-title">{classroom?.name || '班级详情'}</h1>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="notion-subtitle">学生列表</h2>
            <div className="flex space-x-2">
              <Button className="btn-primary" onClick={() => onNavigateToRollcall(classId)}>
                随机点名
              </Button>
              <Button className="btn-primary" onClick={handleAddStudent}>
                添加学生
              </Button>
            </div>
          </div>
          <StudentList
            students={students}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
          />
        </div>
      </main>

      <CreateEditStudentDialog
        isOpen={isCreateDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveStudent}
        classroomId={classId}
        initialStudentData={selectedStudent}
      />
    </div>
  );
}
