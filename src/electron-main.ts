import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | undefined;
let settingsWindow: BrowserWindow | undefined;

interface Settings {
  accentColor: string;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  mainWindow.loadFile(indexPath)
    .catch(error => console.error('Failed to load index.html:', error));

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = undefined;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (!mainWindow) {
    createWindow();
  }
});

// Settings
const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');

function getSettings(): Settings {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
  } catch (error) {
    return { accentColor: '#007bff' }; // Default
  }
}

function saveSettings(settings: Settings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings));
}

ipcMain.handle('get-settings', (): Settings => {
  return getSettings();
});

ipcMain.on('set-settings', (event, settings: Settings) => {
  saveSettings(settings);
});

ipcMain.on('open-settings-dialog', () => {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 300,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const settingsPath = path.join(__dirname, '..', 'dist', 'settings.html');
  settingsWindow.loadFile(settingsPath)
    .catch(error => console.error('Failed to load settings.html:', error));

  settingsWindow.on('closed', () => {
    settingsWindow = undefined;
  });
});
