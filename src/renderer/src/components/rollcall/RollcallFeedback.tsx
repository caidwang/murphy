import { FeedbackType } from 'src/main/models/RollcallRecord'
import { ShieldCheck, ThumbsDown, ThumbsUp, Zap } from 'lucide-react'
import type { ReactElement } from 'react'

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
        label: '不加倍',
        multiplier: 1,
        feedback: null,
        icon: ShieldCheck,
        tone: 'border-[#BFECD9] bg-[#ECFFF7] text-[#145344]',
        caption: '保持当前牌堆'
      },
      {
        label: '×3',
        multiplier: 3,
        feedback: 'angry' as const,
        icon: Zap,
        tone: 'border-[#F8C85A] bg-[#FFF4D8] text-[#6D4A05]',
        caption: '提高下次命中'
      },
      {
        label: '×5',
        multiplier: 5,
        feedback: 'angry' as const,
        icon: Zap,
        tone: 'border-[#FF8A68] bg-[#FFF0EA] text-[#8A2E18]',
        caption: '强力加入牌堆'
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
            return (
              <button
                key={option.label}
                onClick={() => onFeedback(option.feedback, option.multiplier)}
                className={`group rounded-lg border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(248,200,90,0.2)] ${option.tone}`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-black uppercase tracking-wide">MAGIC</span>
                </div>
                <div className="text-3xl font-black leading-none tracking-normal">
                  {option.label}
                </div>
                <div className="mt-1 text-sm font-extrabold opacity-80">{option.caption}</div>
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
