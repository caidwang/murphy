import { useState } from 'react';
import ClassManagementPage from './pages/ClassManagementPage';
import ClassDetailPage from './pages/ClassDetailPage';
import RollcallPage from './pages/RollcallPage';
import RollcallStatsPage from './pages/RollcallStatsPage';
import RollcallSettingsPage from './pages/RollcallSettingsPage';

export type Page =
  | 'class-management'
  | 'class-detail'
  | 'rollcall'
  | 'rollcall-stats'
  | 'rollcall-settings';

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

  const navigateToRollcall = (classId: number) => {
    setSelectedClassId(classId);
    setCurrentPage('rollcall');
  };

  const navigateToRollcallStats = () => {
    setCurrentPage('rollcall-stats');
  };

  const navigateToRollcallSettings = () => {
    setCurrentPage('rollcall-settings');
  };

  const navigateBackFromRollcall = () => {
    setCurrentPage('class-detail');
  };

  return (
    <div
      className="w-full h-screen text-[var(--text-primary)]"
      style={{ background: 'var(--bg-primary)' }}
    >
      {currentPage === 'class-management' && (
        <ClassManagementPage onNavigateToDetail={navigateToDetail} />
      )}
      {currentPage === 'class-detail' && selectedClassId && (
        <ClassDetailPage
          classId={selectedClassId}
          onNavigateBack={navigateToManagement}
          onNavigateToRollcall={navigateToRollcall}
        />
      )}
      {currentPage === 'rollcall' && selectedClassId && (
        <RollcallPage
          classroomId={selectedClassId}
          onNavigateBack={navigateBackFromRollcall}
          onNavigateToStats={navigateToRollcallStats}
          onNavigateToSettings={navigateToRollcallSettings}
        />
      )}
      {currentPage === 'rollcall-stats' && selectedClassId && (
        <RollcallStatsPage
          classroomId={selectedClassId}
          onNavigateBack={() => setCurrentPage('rollcall')}
        />
      )}
      {currentPage === 'rollcall-settings' && (
        <RollcallSettingsPage
          onNavigateBack={() => setCurrentPage('rollcall')}
        />
      )}
    </div>
  );
}

export default App;
