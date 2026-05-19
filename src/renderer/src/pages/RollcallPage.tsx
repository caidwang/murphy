import { useState, useEffect, useRef, useCallback } from 'react'
import type { ReactElement } from 'react'
import { Student } from 'src/main/models/Student'
import { Classroom } from 'src/main/models/Classroom'
import { FeedbackType } from 'src/main/models/RollcallRecord'
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  History,
  RotateCcw,
  Settings,
  Sparkles,
  WandSparkles
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { RollcallFeedback } from '~/components/rollcall/RollcallFeedback'
import { StudentAvatar } from '~/components/student/StudentAvatar'
import beaverLike from '@renderer/assets/mascot/beaver-like.png'
import beaverNo from '@renderer/assets/mascot/beaver-no.png'

interface Props {
  classroomId: number
  onNavigateBack: () => void
  onNavigateToStats: () => void
  onNavigateToSettings: () => void
}

type RollPhase = 'idle' | 'turning-back' | 'shuffling' | 'revealing'
type DrawMode = 'classic' | 'magic'
type MascotReaction = 'pass' | 'fail'

export default function RollcallPage({
  classroomId,
  onNavigateBack,
  onNavigateToStats,
  onNavigateToSettings
}: Props): ReactElement {
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [rollPhase, setRollPhase] = useState<RollPhase>('idle')
  const [drawMode, setDrawMode] = useState<DrawMode>('magic')
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentRecordId, setCurrentRecordId] = useState<number | null>(null)
  const [magicWeights, setMagicWeights] = useState<Record<number, number>>({})
  const [drawnStudentIds, setDrawnStudentIds] = useState<Record<number, boolean>>({})
  const [recentStudents, setRecentStudents] = useState<Student[]>([])
  const [mascotReaction, setMascotReaction] = useState<MascotReaction | null>(null)
  const [settings, setSettings] = useState({
    allowRepeat: true,
    noRepeatCorrectOnly: true,
    scrollSpeed: 'medium'
  })

  const rollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mascotReactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentStudentRef = useRef<Student | null>(null)

  const getMagicWeight = useCallback(
    (studentId: number): number => magicWeights[studentId] || 1,
    [magicWeights]
  )
  const availableStudents = settings.allowRepeat
    ? students
    : students.filter((student) => !drawnStudentIds[student.id])
  const magicDeckCount = availableStudents.reduce(
    (total, student) => total + getMagicWeight(student.id),
    0
  )
  const extraMagicCards = Math.max(0, magicDeckCount - availableStudents.length)
  const drawnCount = Object.values(drawnStudentIds).filter(Boolean).length
  const isEmpty = students.length === 0
  const canDraw = !isRolling && !isEmpty && availableStudents.length > 0

  const clearRollTimers = useCallback((): void => {
    if (rollIntervalRef.current) {
      clearInterval(rollIntervalRef.current)
      rollIntervalRef.current = null
    }

    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current)
      flipTimeoutRef.current = null
    }

    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current)
      revealTimeoutRef.current = null
    }

    if (settleTimeoutRef.current) {
      clearTimeout(settleTimeoutRef.current)
      settleTimeoutRef.current = null
    }

    if (mascotReactionTimeoutRef.current) {
      clearTimeout(mascotReactionTimeoutRef.current)
      mascotReactionTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const classroomData = await window.electron.ipcRenderer.invoke(
        'classrooms:findById',
        classroomId
      )
      setClassroom(classroomData)

      const studentList = await window.electron.ipcRenderer.invoke(
        'students:getByClassroomId',
        classroomId
      )
      setStudents(studentList)
      const rollcallStates = (await window.electron.ipcRenderer.invoke(
        'rollcall:getStudentStates',
        classroomId
      )) as Array<{ student_id: number; weight: number; is_drawn: 0 | 1 }>
      setMagicWeights(
        rollcallStates.reduce<Record<number, number>>((weights, state) => {
          if (state.weight > 1) weights[state.student_id] = state.weight
          return weights
        }, {})
      )
      setDrawnStudentIds(
        rollcallStates.reduce<Record<number, boolean>>((drawnIds, state) => {
          if (state.is_drawn === 1) drawnIds[state.student_id] = true
          return drawnIds
        }, {})
      )
      setRecentStudents([])
      setCurrentStudent(null)
      currentStudentRef.current = null

      const rollcallSettings = await window.electron.ipcRenderer.invoke('settings:get')
      if (rollcallSettings) {
        setSettings({
          allowRepeat: rollcallSettings.allowRepeat ?? true,
          noRepeatCorrectOnly: rollcallSettings.noRepeatCorrectOnly ?? true,
          scrollSpeed: rollcallSettings.scrollSpeed ?? 'medium'
        })
      }
    }

    void fetchData()
  }, [classroomId])

  useEffect(() => {
    return () => {
      clearRollTimers()
    }
  }, [clearRollTimers])

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

  const getRevealDuration = useCallback((): number => {
    switch (settings.scrollSpeed) {
      case 'slow':
        return 2300
      case 'fast':
        return 1450
      default:
        return 1800
    }
  }, [settings.scrollSpeed])

  const pickStudentFromDeck = useCallback((): Student | undefined => {
    if (availableStudents.length === 0) return undefined

    if (drawMode === 'classic') {
      return availableStudents[Math.floor(Math.random() * availableStudents.length)]
    }

    const totalWeight = availableStudents.reduce(
      (total, student) => total + getMagicWeight(student.id),
      0
    )
    let ticket = Math.random() * totalWeight

    for (const student of availableStudents) {
      ticket -= getMagicWeight(student.id)
      if (ticket <= 0) return student
    }

    return availableStudents[availableStudents.length - 1]
  }, [availableStudents, drawMode, getMagicWeight])

  const recordRollcall = useCallback(
    async (selectedStudent?: Student): Promise<void> => {
      setIsRolling(false)
      setRollPhase('idle')

      const finalStudent = selectedStudent || currentStudentRef.current || pickStudentFromDeck()

      if (!finalStudent) return

      setCurrentStudent(finalStudent)
      currentStudentRef.current = finalStudent

      const recordId = await window.electron.ipcRenderer.invoke(
        'rollcall:record',
        finalStudent.id,
        classroomId,
        null
      )
      setCurrentRecordId(recordId)
      setShowFeedback(true)
      setRecentStudents((students) =>
        [finalStudent, ...students.filter((student) => student.id !== finalStudent.id)].slice(0, 5)
      )
    },
    [classroomId, pickStudentFromDeck]
  )

  const startRollcall = useCallback((): void => {
    if (availableStudents.length === 0) return

    clearRollTimers()
    setIsRolling(true)
    setRollPhase('turning-back')
    setShowFeedback(false)
    setMascotReaction(null)
    setCurrentRecordId(null)

    flipTimeoutRef.current = setTimeout(() => {
      setRollPhase('shuffling')

      rollIntervalRef.current = setInterval(() => {
        const nextStudent = pickStudentFromDeck()
        if (!nextStudent) return
        currentStudentRef.current = nextStudent
      }, getScrollInterval())

      revealTimeoutRef.current = setTimeout(() => {
        if (rollIntervalRef.current) {
          clearInterval(rollIntervalRef.current)
          rollIntervalRef.current = null
        }

        const finalStudent = pickStudentFromDeck()
        if (!finalStudent) return
        setCurrentStudent(finalStudent)
        currentStudentRef.current = finalStudent
        setRollPhase('revealing')

        settleTimeoutRef.current = setTimeout(() => {
          void recordRollcall(finalStudent)
        }, 760)
      }, getRevealDuration())
    }, 460)
  }, [
    availableStudents,
    clearRollTimers,
    getRevealDuration,
    getScrollInterval,
    pickStudentFromDeck,
    recordRollcall
  ])

  const triggerMascotReaction = useCallback((reaction: MascotReaction): void => {
    if (mascotReactionTimeoutRef.current) {
      clearTimeout(mascotReactionTimeoutRef.current)
    }

    setMascotReaction(null)
    requestAnimationFrame(() => {
      setMascotReaction(reaction)
      mascotReactionTimeoutRef.current = setTimeout(() => {
        setMascotReaction(null)
        mascotReactionTimeoutRef.current = null
      }, 1800)
    })
  }, [])

  const handleFeedback = async (feedback: FeedbackType, multiplier = 1): Promise<void> => {
    if (currentRecordId) {
      await window.electron.ipcRenderer.invoke('rollcall:updateFeedback', currentRecordId, feedback)
    }
    if (currentStudent) {
      const nextWeight =
        drawMode === 'magic' ? Math.max(1, (magicWeights[currentStudent.id] || 1) * multiplier) : 1
      const shouldRemoveFromDeck =
        !settings.allowRepeat && (!settings.noRepeatCorrectOnly || feedback === 'like')

      setDrawnStudentIds((studentIds) => ({
        ...studentIds,
        [currentStudent.id]: shouldRemoveFromDeck
      }))

      await window.electron.ipcRenderer.invoke('rollcall:saveStudentState', {
        classroomId,
        studentId: currentStudent.id,
        weight: nextWeight,
        isDrawn: shouldRemoveFromDeck
      })
    }
    if (drawMode === 'magic' && currentStudent) {
      setMagicWeights((weights) => ({
        ...weights,
        [currentStudent.id]: Math.max(1, (weights[currentStudent.id] || 1) * multiplier)
      }))
    }
    triggerMascotReaction(feedback === 'like' ? 'pass' : 'fail')
    setShowFeedback(false)
    setCurrentStudent(null)
    currentStudentRef.current = null
    setCurrentRecordId(null)
  }

  const handleResetRound = async (): Promise<void> => {
    clearRollTimers()
    await window.electron.ipcRenderer.invoke('rollcall:resetStudentStates', classroomId)
    setIsRolling(false)
    setRollPhase('idle')
    setMagicWeights({})
    setDrawnStudentIds({})
    setRecentStudents([])
    setShowFeedback(false)
    setMascotReaction(null)
    setCurrentStudent(null)
    currentStudentRef.current = null
    setCurrentRecordId(null)
  }

  const selectedStudentNumber = currentStudent?.student_number || '未填写'
  const isCardBackVisible = rollPhase === 'turning-back' || rollPhase === 'shuffling'
  const isCardRevealing = rollPhase === 'revealing'
  const modeLabel = drawMode === 'magic' ? '魔法模式' : '经典放回'
  const mascotReactionMeta =
    mascotReaction === 'pass'
      ? {
          image: beaverLike,
          alt: '海狸先生点赞',
          title: '挑战成功',
          tone: 'rollcall-mascot-pass'
        }
      : mascotReaction === 'fail'
        ? {
            image: beaverNo,
            alt: '海狸先生否定',
            title: '继续加油',
            tone: 'rollcall-mascot-fail'
          }
        : null

  return (
    <div className="rollcall-magic-bg flex h-screen w-full overflow-hidden text-[#FFF7E1]">
      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4 lg:px-6">
        <header className="mx-auto flex w-full max-w-7xl shrink-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNavigateBack}
              aria-label="返回班级详情"
              className="h-11 w-11 rounded-full border border-white/15 bg-white/10 text-[#FFF7E1] hover:bg-white/15 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold leading-tight text-[#FFF7E1]">随机点名</h1>
              <p className="mt-1 truncate text-sm font-medium text-[#AEEBDA]">
                {classroom?.name || '当前班级'} · {students.length} 位同学
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              onClick={onNavigateToStats}
              className="h-11 rounded-full border border-white/15 bg-white/10 px-4 text-[#FFF7E1] hover:bg-white/15 hover:text-white"
            >
              <BarChart3 className="h-4 w-4" />
              数据
            </Button>
            <Button
              variant="ghost"
              onClick={onNavigateToSettings}
              className="h-11 rounded-full border border-white/15 bg-white/10 px-4 text-[#FFF7E1] hover:bg-white/15 hover:text-white"
            >
              <Settings className="h-4 w-4" />
              设置
            </Button>
          </div>
        </header>

        <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-1 gap-4 py-4 lg:grid-cols-[250px_minmax(0,1fr)_280px]">
          <aside className="hidden min-h-0 flex-col justify-center lg:flex">
            <section className="rounded-lg border border-[#F8C85A]/25 bg-[#0B2C31]/70 p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#FFF7E1]">待抽卡组</h2>
                <span className="rounded-full bg-[#F8C85A]/15 px-3 py-1 text-xs font-semibold text-[#F8C85A]">
                  {availableStudents.length} 张
                </span>
              </div>

              <div className="relative mx-auto mb-6 h-36 w-28">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="absolute inset-0 rounded-lg border border-[#F8C85A]/35 bg-gradient-to-br from-[#FFF4D8] via-[#F9DCA0] to-[#E88C68] shadow-lg"
                    style={{
                      transform: `translate(${index * 7}px, ${index * -5}px) rotate(${index * 4 - 8}deg)`
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center rounded-lg border border-[#FFF4D8]/70 bg-[#123E44]/90 text-[#F8C85A] shadow-xl">
                  <WandSparkles className="h-10 w-10" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-white/10 p-3">
                  <div className="text-xs font-medium text-[#AEEBDA]">学生</div>
                  <div className="mt-1 text-2xl font-bold text-white">{students.length}</div>
                </div>
                <div className="rounded-md bg-white/10 p-3">
                  <div className="text-xs font-medium text-[#AEEBDA]">已移出</div>
                  <div className="mt-1 text-2xl font-bold text-white">{drawnCount}</div>
                </div>
              </div>

              <div className="mt-4 rounded-md border border-white/15 bg-white/10 px-3 py-3">
                <span>
                  <span className="block text-sm font-semibold text-[#FFF7E1]">{modeLabel}</span>
                  <span className="mt-1 block text-xs text-[#AEEBDA]">
                    {drawMode === 'magic' ? '倍率反馈会影响下次抽取' : '每次等权抽取，抽完立即放回'}
                  </span>
                </span>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() => void handleResetRound()}
                disabled={(extraMagicCards === 0 && drawnCount === 0) || isRolling}
                className="mt-3 h-11 w-full rounded-md border border-white/15 bg-white/10 text-[#FFF7E1] hover:bg-white/15 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
                重置牌堆
              </Button>
            </section>
          </aside>

          <section className="relative grid min-h-0 grid-rows-[minmax(0,1fr)_auto] items-center overflow-hidden rounded-lg border border-[#F8C85A]/20 bg-[#0A2A30]/55 px-4 py-4 shadow-2xl shadow-black/20 backdrop-blur sm:px-8">
            <div className="rollcall-orbit rollcall-orbit-one" />
            <div className="rollcall-orbit rollcall-orbit-two" />
            {rollPhase === 'shuffling' && (
              <>
                <div className="rollcall-name-ring rollcall-name-ring-slow">
                  {availableStudents.slice(0, 12).map((student, index) => (
                    <div
                      key={student.id}
                      className="rollcall-orbit-name-chip"
                      style={{
                        transform: `rotate(${index * 30}deg) translateX(min(30vw, 270px)) rotate(-${index * 30}deg)`
                      }}
                    >
                      {student.name}
                    </div>
                  ))}
                </div>
                <div className="rollcall-name-ring rollcall-name-ring-fast">
                  {availableStudents.slice(12, 24).map((student, index) => (
                    <div
                      key={student.id}
                      className="rollcall-orbit-name-chip rollcall-orbit-name-chip-soft"
                      style={{
                        transform: `rotate(${index * 30 + 15}deg) translateX(min(25vw, 220px)) rotate(-${index * 30 + 15}deg)`
                      }}
                    >
                      {student.name}
                    </div>
                  ))}
                </div>
              </>
            )}

            {rollPhase === 'shuffling' && (
              <div className="rollcall-shuffle-deck" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => {
                  const student = availableStudents[index % availableStudents.length]
                  return (
                    <div key={index} className="rollcall-shuffle-card">
                      <div className="rollcall-shuffle-card-mark">
                        <WandSparkles className="h-5 w-5" />
                      </div>
                      <span>{student?.name || '抽取'}</span>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="relative z-10 flex min-h-0 flex-col items-center justify-center">
              <div
                className={`rollcall-card-shell relative h-[min(48vh,470px)] min-h-[380px] w-auto aspect-[0.72] max-h-[470px] ${
                  rollPhase === 'shuffling'
                    ? 'rollcall-card-is-shuffling'
                    : !isRolling && !currentStudent
                      ? 'rollcall-card-idle'
                      : ''
                }`}
              >
                <div
                  className={`rollcall-card-inner ${
                    isCardBackVisible ? 'rollcall-card-back-visible' : ''
                  } ${isCardRevealing ? 'rollcall-card-reveal-flip' : ''}`}
                >
                  <div className="rollcall-card-face rollcall-card-front flex flex-col items-center justify-between rounded-[22px] border border-[#F8C85A]/70 bg-[#FFF4D8] px-6 py-6 text-center text-[#173E42] shadow-[0_28px_70px_rgba(0,0,0,0.35)]">
                    <div className="absolute inset-4 rounded-[18px] border border-[#C8913F]/35" />
                    <div className="rollcall-card-badge relative z-10 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {isCardRevealing ? '翻牌揭晓' : currentStudent ? '今日被点到' : '准备抽取'}
                    </div>

                    <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center py-4">
                      <div className="relative mb-5">
                        {currentStudent && !isRolling && (
                          <div className="absolute -inset-6 rounded-full bg-[#F8C85A]/25 blur-2xl" />
                        )}
                        <StudentAvatar
                          name={currentStudent?.name || '?'}
                          seed={
                            currentStudent
                              ? `${currentStudent.id}-${currentStudent.student_number}`
                              : 'magic-card'
                          }
                          imagePath={currentStudent?.avatar_path}
                          className="relative h-24 w-24 border-4 border-[#F8C85A]/70 text-5xl shadow-xl"
                        />
                      </div>
                      <p className="mb-2 text-sm font-semibold text-[#B46A45]">
                        {isCardRevealing
                          ? '命运卡牌已经锁定'
                          : currentStudent
                            ? '请准备回答问题'
                            : '点击抽取一张学生卡'}
                      </p>
                      <h2 className="max-w-full break-words text-5xl font-black leading-tight text-[#173E42]">
                        {currentStudent?.name || '准备点名'}
                      </h2>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 rounded-full border border-[#D7A75A]/50 bg-white/55 px-4 py-2 text-sm font-semibold text-[#6E5A32]">
                      学号 {currentStudent ? selectedStudentNumber : '--'}
                    </div>
                  </div>

                  <div className="rollcall-card-face rollcall-card-back flex flex-col items-center justify-center rounded-[22px] border border-[#F8C85A]/75 bg-[#123E44] px-9 py-9 text-center text-[#F8C85A] shadow-[0_28px_70px_rgba(0,0,0,0.35)]">
                    <div className="absolute inset-4 rounded-[18px] border border-[#F8C85A]/35" />
                    <div className="rollcall-card-back-pattern" />
                    <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-[#F8C85A]/50 bg-[#0B2C31] shadow-[0_0_38px_rgba(248,200,90,0.22)]">
                      <WandSparkles className="h-10 w-10" />
                    </div>
                    <div className="relative z-10 mt-6 text-2xl font-black tracking-normal">
                      {rollPhase === 'turning-back' ? '卡牌翻面' : '卡组洗牌中'}
                    </div>
                    <div className="relative z-10 mt-3 text-sm font-semibold text-[#AEEBDA]">
                      星光正在寻找下一位同学
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={startRollcall}
                disabled={!canDraw}
                className="rollcall-magic-button relative z-10 mt-4 h-16 min-w-[280px] rounded-full bg-gradient-to-r from-[#FF7A59] via-[#F79B50] to-[#F8C85A] px-10 text-xl font-black text-[#173E42] shadow-[0_18px_40px_rgba(248,120,82,0.38)] transition hover:scale-[1.02] hover:brightness-105 active:scale-[0.97] disabled:opacity-60 sm:min-w-[330px]"
              >
                <WandSparkles className="h-6 w-6" />
                {isRolling ? '抽取中...' : currentStudent ? '再抽一次' : '抽取卡牌'}
              </Button>

              <div className="relative z-10 mt-3 flex rounded-full border border-white/15 bg-white/10 p-1 text-sm font-semibold text-[#AEEBDA]">
                {[
                  { value: 'classic', label: '经典' },
                  { value: 'magic', label: '魔法' }
                ].map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    disabled={isRolling}
                    onClick={() => setDrawMode(mode.value as DrawMode)}
                    className={`rounded-full px-5 py-2 transition ${
                      drawMode === mode.value
                        ? 'bg-[#FFF4D8] text-[#173E42] shadow'
                        : 'hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {isEmpty && (
              <div className="relative z-10 mt-4 rounded-md border border-[#F8C85A]/30 bg-[#FFF4D8]/95 px-5 py-3 text-center text-sm font-semibold text-[#173E42]">
                暂无学生，请先在班级中添加学生。
              </div>
            )}
            {!isEmpty && availableStudents.length === 0 && (
              <div className="relative z-10 mt-4 rounded-md border border-[#F8C85A]/30 bg-[#FFF4D8]/95 px-5 py-3 text-center text-sm font-semibold text-[#173E42]">
                当前牌堆已抽完，请重置牌堆后继续。
              </div>
            )}
          </section>

          <aside className="hidden min-h-0 flex-col justify-center gap-3 lg:flex">
            {showFeedback && currentStudent && (
              <RollcallFeedback
                studentName={currentStudent.name}
                mode={drawMode}
                onFeedback={handleFeedback}
              />
            )}

            <section className="flex max-h-full min-h-0 flex-col rounded-lg border border-[#F8C85A]/25 bg-[#0B2C31]/70 p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-semibold text-[#FFF7E1]">
                  <History className="h-4 w-4 text-[#F8C85A]" />
                  最近点到
                </h2>
                <span className="text-xs font-medium text-[#AEEBDA]">最多 5 位</span>
              </div>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                {recentStudents.length > 0 ? (
                  recentStudents.map((student, index) => (
                    <div
                      key={`${student.id}-${index}`}
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-3 py-3 shadow-lg shadow-black/10"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F8C85A] text-sm font-black text-[#173E42]">
                        {index + 1}
                      </div>
                      <StudentAvatar
                        name={student.name}
                        seed={`${student.id}-${student.student_number}`}
                        imagePath={student.avatar_path}
                        className="h-10 w-10"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-[#FFF7E1]">
                          {student.name}
                        </div>
                        <div className="truncate text-xs text-[#AEEBDA]">
                          学号 {student.student_number || '未填写'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-white/20 px-4 py-8 text-center text-sm text-[#AEEBDA]">
                    抽取后会显示最近记录
                  </div>
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-md bg-white/10 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#AEEBDA]">
                    <CheckCircle2 className="h-4 w-4" />
                    当前状态
                  </div>
                  <div className="mt-2 text-lg font-bold text-white">
                    {isRolling ? '抽取中' : currentStudent ? '已揭晓' : '待开始'}
                  </div>
                </div>
                <div className="rounded-md bg-white/10 p-3">
                  <div className="text-xs font-medium text-[#AEEBDA]">参与人数</div>
                  <div className="mt-2 text-2xl font-black text-white">{students.length}</div>
                </div>
              </div>
            </section>
          </aside>

          <div className="grid grid-cols-2 gap-3 lg:hidden">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDrawMode(drawMode === 'magic' ? 'classic' : 'magic')}
              disabled={isRolling}
              className="h-12 rounded-md border border-white/15 bg-white/10 text-[#FFF7E1] hover:bg-white/15 hover:text-white"
            >
              {modeLabel}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => void handleResetRound()}
              disabled={(extraMagicCards === 0 && drawnCount === 0) || isRolling}
              className="h-12 rounded-md border border-white/15 bg-white/10 text-[#FFF7E1] hover:bg-white/15 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              重置牌堆
            </Button>
          </div>
        </div>
      </main>

      {mascotReactionMeta && (
        <div className={`rollcall-mascot-burst ${mascotReactionMeta.tone}`} aria-live="polite">
          <div className="rollcall-mascot-card">
            <div className="rollcall-mascot-glow" />
            <div className="rollcall-mascot-copy">
              <div className="rollcall-mascot-title">{mascotReactionMeta.title}</div>
            </div>
            <img
              src={mascotReactionMeta.image}
              alt={mascotReactionMeta.alt}
              className="rollcall-mascot-image"
            />
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="rollcall-spark absolute h-1.5 w-1.5 rounded-full bg-[#F8C85A]"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 53) % 100}%`,
              animationDelay: `${index * 0.22}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}
