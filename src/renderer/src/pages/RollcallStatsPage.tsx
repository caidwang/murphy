import { useState, useCallback, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { StatsOverview } from '~/components/rollcall/StatsOverview';
import { RedList } from '~/components/rollcall/RedList';
import { BlackList } from '~/components/rollcall/BlackList';

interface Props {
  classroomId: number;
  onNavigateBack: () => void;
}

export default function RollcallStatsPage({ classroomId, onNavigateBack }: Props) {
  const [stats, setStats] = useState({
    totalRollcalls: 0,
    likeCount: 0,
    angryCount: 0,
  });
  const [redList, setRedList] = useState<
    Array<{
      student_id: number;
      student_name: string;
      student_number: string;
      rollcall_count: number;
      like_count: number;
      angry_count: number;
    }>
  >([]);
  const [blackList, setBlackList] = useState<
    Array<{
      student_id: number;
      student_name: string;
      student_number: string;
      rollcall_count: number;
      like_count: number;
      angry_count: number;
    }>
  >([]);
  const [isClearing, setIsClearing] = useState(false);

  const fetchData = useCallback(async () => {
    const rollcallStats = await window.electron.ipcRenderer.invoke(
      'rollcall:getStats',
      classroomId
    );
    setStats(rollcallStats);

    const topLiked = await window.electron.ipcRenderer.invoke(
      'rollcall:getTopLikedStudents',
      classroomId,
      10
    );
    setRedList(topLiked);

    const topAngry = await window.electron.ipcRenderer.invoke(
      'rollcall:getTopAngryStudents',
      classroomId,
      10
    );
    setBlackList(topAngry);
  }, [classroomId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleClearLeaderboard = async () => {
    const confirmed = window.confirm('确认清空当前班级的排行榜和历史点名记录？抽签状态不会被重置。');
    if (!confirmed) return;

    setIsClearing(true);
    try {
      await window.electron.ipcRenderer.invoke('rollcall:clearRecords', classroomId);
      await fetchData();
      alert('排行榜已清空');
    } catch (error) {
      console.error('Failed to clear rollcall records:', error);
      alert('清空排行榜失败');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="w-full h-screen flex">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={onNavigateBack}>
              &lt;
            </Button>
            <h1 className="notion-title">数据统计</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleClearLeaderboard}
            disabled={isClearing || stats.totalRollcalls === 0}
            className="btn-secondary"
          >
            {isClearing ? '清空中...' : '清空排行榜'}
          </Button>
        </div>

        <StatsOverview
          totalRollcalls={stats.totalRollcalls}
          likeCount={stats.likeCount}
          angryCount={stats.angryCount}
        />

        <RedList students={redList} />

        <BlackList students={blackList} />
      </main>
    </div>
  );
}
