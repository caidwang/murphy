import { useState, useEffect } from 'react';
import { Classroom } from 'src/main/models/Classroom';
import { Student } from 'src/main/models/Student';
import { Sidebar } from '~/components/common/Sidebar';
import { StudentList } from '~/components/student/StudentList';
import { Button } from '~/components/ui/button';

interface Props {
  classId: number;
  onNavigateBack: () => void;
}

export default function ClassDetailPage({ classId, onNavigateBack }: Props) {
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchClassDetails = async () => {
      // Assuming a findById IPC handler for classrooms will be created
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

  return (
    <div className="w-full h-screen flex">
      <Sidebar onNavigateBack={onNavigateBack} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onNavigateBack}>
            {/* Back icon needed */}
            &lt;
          </Button>
          <h1 className="notion-title">{classroom?.name || '班级详情'}</h1>
        </div>

        {/* This is where the function cards from the prototype would go */}
        {/* <div className="mb-6"> ... </div> */}

        <div className="mt-8">
           <div className="flex justify-between items-center mb-4">
             <h2 className="notion-subtitle">学生列表</h2>
             <Button className="btn-primary">添加学生</Button>
           </div>
          <StudentList students={students} />
        </div>
      </main>
    </div>
  );
}
