import { useState, useEffect } from 'react';
import { Classroom } from 'src/main/models/Classroom';
import { Button } from '~/components/ui/button';
import { ClassGrid } from '~/components/class/ClassGrid';
import { CreateEditClassDialog } from '~/components/class/CreateEditClassDialog';

interface Props {
  onNavigateToDetail: (classId: number) => void;
}

export default function ClassManagementPage({ onNavigateToDetail }: Props) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [studentCounts, setStudentCounts] = useState<Record<number, number>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);

  const fetchClassrooms = async () => {
    const result: Classroom[] = await window.electron.ipcRenderer.invoke('classrooms:getAll');
    setClassrooms(result);

    // Batch fetch student counts for all classrooms
    const counts: Record<number, number> = {};
    await Promise.all(
      result.map(async (classroom) => {
        const count = await window.electron.ipcRenderer.invoke(
          'students:getCountByClassroomId',
          classroom.id
        );
        counts[classroom.id] = count;
      })
    );
    setStudentCounts(counts);
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleDeleteClassroom = async (id: number) => {
    if (confirm('确定要删除这个班级吗？班级内的学生也会被删除。')) {
      await window.electron.ipcRenderer.invoke('classrooms:delete', id);
      fetchClassrooms();
    }
  };

  const handleEditClassroom = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    setIsCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingClassroom(null);
  };

  const handleSaveClass = () => {
    fetchClassrooms();
    handleCloseDialog();
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <header
        className="px-8 py-6 flex items-center justify-between"
        style={{
          background: 'var(--bg-white)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <h1 className="notion-title">班级管理</h1>
        <Button className="btn-primary" onClick={() => setIsCreateDialogOpen(true)}>
          <span>创建新班级</span>
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <ClassGrid
            classrooms={classrooms}
            studentCounts={studentCounts}
            onCardClick={onNavigateToDetail}
            onEditClick={handleEditClassroom}
            onDeleteClick={handleDeleteClassroom}
          />
        </div>
      </main>

      <CreateEditClassDialog
        isOpen={isCreateDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveClass}
        initialClassData={editingClassroom}
      />
    </div>
  );
}
