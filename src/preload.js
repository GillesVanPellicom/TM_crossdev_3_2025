const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSettings: (settings) => ipcRenderer.send('set-settings', settings),
  openSettingsDialog: () => ipcRenderer.send('open-settings-dialog'),
});
