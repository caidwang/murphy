import type { ReactElement } from 'react'
import { StudentAvatar } from './StudentAvatar'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'

export interface ImportedStudentPreview {
  name: string
  student_number: string
}

export interface StudentImportPreview {
  filePath: string
  fileName: string
  students: ImportedStudentPreview[]
  totalRows: number
  skippedRows: number
  detectedColumns: {
    name: string
    studentNumber: string
  }
}

interface Props {
  isOpen: boolean
  preview: StudentImportPreview | null
  isSaving: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ImportStudentsDialog({
  isOpen,
  preview,
  isSaving,
  onClose,
  onConfirm
}: Props): ReactElement {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[82vh] sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>从 Excel 导入学生</DialogTitle>
          <DialogDescription>确认解析结果后，学生将批量保存到当前班级。</DialogDescription>
        </DialogHeader>

        {preview && (
          <div className="min-h-0 space-y-4">
            <div className="rounded-md border bg-[#FAFAFA] p-4">
              <div className="mb-3 truncate text-sm font-medium text-[var(--text-primary)]">
                {preview.fileName}
              </div>
              <div className="grid gap-3 text-sm text-[var(--text-secondary)] sm:grid-cols-4">
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    {preview.students.length}
                  </div>
                  <div>有效学生</div>
                </div>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    {preview.totalRows}
                  </div>
                  <div>数据行</div>
                </div>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    {preview.skippedRows}
                  </div>
                  <div>跳过行</div>
                </div>
                <div>
                  <div className="truncate font-semibold text-[var(--text-primary)]">
                    {preview.detectedColumns.name} / {preview.detectedColumns.studentNumber}
                  </div>
                  <div>识别列</div>
                </div>
              </div>
            </div>

            <div className="max-h-[380px] overflow-y-auto rounded-md border">
              <div className="sticky top-0 grid grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b bg-white px-4 py-3 text-sm font-medium text-[var(--text-secondary)]">
                <div>头像</div>
                <div>姓名</div>
                <div>学号</div>
              </div>
              {preview.students.map((student) => (
                <div
                  key={`${student.student_number}-${student.name}`}
                  className="grid grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 border-b px-4 py-3 last:border-b-0"
                >
                  <StudentAvatar
                    name={student.name}
                    seed={student.student_number}
                    className="h-9 w-9"
                  />
                  <div className="truncate font-medium text-[var(--text-primary)]">
                    {student.name}
                  </div>
                  <div className="truncate text-[var(--text-secondary)]">
                    {student.student_number}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            取消
          </Button>
          <Button onClick={onConfirm} disabled={!preview || isSaving}>
            {isSaving ? '导入中...' : '确认导入'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
