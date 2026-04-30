import { Classroom } from 'src/main/models/Classroom';
import { ClassCard } from './ClassCard';

interface Props {
  classrooms: Classroom[];
  studentCounts?: Record<number, number>;
  onCardClick: (classId: number) => void;
  onEditClick?: (classroom: Classroom) => void;
  onDeleteClick: (classId: number) => void;
}

export function ClassGrid({
  classrooms,
  studentCounts = {},
  onCardClick,
  onEditClick,
  onDeleteClick,
}: Props) {
  if (classrooms.length === 0) {
    return <div className="text-center py-10 notion-caption">还没有任何班级，点击右上角创建一个吧。</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classrooms.map((classroom) => (
        <ClassCard
          key={classroom.id}
          classroom={classroom}
          studentCount={studentCounts[classroom.id] || 0}
          onCardClick={() => onCardClick(classroom.id)}
          onEditClick={onEditClick ? () => onEditClick(classroom) : undefined}
          onDeleteClick={() => onDeleteClick(classroom.id)}
        />
      ))}
    </div>
  );
}
