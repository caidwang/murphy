import { useState, useEffect } from 'react'
import type { ReactElement } from 'react'
import { Classroom } from 'src/main/models/Classroom'
import { Student } from 'src/main/models/Student'
import { StudentList } from '~/components/student/StudentList'
import { CreateEditStudentDialog } from '~/components/student/CreateEditStudentDialog'
import { ImportStudentsDialog } from '~/components/student/ImportStudentsDialog'
import type { StudentImportPreview } from '~/components/student/ImportStudentsDialog'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { ChevronDown, FileSpreadsheet, UserPlus } from 'lucide-react'

interface Props {
  classId: number
  onNavigateBack: () => void
  onNavigateToRollcall: (classId: number) => void
}

export default function ClassDetailPage({
  classId,
  onNavigateBack,
  onNavigateToRollcall
}: Props): ReactElement {
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [importPreview, setImportPreview] = useState<StudentImportPreview | null>(null)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  useEffect(() => {
    const fetchClassDetails = async (): Promise<void> => {
      const classDetail = await window.electron.ipcRenderer.invoke('classrooms:findById', classId)
      setClassroom(classDetail)
    }

    const fetchStudents = async (): Promise<void> => {
      const result = await window.electron.ipcRenderer.invoke('students:getByClassroomId', classId)
      setStudents(result)
    }

    fetchClassDetails()
    fetchStudents()
  }, [classId])

  const handleSaveStudent = async (): Promise<void> => {
    const result = await window.electron.ipcRenderer.invoke('students:getByClassroomId', classId)
    setStudents(result)
  }

  const handleDeleteStudent = async (studentId: number): Promise<void> => {
    if (confirm('确定要删除这个学生吗？')) {
      await window.electron.ipcRenderer.invoke('students:delete', studentId)
      handleSaveStudent()
    }
  }

  const handleEditStudent = (student: Student): void => {
    setSelectedStudent(student)
    setIsCreateDialogOpen(true)
  }

  const handleAddStudent = (): void => {
    setSelectedStudent(null)
    setIsCreateDialogOpen(true)
  }

  const handleImportFromExcel = async (): Promise<void> => {
    try {
      const result = await window.electron.ipcRenderer.invoke('students:importFromExcel')
      if (result?.canceled) return

      setImportPreview(result)
      setIsImportDialogOpen(true)
    } catch (error) {
      console.error('Failed to import students from Excel:', error)
      alert('导入 Excel 失败: ' + (error as Error).message)
    }
  }

  const handleConfirmImport = async (): Promise<void> => {
    if (!importPreview) return

    setIsImporting(true)
    try {
      await window.electron.ipcRenderer.invoke(
        'students:bulkInsert',
        importPreview.students.map((student) => ({
          name: student.name,
          student_number: student.student_number,
          avatar_path: null,
          classroom_id: classId
        }))
      )
      setIsImportDialogOpen(false)
      setImportPreview(null)
      await handleSaveStudent()
    } catch (error) {
      console.error('Failed to save imported students:', error)
      alert('保存导入学生失败: ' + (error as Error).message)
    } finally {
      setIsImporting(false)
    }
  }

  const handleCloseImportDialog = (): void => {
    if (isImporting) return
    setIsImportDialogOpen(false)
    setImportPreview(null)
  }

  const handleCloseDialog = (): void => {
    setIsCreateDialogOpen(false)
    setSelectedStudent(null)
  }

  return (
    <div className="w-full h-screen flex">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onNavigateBack}>
            &lt;
          </Button>
          <h1 className="notion-title">{classroom?.name || '班级详情'}</h1>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="notion-subtitle">学生列表</h2>
            <div className="flex space-x-2">
              <Button className="btn-primary" onClick={() => onNavigateToRollcall(classId)}>
                随机点名
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="btn-primary">
                    添加学生
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleAddStudent}>
                    <UserPlus className="h-4 w-4" />
                    添加单个学生
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleImportFromExcel}>
                    <FileSpreadsheet className="h-4 w-4" />从 Excel 导入
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <StudentList
            students={students}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
          />
        </div>
      </main>

      <CreateEditStudentDialog
        isOpen={isCreateDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveStudent}
        classroomId={classId}
        initialStudentData={selectedStudent}
      />

      <ImportStudentsDialog
        isOpen={isImportDialogOpen}
        preview={importPreview}
        isSaving={isImporting}
        onClose={handleCloseImportDialog}
        onConfirm={handleConfirmImport}
      />
    </div>
  )
}
