interface StudentStats {
  student_id: number;
  student_name: string;
  student_number: string;
  rollcall_count: number;
  like_count: number;
  angry_count: number;
}

interface Props {
  students: StudentStats[];
}

export function RedList({ students }: Props) {
  if (students.length === 0) {
    return null;
  }

  return (
    <div
      className="card-shadow p-6 mb-6"
      style={{
        background: 'var(--color-yellow)',
        borderColor: 'rgba(217, 115, 13, 0.2)',
      }}
    >
      <div className="flex items-center space-x-2 mb-6">
        <i className="fas fa-trophy text-xl" style={{ color: 'var(--color-yellow-dark)' }}></i>
        <h2 className="notion-subtitle" style={{ color: 'var(--color-yellow-dark)' }}>
          红榜
        </h2>
        <span className="notion-caption">(点赞次数最多)</span>
      </div>
      <div className="space-y-3">
        {students.map((student, index) => (
          <div
            key={student.student_id}
            className="flex items-center justify-between p-4 rounded"
            style={{
              background: index === 0 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.4)',
              borderLeft: index === 0 ? '3px solid var(--color-yellow-dark)' : 'none',
            }}
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{
                  background:
                    index === 0
                      ? 'var(--color-yellow-dark)'
                      : 'var(--border-color)',
                  color: index === 0 ? 'white' : 'var(--text-secondary)',
                }}
              >
                {index + 1}
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {student.student_name}
                </p>
                <p className="notion-caption">学号: {student.student_number}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="notion-caption">被点次数</p>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {student.rollcall_count}
                </p>
              </div>
              <div className="text-center">
                <p className="notion-caption">点赞</p>
                <p className="font-bold" style={{ color: 'var(--color-green-dark)' }}>
                  {student.like_count}
                </p>
              </div>
              <div className="text-center">
                <p className="notion-caption">改进</p>
                <p className="font-bold" style={{ color: 'var(--color-orange-dark)' }}>
                  {student.angry_count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
