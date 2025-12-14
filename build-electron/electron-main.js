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
// Keep a global reference of the window objects to prevent them from being garbage collected.
let mainWindow;
let settingsWindow;
// Creates and configures the main application window.
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // Use a preload script to expose controlled APIs to the renderer process.
            // This is a security best practice over enabling nodeIntegration.
            preload: path.join(__dirname, '..', 'preload.js'),
            // Isolate the renderer process from the main process for security.
            contextIsolation: true,
            // Disable Node.js integration in the renderer process.
            nodeIntegration: false,
            // Enable process sandboxing.
            sandbox: true,
        },
    });
    // Load the main HTML file of the Angular application.
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    mainWindow.loadFile(indexPath)
        .catch(error => console.error('Failed to load index.html:', error));
    // Open DevTools for debugging, can be removed for production.
    // mainWindow.webContents.openDevTools();
    // Dereference the window object when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = undefined;
    });
    // Limit navigation to external websites.
    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (!url.startsWith('file://')) {
            event.preventDefault();
        }
    });
    // Limit creation of new windows.
    mainWindow.webContents.setWindowOpenHandler(() => {
        return { action: 'deny' };
    });
}
// Electron app lifecycle events.
electron_1.app.on('ready', () => {
    // Set a Content Security Policy.
    electron_1.session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ["script-src 'self'"]
            }
        });
    });
    createWindow();
});
// Quit the app when all windows are closed, except on macOS.
electron_1.app.on('window-all-closed', function () {
    // On macOS, it's common for applications to stay active until the user quits explicitly.
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Re-create the main window if the app is activated and no window is open.
electron_1.app.on('activate', function () {
    if (!mainWindow) {
        createWindow();
    }
});
// --- Settings Management ---
// Define the path for the settings file in the user's app data directory.
const SETTINGS_FILE = path.join(electron_1.app.getPath('userData'), 'settings.json');
// Reads settings from the JSON file.
// Returns default settings if the file doesn't exist or is corrupted.
function getSettings() {
    try {
        const rawData = fs.readFileSync(SETTINGS_FILE, 'utf-8');
        return JSON.parse(rawData);
    }
    catch (error) {
        // Return a default settings object if reading fails.
        return { accentColor: '#007bff' };
    }
}
// Writes the given settings object to the JSON file.
function saveSettings(settings) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings));
}
// --- IPC Handlers for Renderer Process ---
// Handle request from renderer to get current settings.
electron_1.ipcMain.handle('get-settings', () => {
    return getSettings();
});
// Handle event from renderer to save new settings.
electron_1.ipcMain.on('set-settings', (event, settings) => {
    // Verify the sender of the IPC message.
    if (event.sender.getURL().startsWith('file://')) {
        saveSettings(settings);
    }
});
// Handle event from renderer to open the settings dialog.
electron_1.ipcMain.on('open-settings-dialog', () => {
    // If the settings window is already open, focus it.
    if (settingsWindow) {
        settingsWindow.focus();
        return;
    }
    // Create a new modal window for settings.
    settingsWindow = new electron_1.BrowserWindow({
        width: 400,
        height: 300,
        parent: mainWindow, // Attach to the main window.
        modal: true,
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });
    // Load the settings HTML file.
    const settingsPath = path.join(__dirname, '..', 'dist', 'settings.html');
    settingsWindow.loadFile(settingsPath)
        .catch(error => console.error('Failed to load settings.html:', error));
    // Dereference the window object when it's closed.
    settingsWindow.on('closed', () => {
        settingsWindow = undefined;
    });
});
