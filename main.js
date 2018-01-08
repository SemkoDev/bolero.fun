const electron = require('electron');
const platform = require('os').platform();
const path = require('path');
const url = require('url');
const { Controller } = require('bolero.lib');
// Import parts of electron to use
const { app, Menu, Tray, BrowserWindow } = electron;

const assetsDirectory = path.join(__dirname, 'src', 'assets', 'img');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let eNotify = null;
let mainWindow;
let tray;
let terminating;
const controller = new Controller({ onStateChange, targetDir: path.join(app.getPath('home'), '.bolero') });
let state = controller.getState();

// Keep a reference for dev mode
let dev = false;
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
    dev = true;
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 510,
        height: 510,
        show: false,
        fullscreenable: false,
        resizable: false,
        minimizable: false,
        maximizable: false,
        webPreferences: {
            // Prevents renderer process code from not running when window is hidden
            backgroundThrottling: false,
            nodeIntegration: true,
            preload: __dirname + '/preload.js'
        }
    });

    // and load the index.html of the app.
    let indexPath;
    if (dev && process.argv.indexOf('--noDevServer') === -1) {
        indexPath = url.format({
            protocol: 'http:',
            host: 'localhost:8088',
            pathname: 'index.html',
            slashes: true
        });
    } else {
        indexPath = url.format({
            protocol: 'file:',
            pathname: path.join(__dirname, 'dist', 'index.html'),
            slashes: true
        });
    }
    mainWindow.loadURL(indexPath);

    const onHide = () => {
        if (!tray) {
            return;
        }
        tray.setHighlightMode('never');
        let trayImage = path.join(assetsDirectory, 'icon-128x128.png');
        if (platform === 'darwin') {
            trayImage = path.join(assetsDirectory, 'icon.png');
        }
        else if (platform === 'win32') {
            trayImage = path.join(assetsDirectory, 'icon.ico');
        }
        tray.setImage(trayImage);
        mainWindow = null;
        eNotify.notify({
            title: 'Bolero runs in the background',
            text: 'You can close Bolero completely in the tray menu.'
        });
    };

    // Don't show until we are ready and loaded
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
        onStateChange(state);
        // Open the DevTools automatically if developing
        if (dev) {
            mainWindow.webContents.openDevTools();
        }
    });
    mainWindow.on('show', () => {
        tray.setHighlightMode('always');
        if (platform === "darwin") {
            tray.setImage(path.join(assetsDirectory, 'iconHighlight.png'));
        }
    });
    mainWindow.on('hide', onHide);

    // Emitted when the window is closed.
    mainWindow.on('closed', onHide);

    mainWindow.on('onbeforeunload', (e) => {
        e.returnValue = 1;
    });

    // Check if we are on a MAC
    if (process.platform === 'darwin') {
        const template = [{
            role: 'window',
            label: "Application",
            submenu: [
                { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
                { type: "separator" },
                { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
            ]}, {
            role: 'services',
            label: "Edit",
            submenu: [
                {role: 'undo'},
                {role: 'redo'},
                {type: 'separator'},
                {role: 'cut'},
                {role: 'copy'},
                {role: 'paste'},
                {role: 'pasteandmatchstyle'},
                {role: 'delete'},
                {role: 'selectall'}
            ]}
        ];

        Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    }
}

function createTray() {
    let trayImage = path.join(assetsDirectory, 'icon-128x128.png');
    if (platform === 'darwin') {
        trayImage = path.join(assetsDirectory, 'icon.png');
    }
    else if (platform === 'win32') {
        trayImage = path.join(assetsDirectory, 'icon.ico');
    }
    tray = new Tray(trayImage);
    if (platform === "darwin") {
        tray.setPressedImage(path.join(assetsDirectory, 'iconHighlight.png'));
    }

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open',
            accelerator: 'Alt+Command+O',
            click: function () {
                if (!mainWindow) {
                    createWindow()
                } else if (!mainWindow.isVisible()) {
                    mainWindow.show();
                }
            }
        }, {
            label: 'Exit',
            accelerator: 'Alt+Command+X',
            click: function () {
                if (tray) {
                    tray.destroy();
                    tray = null;
                }
                if (mainWindow && mainWindow.isVisible()) {
                    mainWindow.hide()
                }
                terminate();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);
    tray.setToolTip('CarrIOTA Bolero');
    tray.on('click', toggleWindow);
    tray.on('right-click', () => tray.popUpContextMenu(contextMenu));
}

function toggleWindow() {
    if (mainWindow && mainWindow.isVisible()) {
        if (dev) {
            mainWindow.webContents.closeDevTools();
        }
        mainWindow.hide()
    } else {
        createWindow()
    }
}

function onStateChange(newState) {
    state = newState;
    // console.log(JSON.stringify(newState, null, 2));
    if (!terminating && mainWindow) {
        mainWindow.webContents.send('state', state);
    }
}

function terminate() {
    console.log("STOPPING BOLERO..");
    controller.stop().then(() => {
        console.log("BOLERO STOPPED!");
        terminating = true;
        app.quit();
        process.exit(0);
    })
}

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);

// Don't show the app in the doc
app.dock && app.dock.hide();

app.on('ready', () => {
    eNotify = require('electron-notify');  // can only be imported after the app is ready
    eNotify.setConfig({
        displayTime: 6000
    });
    controller.start();
    createTray();
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    //app.quit()
});
