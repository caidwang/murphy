/*
 * @Author: caidwang hust_wsc@163.com
 * @Date: 2024-10-11 22:23:44
 * @LastEditors: caidwang hust_wsc@163.com
 * @LastEditTime: 2024-10-12 23:41:06
 * @FilePath: /murphy/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


const { ipcMain } = require('electron')
const {app, BrowserWindow, dialog } = require('electron/main')
const path = require('node:path')

console.log('Hello from Electron 👋')

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}
const isDev = true;

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, './preload.js')
      }
    })
    win.webContents.openDevTools()
  
    win.loadURL(
        isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
  }

  app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen)
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })