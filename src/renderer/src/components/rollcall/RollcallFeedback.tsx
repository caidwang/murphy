import { FeedbackType } from 'src/main/models/RollcallRecord'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import type { ReactElement } from 'react'

interface Props {
  studentName: string
  onFeedback: (feedback: FeedbackType) => void
}

export function RollcallFeedback({ studentName, onFeedback }: Props): ReactElement {
  return (
    <div className="rounded-lg border border-[var(--border-color)] bg-white p-4">
      <div className="mb-3">
        <p className="text-sm text-[var(--text-secondary)]">记录反馈</p>
        <h3 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">{studentName}</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
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
