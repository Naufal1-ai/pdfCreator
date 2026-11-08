const { contextBridge, ipcRenderer } = require('electron');

/**
 * Expose safe IPC API to renderer process via contextBridge.
 * Sesuai SPEC.md — Fase 2 Full Implementation
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // File & Folder dialog
  openFileDialog:   (options)             => ipcRenderer.invoke('open-file-dialog', options),
  openFolderDialog: ()                    => ipcRenderer.invoke('open-folder-dialog'),

  // Konversi Office & PDF to Word
  convertFiles:     (files, options)      => ipcRenderer.invoke('convert-files', files, options),
  convertPdfToWord: (inputPath, outputDir, options) => ipcRenderer.invoke('convert-pdf-to-word', inputPath, outputDir, options),

  // Kompresi
  compressPdf:      (filePath, level)     => ipcRenderer.invoke('compress-pdf', filePath, level),

  // iLovePDF Suite Tools (pdf-lib)
  mergePdfs:      (inputPaths, outputPath) => ipcRenderer.invoke('merge-pdfs', inputPaths, outputPath),
  splitPdf:       (inputPath, outputDir, options) => ipcRenderer.invoke('split-pdf', inputPath, outputDir, options),
  rotatePdf:      (inputPath, outputPath, degrees) => ipcRenderer.invoke('rotate-pdf', inputPath, outputPath, degrees),
  watermarkPdf:   (inputPath, outputPath, text, options) => ipcRenderer.invoke('watermark-pdf', inputPath, outputPath, text, options),
  addPageNumbers: (inputPath, outputPath, format) => ipcRenderer.invoke('add-page-numbers', inputPath, outputPath, format),
  imagesToPdf:    (imagePaths, outputPath) => ipcRenderer.invoke('images-to-pdf', imagePaths, outputPath),

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
