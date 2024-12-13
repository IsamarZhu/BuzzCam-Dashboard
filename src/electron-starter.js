const electron = require('electron');
// Module to control application life.
const app = electron.app;
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const fs = require('fs');

module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'resources', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'resources', 'app.asar', 'node_modules'));

const { getCurrentPacket, initProcessProto, listSerialPorts, saveToCsv } = require('./processing/processProto');
const { SerialPort } = require('serialport');

let filePath = null; // store global filepath

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // // Create the browser window.
    // mainWindow = new BrowserWindow({width: 800, height: 600});

    // Create the browser window and preload the Electron APIs.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
        preload: path.join(__dirname, 'preload.js'), // Load the preload script here
        contextIsolation: true,
        enableRemoteModule: false,
        nodeIntegration: false
        }
    });

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

    // mainWindow.webContents.executeJavaScript(`
    //     var path = require('path');
    //     module.paths.push(path.resolve('node_modules'));
    //     module.paths.push(path.resolve('../node_modules'));
    //     module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
    //     module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
    //     module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
    //     module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));
    //     path = undefined;
    //   `);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.webContents.on('did-finish-load', async () => {
        if (!filePath) {
            const { filePaths } = await dialog.showOpenDialog(mainWindow, {
                title: 'Select Folder to Save CSV',
                message: 'Please select a folder to save the CSV file containing device data',
                properties: ['openDirectory']
            });

            if (filePaths && filePaths.length > 0) {
                const selectedFolder = filePaths[0];
                // const currentDateTime = new Date().toLocaleString().replace(/[/,:\s]/g, '-');
                // console.log(new Date().toLocaleString());

                // Get the current date and time
                const now = new Date();
                const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth is 0-indexed
                const day = String(now.getDate()).padStart(2, '0');
                const year = now.getFullYear();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');

                // Format as MM-DD-YYYY_HH:MM:SS
                const currentDateTime = `${month}-${day}-${year}_${hours}:${minutes}:${seconds}`;
                
                console.log(currentDateTime);

                filePath = path.join(selectedFolder, `data-${currentDateTime}.csv`);

                const header = [
                    'timeReceived', 'systemUid', 'msFromStart', 'epoch', 'packetIndex', 'requestAck',
                    'temperature', 'humidity', 'pressure', 'gas', 'pm2_5', 'light', 'activity', 'steps',
                    'particulateStaticObstructed', 'particulateDynamicObstructed', 'particulateOutsideDetectionLimits',
                    'deviceEngaged', 'sdcardSpaceRemaining', 'sdcardTotalSpace',
                    'batteryCharging', 'batteryVoltage', 'batteryPercentage',
                    'gpsLatitude', 'gpsLongitude', 'gpsAltitude', 'gpsSpeed', 'gpsHeading',
                    'radioRssi', 'radioSnr', 'radioRssiEst'
                ];

                // Create a new CSV file with the header row
                fs.writeFileSync(filePath, header.join(',') + '\n', 'utf-8');
                console.log(`CSV file created at: ${filePath}`);

                // Initialize the serial port with the created window and file path
                initProcessProto(mainWindow, filePath);

                // Notify React of the file path if needed
                // mainWindow.webContents.send('file-path-selected', filePath);
            }
        }
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
    createWindow()
    // Initialize the serial port with the created window
    // initProcessProto(mainWindow, filePath);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
  
  listSerialPorts()

//   initProcessProto()


  // handle exposing data from electron to react

  ipcMain.handle('getCurrentPacket', async () => {
    return getCurrentPacket();
  });