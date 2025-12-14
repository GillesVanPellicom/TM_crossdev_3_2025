"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let mainWindow;
let settingsWindow;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
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
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (!mainWindow) {
        createWindow();
    }
});
// Settings
const SETTINGS_FILE = path.join(electron_1.app.getPath('userData'), 'settings.json');
function getSettings() {
    try {
        return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    }
    catch (error) {
        return { accentColor: '#007bff' }; // Default
    }
}
function saveSettings(settings) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings));
}
electron_1.ipcMain.handle('get-settings', () => {
    return getSettings();
});
electron_1.ipcMain.on('set-settings', (event, settings) => {
    saveSettings(settings);
});
electron_1.ipcMain.on('open-settings-dialog', () => {
    if (settingsWindow) {
        settingsWindow.focus();
        return;
    }
    settingsWindow = new electron_1.BrowserWindow({
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
