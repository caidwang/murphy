import { FeedbackType } from 'src/main/models/RollcallRecord'
import { ThumbsDown, ThumbsUp, Trophy, Zap } from 'lucide-react'
import type { ReactElement } from 'react'
import passBadge from '@renderer/assets/rollcall/pass-badge-ui.png'

interface Props {
  studentName: string
  mode?: 'classic' | 'magic'
  onFeedback: (feedback: FeedbackType, multiplier?: number) => void
}

export function RollcallFeedback({
  studentName,
  mode = 'classic',
  onFeedback
}: Props): ReactElement {
  if (mode === 'magic') {
    const multiplierOptions = [
      {
        label: '挑战成功',
        multiplier: 1,
        feedback: 'like' as const,
        icon: Trophy,
        tone: 'border-[#BFECD9] bg-[#ECFFF7] text-[#145344]',
        caption: '答对后可移出牌堆'
      },
      {
        label: '×3',
        multiplier: 3,
        feedback: 'angry' as const,
        icon: Zap,
        tone: 'border-[#F8C85A] bg-[#FFF4D8] text-[#6D4A05]',
        caption: '提高下次命中',
        spell: '命运回响',
        frame:
          'border-[#F8C85A]/85 bg-[radial-gradient(circle_at_22%_50%,rgba(248,200,90,0.35),transparent_36%),linear-gradient(135deg,#FFF7DF_0%,#FFE5A4_48%,#FFF1CC_100%)] text-[#6D4A05] shadow-[0_12px_30px_rgba(109,74,5,0.16)] hover:shadow-[0_18px_34px_rgba(248,200,90,0.24)]',
        seal: 'border-[#B67811]/35 bg-[#7A5209] text-[#FFE9A6] shadow-[inset_0_0_0_6px_rgba(255,232,166,0.14),0_10px_24px_rgba(122,82,9,0.25)]',
        accent: 'from-transparent via-[#B67811]/70 to-transparent'
      },
      {
        label: '×5',
        multiplier: 5,
        feedback: 'angry' as const,
        icon: Zap,
        tone: 'border-[#FF8A68] bg-[#FFF0EA] text-[#8A2E18]',
        caption: '强力加入牌堆',
        spell: '强力追击',
        frame:
          'border-[#FF8A68]/90 bg-[radial-gradient(circle_at_22%_50%,rgba(255,113,82,0.28),transparent_36%),linear-gradient(135deg,#FFF1EA_0%,#FFD5C8_48%,#FFF5EF_100%)] text-[#8A2E18] shadow-[0_12px_30px_rgba(138,46,24,0.16)] hover:shadow-[0_18px_34px_rgba(255,113,82,0.22)]',
        seal: 'border-[#A43A21]/30 bg-[#9A321C] text-[#FFD8C8] shadow-[inset_0_0_0_6px_rgba(255,216,200,0.13),0_10px_24px_rgba(138,46,24,0.24)]',
        accent: 'from-transparent via-[#B55239]/65 to-transparent'
      }
    ]

    return (
      <div className="rounded-lg border border-[#F8C85A]/40 bg-[#102F34]/95 p-3 shadow-[0_18px_42px_rgba(0,0,0,0.22)]">
        <div className="mb-3">
          <div>
            <p className="text-sm font-bold text-[#F8C85A]">记录反馈</p>
            <h3 className="mt-0.5 text-xl font-black text-[#FFF7E1]">{studentName}</h3>
          </div>
        </div>

        <div className="grid gap-2">
          {multiplierOptions.map((option) => {
            const Icon = option.icon
            if (option.multiplier === 1) {
              return (
                <button
                  key={option.label}
                  onClick={() => onFeedback(option.feedback, option.multiplier)}
                  className="group relative min-h-[134px] overflow-hidden rounded-xl border border-[#F8C85A]/70 bg-[radial-gradient(circle_at_24%_42%,rgba(248,200,90,0.25),transparent_34%),linear-gradient(135deg,#EFFFF8_0%,#CFFBE7_50%,#FFF4D8_100%)] p-0 text-left text-[#124D43] shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(248,200,90,0.23)]"
                >
                  <div className="absolute -left-2 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-[#F8C85A]/20 blur-2xl" />
                  <img
                    src={passBadge}
                    alt="PASS"
                    className="absolute left-3 top-1/2 h-28 w-28 -translate-y-1/2 object-contain drop-shadow-[0_12px_20px_rgba(13,46,42,0.24)] transition group-hover:scale-105"
                  />
                  <div className="relative z-10 ml-[122px] flex min-h-[134px] flex-col justify-center py-4 pr-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-[#B67811]">
                        <Trophy className="h-4 w-4" />
                        PASS
                      </div>
                      <span className="text-xs font-black uppercase tracking-wide text-[#145344]">
                        MAGIC
                      </span>
                    </div>
                    <div className="text-2xl font-black leading-none tracking-normal text-[#124D43]">
                      {option.label}
                    </div>
                    <div className="mt-2 text-sm font-extrabold leading-snug text-[#4F796D]">
                      {option.caption}
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-x-4 bottom-2 h-px bg-gradient-to-r from-transparent via-[#F8C85A]/80 to-transparent" />
                </button>
              )
            }

            return (
              <button
                key={option.label}
                onClick={() => onFeedback(option.feedback, option.multiplier)}
                className={`group relative min-h-[116px] overflow-hidden rounded-xl border p-0 text-left transition hover:-translate-y-0.5 ${option.frame}`}
              >
                <div className="absolute -left-8 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-current opacity-10 blur-2xl" />
                <div
                  className={`absolute left-4 top-1/2 flex h-20 w-20 -translate-y-1/2 items-center justify-center rounded-full border ${option.seal}`}
                >
                  <div className="absolute inset-2 rounded-full border border-current/20" />
                  <Zap className="absolute -top-1 right-2 h-5 w-5 rotate-12" />
                  <span className="relative text-4xl font-black leading-none tracking-normal">
                    {option.label}
                  </span>
                </div>
                <div className="relative z-10 ml-[112px] flex min-h-[116px] flex-col justify-center py-4 pr-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide opacity-80">
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </div>
                    <span className="text-xs font-black uppercase tracking-wide">MAGIC</span>
                  </div>
                  <div className="text-xl font-black leading-none tracking-normal">
                    {option.spell}
                  </div>
                  <div className="mt-2 text-sm font-extrabold leading-snug opacity-80">
                    {option.caption}
                  </div>
                </div>
                <div
                  className={`pointer-events-none absolute inset-x-4 bottom-2 h-px bg-gradient-to-r ${option.accent}`}
                />
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-[var(--border-color)] bg-white p-4">
      <div className="mb-3">
        <p className="text-sm text-[var(--text-secondary)]">记录反馈</p>
        <h3 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">{studentName}</h3>
      </div>

      <div className="grid gap-3">
        <button
          onClick={() => onFeedback('like')}
          className="flex items-center gap-3 rounded-md border border-[#B7E2CA] bg-[#F2FBF5] p-3 text-left transition-colors hover:bg-[#E7F7ED]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#24945A] text-white">
            <ThumbsUp className="h-5 w-5" />
          </div>
          <span>
            <span className="block font-semibold text-[var(--text-primary)]">表现很好</span>
            <span className="mt-1 block text-sm text-[var(--text-secondary)]">加入红榜统计</span>
          </span>
        </button>

        <button
          onClick={() => onFeedback('angry')}
          className="flex items-center gap-3 rounded-md border border-[#F3C7B8] bg-[#FFF6F2] p-3 text-left transition-colors hover:bg-[#FFEDE6]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#D96D3D] text-white">
            <ThumbsDown className="h-5 w-5" />
          </div>
          <span>
            <span className="block font-semibold text-[var(--text-primary)]">需要改进</span>
            <span className="mt-1 block text-sm text-[var(--text-secondary)]">加入关注统计</span>
          </span>
        </button>
      </div>
    </div>
  )
}
