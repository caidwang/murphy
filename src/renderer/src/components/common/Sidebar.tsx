interface Props {
  onNavigateBack: () => void;
}

export function Sidebar({ onNavigateBack }: Props) {
  return (
    <aside className="w-64 flex flex-col" style={{ background: 'var(--bg-white)', borderRight: '1px solid var(--border-color)'}}>
      <div className="p-6" style={{ borderBottom: '1px solid var(--border-color)'}}>
        <div className="flex items-center space-x-3">
           {/* Icon needed */}
          <div>
            <p className="font-bold text-lg" style={{color: 'var(--text-primary)'}}>教学互动</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <div className="mb-6">
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{color: 'var(--text-tertiary)'}}>导航</p>
          <ul className="space-y-1">
            <li>
              <button onClick={onNavigateBack} className="w-full flex items-center space-x-3 px-4 py-3 rounded transition nav-item">
                 {/* Icon needed */}
                <span>班级管理</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
