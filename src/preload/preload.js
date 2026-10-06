const { contextBridge, ipcRenderer } = require('electron');

/**
 * Expose safe IPC API to renderer process via contextBridge.
 * Sesuai SPEC.md — Fase 2 Full Implementation
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // File dialog
  openFileDialog:   ()                    => ipcRenderer.invoke('open-file-dialog'),
  openFolderDialog: ()                    => ipcRenderer.invoke('open-folder-dialog'),

  // Konversi
  convertFiles: (files, options)          => ipcRenderer.invoke('convert-files', files, options),

  // Kompresi
  compressPdf:  (filePath, level)         => ipcRenderer.invoke('compress-pdf', filePath, level),

  // LibreOffice detection
  getLibreOfficePath: ()                  => ipcRenderer.invoke('get-libreoffice-path'),

  // File system
  openFile:   (filePath)                  => ipcRenderer.invoke('open-file', filePath),
  openFolder: (folderPath)                => ipcRenderer.invoke('open-folder', folderPath),

  // Progress events dari main process
  onProgress: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('conversion-progress', handler);
    return () => ipcRenderer.removeListener('conversion-progress', handler);
  },

  // Window controls (custom title bar)
  windowMinimize: () => ipcRenderer.send('window-minimize'),
  windowMaximize: () => ipcRenderer.send('window-maximize'),
  windowClose:    () => ipcRenderer.send('window-close'),
});
