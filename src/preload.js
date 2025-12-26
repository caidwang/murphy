/*
 * @Author: caidwang hust_wsc@163.com
 * @Date: 2024-10-11 22:27:28
 * @LastEditors: caidwang hust_wsc@163.com
 * @LastEditTime: 2024-10-12 08:04:19
 * @FilePath: /murphy/preload.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
})

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile')
})