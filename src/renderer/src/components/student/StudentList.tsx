import { Student } from 'src/main/models/Student';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: number) => void;
}

export function StudentList({ students, onEdit, onDelete }: Props) {
  if (students.length === 0) {
    return <div className="text-center py-10 notion-caption">还没有任何学生，点击右上角添加一个吧。</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">头像</TableHead>
            <TableHead>姓名</TableHead>
            <TableHead>学号</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <img
                  src={student.avatar_path || 'https://via.placeholder.com/40'}
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.student_number}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(student)}>编辑</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(student.id)} className="text-red-500">
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
