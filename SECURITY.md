# Security

This document outlines the security measures taken in this Electron application to ensure safe IPC and protect against common vulnerabilities.

## Electron Security Best Practices

We follow the latest security recommendations from the Electron documentation.

### 1. Context Isolation

`contextIsolation` is enabled in the main process (`main.js`):

```javascript
const win = new BrowserWindow({
  //...
  webPreferences: {
    //...
    contextIsolation: true,
  },
});
```

This is a critical security feature that ensures that the preload script and the renderer's JavaScript run in separate, isolated contexts. This prevents the renderer from accessing Electron's internal APIs or Node.js primitives, which could be exploited in a cross-site scripting (XSS) attack.

### 2. Context Bridge

To expose a limited and secure API to the renderer, we use `contextBridge` in the preload script (`preload.js`):

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSettings: (settings) => ipcRenderer.invoke('set-settings', settings),
});
```

The `contextBridge` ensures that the exposed API is a separate object in the renderer's `window` object, and it cannot be overwritten or modified by the renderer's code. This prevents prototype pollution and other attacks that could compromise the IPC channel.

### 3. Node.js Integration Disabled

`nodeIntegration` is disabled in the main process (`main.js`):

```javascript
const win = new BrowserWindow({
  //...
  webPreferences: {
    //...
    nodeIntegration: false,
  },
});
```

Disabling Node.js integration in the renderer process is a fundamental security practice. It prevents the renderer from accessing the `require` function and other Node.js modules, which would give it access to the user's file system and other sensitive resources.

### 4. Remote Module Disabled

The `enableRemoteModule` option is set to `false` in the main process (`main.js`):

```javascript
const win = new BrowserWindow({
  //...
  webPreferences: {
    //...
    enableRemoteModule: false,
  },
});
```

The `remote` module is deprecated and has known security vulnerabilities. Disabling it prevents the renderer from directly accessing main process modules, which could lead to privilege escalation.

## IPC Security

The Inter-Process Communication (IPC) between the main and renderer processes is designed to be secure:

-   **Invoke/Handle:** We use `ipcRenderer.invoke` and `ipcMain.handle` for asynchronous, request-response style communication. This is generally safer than using `ipcRenderer.send` for two-way communication, as it provides a clearer and more predictable flow of data.
-   **Limited API:** The API exposed to the renderer is minimal and only includes the necessary functions (`getSettings` and `setSettings`). This follows the principle of least privilege, reducing the attack surface.
-   **No Sensitive Data:** We avoid sending sensitive data over the IPC channel. In this application, we are only sending settings information, which is not considered sensitive.

By implementing these security measures, we have created a robust and secure Electron application that is well-protected against common vulnerabilities.
