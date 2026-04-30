import type { ReactElement } from 'react'
import { cn } from '~/lib/utils'

const AVATAR_COLORS = [
  { background: '#DDEAD8', foreground: '#365442' },
  { background: '#D9E7EF', foreground: '#344F62' },
  { background: '#E8DFCF', foreground: '#5B4A34' },
  { background: '#EADADA', foreground: '#654343' },
  { background: '#DDDDF0', foreground: '#424667' },
  { background: '#D8E7E1', foreground: '#355449' },
  { background: '#EFE3C7', foreground: '#5D5132' },
  { background: '#E4DCE8', foreground: '#55455E' }
]

interface Props {
  name: string
  seed?: string | number
  imagePath?: string | null
  className?: string
}

function hashString(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }
  return hash
}

function getStudentAvatarColors(seed: string | number): {
  background: string
  foreground: string
} {
  return AVATAR_COLORS[hashString(String(seed)) % AVATAR_COLORS.length]
}

function getStudentAvatarInitial(name: string): string {
  return name.trim().charAt(0) || '?'
}

export function StudentAvatar({ name, seed, imagePath, className }: Props): ReactElement {
  const colors = getStudentAvatarColors(seed ?? name)

  if (imagePath) {
    return (
      <img
        src={imagePath}
        alt={name}
        className={cn('h-10 w-10 rounded-full object-cover', className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
        className
      )}
      style={{
        backgroundColor: colors.background,
        color: colors.foreground
      }}
      aria-label={`${name}的默认头像`}
    >
      {getStudentAvatarInitial(name)}
    </div>
  )
}
