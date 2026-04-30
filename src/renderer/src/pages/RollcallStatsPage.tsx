import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, [classroomId]);

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
