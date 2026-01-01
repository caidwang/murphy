import { useState } from 'react';
import ClassManagementPage from './pages/ClassManagementPage';
import ClassDetailPage from './pages/ClassDetailPage';

export type Page = 'class-management' | 'class-detail';

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<Page>('class-management');
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const navigateToDetail = (classId: number) => {
    setSelectedClassId(classId);
    setCurrentPage('class-detail');
  };

  const navigateToManagement = () => {
    setSelectedClassId(null);
    setCurrentPage('class-management');
  };

  return (
    <div className="w-full h-screen text-[var(--text-primary)]" style={{ background: 'var(--bg-primary)'}}>
      {currentPage === 'class-management' && (
        <ClassManagementPage onNavigateToDetail={navigateToDetail} />
      )}
      {currentPage === 'class-detail' && selectedClassId && (
        <ClassDetailPage
          classId={selectedClassId}
          onNavigateBack={navigateToManagement}
        />
      )}
    </div>
  );
}

export default App;