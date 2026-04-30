import { Classroom } from 'src/main/models/Classroom'
import type { ReactElement } from 'react'
import defaultClassroomBackground from '@renderer/assets/default-classroom-background.svg'
import { Card, CardContent } from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'

interface Props {
  classroom: Classroom
  studentCount: number
  onCardClick: () => void
  onEditClick?: () => void
  onDeleteClick: () => void
}

export function ClassCard({
  classroom,
  studentCount,
  onCardClick,
  onEditClick,
  onDeleteClick
}: Props): ReactElement {
  return (
    <Card className="card-shadow-hover overflow-hidden" onClick={onCardClick}>
      <div className="h-40 relative bg-[#F3F7F4]">
        <img
          src={classroom.background_image_path || defaultClassroomBackground}
          alt={classroom.name}
          className="h-full w-full object-cover"
        />

        {!classroom.background_image_path && classroom.theme_color && (
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundColor: classroom.theme_color }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="w-8 h-8 rounded-full p-0">
                ...
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              {onEditClick && <DropdownMenuItem onClick={onEditClick}>编辑</DropdownMenuItem>}
              <DropdownMenuItem onClick={onDeleteClick} className="text-red-600">
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg font-bold">{classroom.name}</h3>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {studentCount}名学生
          </p>
        </div>
      </div>
      <CardContent className="p-5">
        <div
          className="flex items-center justify-between text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span>
            <i className="fas fa-users mr-1"></i> {studentCount}人
          </span>
          <span>
            <i className="fas fa-calendar mr-1"></i> {new Date(classroom.created_at).getFullYear()}
            年
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
