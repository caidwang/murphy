interface Props {
  totalRollcalls: number;
  likeCount: number;
  angryCount: number;
}

export function StatsOverview({ totalRollcalls, likeCount, angryCount }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Rollcalls - Blue */}
      <div
        className="card-shadow p-6"
        style={{
          background: 'var(--color-blue)',
          borderColor: 'rgba(35, 131, 226, 0.2)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm mb-1 notion-caption" style={{ color: 'var(--text-secondary)' }}>
              总点名次数
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-blue-dark)' }}>
              {totalRollcalls}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded flex items-center justify-center"
            style={{ background: 'var(--color-blue-dark)' }}
          >
            <i className="fas fa-random text-xl" style={{ color: 'white' }}></i>
          </div>
        </div>
      </div>

      {/* Total Likes - Green */}
      <div
        className="card-shadow p-6"
        style={{
          background: 'var(--color-green)',
          borderColor: 'rgba(15, 123, 108, 0.2)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm mb-1 notion-caption" style={{ color: 'var(--text-secondary)' }}>
              总点赞数
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-green-dark)' }}>
              {likeCount}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded flex items-center justify-center"
            style={{ background: 'var(--color-green-dark)' }}
          >
            <i className="fas fa-thumbs-up text-xl" style={{ color: 'white' }}></i>
          </div>
        </div>
      </div>

      {/* Needs Improvement - Orange */}
      <div
        className="card-shadow p-6"
        style={{
          background: 'var(--color-orange)',
          borderColor: 'rgba(217, 115, 13, 0.2)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm mb-1 notion-caption" style={{ color: 'var(--text-secondary)' }}>
              需要改进
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-orange-dark)' }}>
              {angryCount}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded flex items-center justify-center"
            style={{ background: 'var(--color-orange-dark)' }}
          >
            <i className="fas fa-angry text-xl" style={{ color: 'white' }}></i>
          </div>
        </div>
      </div>
    </div>
  );
}
