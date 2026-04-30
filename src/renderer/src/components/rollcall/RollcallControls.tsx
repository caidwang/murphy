import { Button } from '../ui/button'
import { Play, RotateCcw, Square } from 'lucide-react'
import type { ReactElement } from 'react'

interface Props {
  isRolling: boolean
  onToggle: () => void
  onReset: () => void
  disabled?: boolean
  canReset?: boolean
}

export function RollcallControls({
  isRolling,
  onToggle,
  onReset,
  disabled,
  canReset
}: Props): ReactElement {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        onClick={onToggle}
        disabled={disabled}
        className={`h-12 flex-1 text-base ${
          isRolling
            ? 'bg-[#D84C3E] text-white hover:bg-[#C43F32]'
            : 'bg-[var(--text-primary)] text-white hover:bg-[#2E2D29]'
        }`}
      >
        {isRolling ? <Square className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        {isRolling ? '停止抽取' : '开始点名'}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        disabled={!canReset || isRolling}
        className="h-12 sm:w-32"
      >
        <RotateCcw className="h-4 w-4" />
        重置本轮
      </Button>
    </div>
  )
}
