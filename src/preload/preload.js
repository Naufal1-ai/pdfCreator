const { contextBridge } = require('electron');

// Expose safe IPC API to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Placeholder API for Phase 1 foundation
  ping: () => 'pong'
});
