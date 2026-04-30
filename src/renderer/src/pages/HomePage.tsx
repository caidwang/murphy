import { useState, useEffect } from 'react';
import { Classroom } from 'src/main/models/Classroom';
import { Card } from '../components/ui/card.tsx';
import { ClassGrid } from '../components/class/ClassGrid.tsx';
import { Plus } from 'lucide-react'; // For the plus icon
import { CreateEditClassDialog } from '../components/class/CreateEditClassDialog.tsx'; // Import the new dialog

interface Props {
  onNavigateToDetail: (classId: number) => void;
}

export default function HomePage({ onNavigateToDetail }: Props) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); 

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
    <div className="flex-1 overflow-y-auto p-8">
      <h1 className="notion-title mb-8">我的班级</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <ClassGrid
          classrooms={classrooms}
          onCardClick={onNavigateToDetail}
          onDeleteClick={handleDeleteClassroom}
        />

        {/* Create New Class Card - matching home.html design */}
        <Card className="card-shadow-hover p-8 text-center" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="text-4xl mb-4 mx-auto" style={{ color: 'var(--text-tertiary)' }} />
          <h3 className="notion-subtitle mb-2">创建新班级</h3>
          <p className="notion-caption">点击创建新班级</p>
        </Card>
      </div>

      <CreateEditClassDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={fetchClassrooms} // Refresh classrooms after save
        initialClassData={null} // No initial data for creation
      />
    </div>
  );
}
