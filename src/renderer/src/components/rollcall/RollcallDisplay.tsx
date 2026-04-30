import { Student } from 'src/main/models/Student'
import { Hash, Sparkles, Users } from 'lucide-react'
import type { ReactElement } from 'react'

interface Props {
  student: Student | null
  isRolling: boolean
  waitingCount: number
  totalCount: number
}

export function RollcallDisplay({
  student,
  isRolling,
  waitingCount,
  totalCount
}: Props): ReactElement {
  const initial = student?.name?.trim().charAt(0) || '?'

  return (
    <section className="relative overflow-hidden rounded-lg border border-[var(--border-color)] bg-white">
      <div className="absolute inset-x-0 top-0 h-1 bg-[#2383E2]" />

      <div className="grid min-h-[420px] grid-rows-[auto_1fr_auto] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-md bg-[#F1F7FE] px-3 py-2 text-sm font-medium text-[#1F6FBF]">
            <Sparkles className="h-4 w-4" />
            {isRolling ? '正在抽取' : student ? '本次点名' : '等待开始'}
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Users className="h-4 w-4" />
            待抽 {waitingCount}/{totalCount}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="relative mb-8">
            {isRolling && (
              <div className="absolute -inset-3 rounded-full border border-dashed border-[#2383E2] animate-spin [animation-duration:1.4s]" />
            )}
            <div className="h-36 w-36 overflow-hidden rounded-full border border-[var(--border-color)] bg-[#F7F6F3] shadow-sm sm:h-44 sm:w-44">
              {student?.avatar_path ? (
                <img
                  src={student.avatar_path}
                  alt={student.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl font-semibold text-[var(--text-primary)] sm:text-7xl">
                  {initial}
                </div>
              )}
            </div>
          </div>

          <div className="max-w-full px-2">
            <p className="mb-4 text-sm font-medium text-[var(--text-secondary)]">
              {isRolling
                ? '名单正在滚动，点击停止锁定学生'
                : student
                  ? '已锁定，请记录本次回答表现'
                  : '点击开始，从当前班级中随机抽取'}
            </p>
            <h2 className="break-words text-5xl font-bold leading-tight text-[var(--text-primary)] sm:text-7xl">
              {student?.name || '准备点名'}
            </h2>
            {student && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-[var(--border-color)] bg-[#FAFAFA] px-3 py-2 text-sm text-[var(--text-secondary)]">
                <Hash className="h-4 w-4" />
                学号 {student.student_number || '未填写'}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-md bg-[#FAFAFA] p-2 text-center text-sm">
          <div className="rounded bg-white px-3 py-3">
            <div className="font-semibold text-[var(--text-primary)]">{totalCount}</div>
            <div className="mt-1 text-[var(--text-secondary)]">学生总数</div>
          </div>
          <div className="rounded bg-white px-3 py-3">
            <div className="font-semibold text-[var(--text-primary)]">{waitingCount}</div>
            <div className="mt-1 text-[var(--text-secondary)]">待抽人数</div>
          </div>
          <div className="rounded bg-white px-3 py-3">
            <div className="font-semibold text-[var(--text-primary)]">
              {isRolling ? '进行中' : '空闲'}
            </div>
            <div className="mt-1 text-[var(--text-secondary)]">当前状态</div>
          </div>
        </div>
      </div>
    </section>
  )
}
