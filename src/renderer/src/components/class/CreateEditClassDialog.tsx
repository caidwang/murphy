import { useState, useEffect } from 'react'
import type { ReactElement } from 'react'
import { Classroom } from 'src/main/models/Classroom'
import {
  ClassroomCreationData,
  ClassroomUpdateData
} from 'src/main/repositories/ClassroomRepository'
import { Button } from '../ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog.tsx'
import { Input } from '../ui/input.tsx'
import { Label } from '../ui/label.tsx'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: () => void // Callback to refresh the list or navigate
  initialClassData?: Classroom | null // For editing
}

export function CreateEditClassDialog({
  isOpen,
  onClose,
  onSave,
  initialClassData
}: Props): ReactElement {
  const [name, setName] = useState(initialClassData?.name || '')
  const [backgroundImagePath, setBackgroundImagePath] = useState(
    initialClassData?.background_image_path || ''
  )
  const [themeColor, setThemeColor] = useState(initialClassData?.theme_color || '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (initialClassData) {
      setName(initialClassData.name)
      setBackgroundImagePath(initialClassData.background_image_path || '')
      setThemeColor(initialClassData.theme_color || '')
    } else {
      setName('')
      setBackgroundImagePath('')
      setThemeColor('')
    }
  }, [initialClassData])

  const handleSubmit = async (): Promise<void> => {
    setIsSaving(true)
    try {
      if (initialClassData && initialClassData.id) {
        // Update existing classroom
        const data: ClassroomUpdateData = {
          name,
          background_image_path: backgroundImagePath,
          theme_color: themeColor
        }
        await window.electron.ipcRenderer.invoke('classrooms:update', initialClassData.id, data)
      } else {
        // Create new classroom
        const data: ClassroomCreationData = {
          name,
          background_image_path: backgroundImagePath,
          theme_color: themeColor
        }
        await window.electron.ipcRenderer.invoke('classrooms:create', data)
      }
      onSave() // Notify parent to refresh/update
      onClose()
    } catch (error) {
      console.error('Failed to save classroom:', error)
      alert('保存班级信息失败: ' + (error as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialClassData ? '编辑班级' : '创建新班级'}</DialogTitle>
          <DialogDescription>
            {initialClassData ? '修改班级信息。' : '填写班级信息以创建一个新班级。'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              班级名称
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="请输入班级名称"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="backgroundImagePath" className="text-right">
              背景图URL
            </Label>
            <Input
              id="backgroundImagePath"
              value={backgroundImagePath}
              onChange={(e) => setBackgroundImagePath(e.target.value)}
              className="col-span-3"
              placeholder="留空则使用默认班级背景图"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="themeColor" className="text-right">
              主题色
            </Label>
            <Input
              id="themeColor"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="col-span-3"
              placeholder="#FF0000 或 rgba(255,0,0,0.5)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
