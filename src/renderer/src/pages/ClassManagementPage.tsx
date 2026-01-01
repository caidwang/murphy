import { useState, useEffect } from 'react';
import { Classroom } from 'src/main/models/Classroom';
import { Button } from '~/components/ui/button';
import { ClassGrid } from '~/components/class/ClassGrid';

interface Props {
  onNavigateToDetail: (classId: number) => void;
}

export default function ClassManagementPage({ onNavigateToDetail }: Props) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const fetchClassrooms = async () => {
    const result: Classroom[] = await window.electron.ipcRenderer.invoke('classrooms:getAll');
    setClassrooms(result);
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleDeleteClassroom = async (id: number) => {
    await window.electron.ipcRenderer.invoke('classrooms:delete', id);
    fetchClassrooms(); // Refresh the list after deletion
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <header className="px-8 py-6 flex items-center justify-between" style={{ background: 'var(--bg-white)', borderBottom: '1px solid var(--border-color)'}}>
        <h1 className="notion-title">班级管理</h1>
        <Button className="btn-primary">
          {/* <i className="fas fa-plus mr-2"></i> This needs an icon component */}
          <span>创建新班级</span>
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <ClassGrid
            classrooms={classrooms}
            onCardClick={onNavigateToDetail}
            onDeleteClick={handleDeleteClassroom}
          />
        </div>
      </main>
    </div>
  );
}
