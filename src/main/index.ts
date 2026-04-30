import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { initializeDatabase } from './repositories/database'
import { ClassroomRepository } from './repositories/ClassroomRepository'
import { StudentRepository } from './repositories/StudentRepository'
import { RollcallRecordRepository } from './repositories/RollcallRecordRepository'
import { ClassroomService } from './services/ClassroomService'
import { StudentService } from './services/StudentService'
import { RollcallService } from './services/RollcallService'
import { SettingsService } from './services/SettingsService'
import { registerClassroomHandlers } from './ipc-handlers/classroomHandler'
import { registerStudentHandlers } from './ipc-handlers/studentHandler'
import { registerRollcallHandlers } from './ipc-handlers/rollcallHandler'
import { registerSettingsHandlers } from './ipc-handlers/settingsHandler'

// Global instances for repositories and services
let classroomRepository: ClassroomRepository
let studentRepository: StudentRepository
let rollcallRecordRepository: RollcallRecordRepository
let classroomService: ClassroomService
let studentService: StudentService
let rollcallService: RollcallService
let settingsService: SettingsService

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1120,
    minHeight: 760,
    show: false,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    app.dock.setIcon(icon)
  }

  // Initialize the database and get the instance
  const dbInstance = initializeDatabase()

  // Instantiate Repositories
  classroomRepository = new ClassroomRepository(dbInstance)
  studentRepository = new StudentRepository(dbInstance)
  rollcallRecordRepository = new RollcallRecordRepository(dbInstance)

  // Instantiate Services with their repository dependencies
  classroomService = new ClassroomService(classroomRepository, studentRepository)
  studentService = new StudentService(studentRepository)
  rollcallService = new RollcallService(rollcallRecordRepository)
  settingsService = new SettingsService()

  // Register IPC handlers with their service dependencies
  registerClassroomHandlers(classroomService)
  registerStudentHandlers(studentService)
  registerRollcallHandlers(rollcallService)
  registerSettingsHandlers(settingsService)

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
