import { Classroom } from 'src/main/models/Classroom';
import {
  Card,
  CardContent,
} from '~/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from '~/components/ui/button';

interface Props {
  classroom: Classroom;
  studentCount: number;
  onCardClick: () => void;
  onEditClick?: () => void;
  onDeleteClick: () => void;
}

export function ClassCard({
  classroom,
  studentCount,
  onCardClick,
  onEditClick,
  onDeleteClick,
}: Props) {
  // Generate default gradient if no background
  const hasBackground = classroom.background_image_path || classroom.theme_color;

  return (
    <Card className="card-shadow-hover overflow-hidden" onClick={onCardClick}>
      <div
        className="h-40 relative"
        style={{
          background: hasBackground
            ? undefined
            : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-primary-dark, var(--color-primary)) 100%)'
        }}
      >
        {classroom.background_image_path ? (
          <img
            src={classroom.background_image_path}
            alt={classroom.name}
            className="w-full h-full object-cover opacity-60"
          />
        ) : classroom.theme_color ? (
          <div className="absolute inset-0 opacity-80" style={{ backgroundColor: classroom.theme_color }} />
        ) : null}

        {/* Default pattern overlay */}
        {!hasBackground && (
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        )}

        <div className="absolute top-2 right-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="w-8 h-8 rounded-full p-0">
                ...
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              {onEditClick && <DropdownMenuItem onClick={onEditClick}>
                编辑
              </DropdownMenuItem>}
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
         <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-secondary)'}}>
            <span><i className="fas fa-users mr-1"></i> {studentCount}人</span>
            <span><i className="fas fa-calendar mr-1"></i> {new Date(classroom.created_at).getFullYear()}年</span>
          </div>
      </CardContent>
    </Card>
  );
}
