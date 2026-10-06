const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const os = require('os');
const { detectLibreOfficePath, convertBatch } = require('./converter');
const { compressPdf } = require('./compressor');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    backgroundColor: '#07080a',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ============================================================
// IPC Handlers — Fase 2
// ============================================================

/** Handler: Buka native file picker */
ipcMain.handle('open-file-dialog', async () => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Pilih file untuk dikonversi',
    filters: [
      { name: 'Office Files', extensions: ['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'] }
    ],
    properties: ['openFile', 'multiSelections']
  });
  return filePaths || [];
});

/** Handler: Buka dialog pilih folder */
ipcMain.handle('open-folder-dialog', async () => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Pilih folder output',
    properties: ['openDirectory']
  });
  return filePaths?.[0] || null;
});

/** Handler: Deteksi path LibreOffice */
ipcMain.handle('get-libreoffice-path', async () => {
  return await detectLibreOfficePath();
});

/** Handler: Konversi file-file ke PDF */
ipcMain.handle('convert-files', async (event, files, options) => {
  const outputDir = options.outputDir ||
    path.join(os.homedir(), 'Documents', 'PDFs');

  const results = await convertBatch(
    files,
    outputDir,
    { ...options, libreOfficePath: options.libreOfficePath },
    (fileIndex, percent, status, outputPath) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('conversion-progress', {
          fileIndex, percent, status, outputPath
        });
      }
    }
  );

  return results;
});

/** Handler: Kompres PDF */
ipcMain.handle('compress-pdf', async (event, inputPath, level) => {
  const outputPath = inputPath.replace(/\.pdf$/i, '_compressed.pdf');
  return await compressPdf(inputPath, outputPath, level);
});

/** Handler: Buka file di explorer/finder */
ipcMain.handle('open-file', async (event, filePath) => {
  shell.openPath(filePath);
});

/** Handler: Buka folder di explorer */
ipcMain.handle('open-folder', async (event, folderPath) => {
  shell.openPath(folderPath);
});

/** Handler: Window controls */
ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.on('window-close', () => mainWindow?.close());

// ============================================================
// App Lifecycle
// ============================================================
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
