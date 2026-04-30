import { useState, useEffect, useRef, useCallback } from 'react'
import type { ReactElement } from 'react'
import { Student } from 'src/main/models/Student'
import { FeedbackType } from 'src/main/models/RollcallRecord'
import { ArrowLeft, BarChart3, CheckCircle2, Settings, Shuffle, Users } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { RollcallDisplay } from '~/components/rollcall/RollcallDisplay'
import { RollcallControls } from '~/components/rollcall/RollcallControls'
import { RollcallFeedback } from '~/components/rollcall/RollcallFeedback'
import { StudentAvatar } from '~/components/student/StudentAvatar'

interface Props {
  classroomId: number
  onNavigateBack: () => void
  onNavigateToStats: () => void
  onNavigateToSettings: () => void
}

export default function RollcallPage({
  classroomId,
  onNavigateBack,
  onNavigateToStats,
  onNavigateToSettings
}: Props): ReactElement {
  const [students, setStudents] = useState<Student[]>([])
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentRecordId, setCurrentRecordId] = useState<number | null>(null)
  const [calledStudentIds, setCalledStudentIds] = useState<number[]>([])
  const [settings, setSettings] = useState({
    allowRepeat: true,
    scrollSpeed: 'medium'
  })

  const rollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentIndexRef = useRef(0)
  const currentStudentRef = useRef<Student | null>(null)

  const availableStudents = settings.allowRepeat
    ? students
    : students.filter((student) => !calledStudentIds.includes(student.id))
  const waitingCount = availableStudents.length
  const completedCount = settings.allowRepeat ? 0 : calledStudentIds.length

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const studentList = await window.electron.ipcRenderer.invoke(
        'students:getByClassroomId',
        classroomId
      )
      setStudents(studentList)
      setCalledStudentIds([])
      setCurrentStudent(null)
      currentStudentRef.current = null

      const rollcallSettings = await window.electron.ipcRenderer.invoke('settings:get')
      if (rollcallSettings) {
        setSettings({
          allowRepeat: rollcallSettings.allowRepeat ?? true,
          scrollSpeed: rollcallSettings.scrollSpeed ?? 'medium'
        })
      }
    }

    fetchData()
  }, [classroomId])

  const getScrollInterval = useCallback((): number => {
    switch (settings.scrollSpeed) {
      case 'slow':
        return 150
      case 'fast':
        return 50
      default:
        return 80
    }
  }, [settings.scrollSpeed])

  const startRollcall = useCallback((): void => {
    if (availableStudents.length === 0) return

    setIsRolling(true)
    setShowFeedback(false)
    setCurrentRecordId(null)

    currentIndexRef.current = Math.floor(Math.random() * availableStudents.length)
    setCurrentStudent(availableStudents[currentIndexRef.current])
    currentStudentRef.current = availableStudents[currentIndexRef.current]

    const interval = getScrollInterval()
    rollIntervalRef.current = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % availableStudents.length
      const nextStudent = availableStudents[currentIndexRef.current]
      setCurrentStudent(nextStudent)
      currentStudentRef.current = nextStudent
    }, interval)
  }, [availableStudents, getScrollInterval])

  const stopRollcall = useCallback(async (): Promise<void> => {
    if (rollIntervalRef.current) {
      clearInterval(rollIntervalRef.current)
      rollIntervalRef.current = null
    }

    setIsRolling(false)

    const selectedStudent = currentStudentRef.current

    if (selectedStudent) {
      const recordId = await window.electron.ipcRenderer.invoke(
        'rollcall:record',
        selectedStudent.id,
        classroomId,
        null
      )
      setCurrentRecordId(recordId)
      setShowFeedback(true)
      if (!settings.allowRepeat) {
        setCalledStudentIds((ids) =>
          ids.includes(selectedStudent.id) ? ids : [...ids, selectedStudent.id]
        )
      }
    }
  }, [classroomId, settings.allowRepeat])

  const handleFeedback = async (feedback: FeedbackType): Promise<void> => {
    if (currentRecordId) {
      await window.electron.ipcRenderer.invoke('rollcall:updateFeedback', currentRecordId, feedback)
    }
    setShowFeedback(false)
    setCurrentStudent(null)
    currentStudentRef.current = null
    setCurrentRecordId(null)
  }

  const handleToggle = (): void => {
    if (isRolling) {
      stopRollcall()
    } else {
      startRollcall()
    }
  }

  const handleResetRound = (): void => {
    setCalledStudentIds([])
    setShowFeedback(false)
    setCurrentStudent(null)
    currentStudentRef.current = null
    setCurrentRecordId(null)
  }

  useEffect(() => {
    return () => {
      if (rollIntervalRef.current) {
        clearInterval(rollIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F6F3]">
      <main className="min-h-0 flex-1 overflow-hidden">
        <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-4 lg:px-5">
          <div className="mb-3 flex shrink-0 flex-col gap-3 border-b border-[var(--border-color)] pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onNavigateBack}
                aria-label="返回班级详情"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="mb-1 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Shuffle className="h-4 w-4" />
                  随机点名
                </div>
                <h1 className="text-3xl font-bold leading-tight text-[var(--text-primary)]">
                  课堂点名台
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onNavigateToStats}>
                <BarChart3 className="h-4 w-4" />
                数据统计
              </Button>
              <Button variant="outline" onClick={onNavigateToSettings}>
                <Settings className="h-4 w-4" />
                设置
              </Button>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto_auto_auto] gap-3">
              <RollcallDisplay
                student={currentStudent}
                isRolling={isRolling}
                waitingCount={waitingCount}
                totalCount={students.length}
              />

              <RollcallControls
                isRolling={isRolling}
                onToggle={handleToggle}
                onReset={handleResetRound}
                disabled={students.length === 0 || (!settings.allowRepeat && waitingCount === 0)}
                canReset={calledStudentIds.length > 0 || Boolean(currentStudent)}
              />

              {showFeedback && currentStudent && (
                <RollcallFeedback studentName={currentStudent.name} onFeedback={handleFeedback} />
              )}

              {students.length === 0 && (
                <div className="rounded-lg border border-dashed border-[var(--border-color)] bg-white px-5 py-4 text-center text-sm text-[var(--text-secondary)]">
                  暂无学生，请先在班级中添加学生
                </div>
              )}

              {!settings.allowRepeat && students.length > 0 && waitingCount === 0 && (
                <div className="rounded-lg border border-[#B7E2CA] bg-[#F2FBF5] px-5 py-4 text-sm text-[#24764C]">
                  本轮学生已全部点完，可以重置本轮后继续。
                </div>
              )}
            </div>

            <aside className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3">
              <section className="rounded-lg border border-[var(--border-color)] bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">本轮状态</h2>
                  <span className="rounded bg-[#F7F6F3] px-2 py-1 text-xs text-[var(--text-secondary)]">
                    {settings.allowRepeat ? '允许重复' : '不重复'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-[#FAFAFA] p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <Users className="h-4 w-4" />
                      待抽
                    </div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]">
                      {waitingCount}
                    </div>
                  </div>
                  <div className="rounded-md bg-[#FAFAFA] p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <CheckCircle2 className="h-4 w-4" />
                      已点
                    </div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]">
                      {completedCount}
                    </div>
                  </div>
                </div>
              </section>

              <section className="flex min-h-0 flex-col rounded-lg border border-[var(--border-color)] bg-white p-4">
                <div className="mb-3 flex shrink-0 items-center justify-between">
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">候选名单</h2>
                  <span className="text-sm text-[var(--text-secondary)]">{waitingCount} 人</span>
                </div>

                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                  {availableStudents.length > 0 ? (
                    availableStudents.slice(0, 24).map((student) => (
                      <div
                        key={student.id}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                          currentStudent?.id === student.id
                            ? 'bg-[#F1F7FE] text-[#1F6FBF]'
                            : 'bg-[#FAFAFA] text-[var(--text-primary)]'
                        }`}
                      >
                        <StudentAvatar
                          name={student.name}
                          seed={`${student.id}-${student.student_number}`}
                          imagePath={student.avatar_path}
                          className="h-9 w-9"
                        />
                        <div className="min-w-0">
                          <div className="truncate font-medium">{student.name}</div>
                          <div className="truncate text-xs text-[var(--text-secondary)]">
                            学号 {student.student_number || '未填写'}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-md bg-[#FAFAFA] px-3 py-8 text-center text-sm text-[var(--text-secondary)]">
                      暂无待抽学生
                    </div>
                  )}
                </div>

                {availableStudents.length > 24 && (
                  <div className="mt-3 shrink-0 text-center text-xs text-[var(--text-secondary)]">
                    还有 {availableStudents.length - 24} 人未显示
                  </div>
                )}
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
