// safely expose certain Electron APIs to React app

const { contextBridge, ipcRenderer } = require('electron');

// Safely expose ipcRenderer to the renderer process
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    once: (channel, listener) => ipcRenderer.once(channel, listener),
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  },
});
