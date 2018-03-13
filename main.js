const electron = require('electron');
const platform = require('os').platform();
const path = require('path');
const api = require('./api');
// Import parts of electron to use
const { app, Menu, Tray } = electron;

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const assetsDirectory = path.join(__dirname, 'src', 'assets', 'img');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let tray;
const targetDir = path.join(app.getPath('home'), '.bolero');

api.create({ targetDir });

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
            label: 'Open in Browser',
            accelerator: 'Alt+Command+O',
            click: showBrowserWindow
        }, {
            label: 'Power Off',
            accelerator: 'Alt+Command+X',
            click: function () {
                if (tray) {
                    tray.destroy();
                    tray = null;
                }
                terminate();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);
    tray.setToolTip('CarrIOTA Bolero');
    tray.on('click', showBrowserWindow);
    tray.on('right-click', () => tray.popUpContextMenu(contextMenu));
}

function showBrowserWindow() {
  electron.shell.openExternal(`http://localhost:${api.PORT}`)
}

function terminate() {
    console.log("STOPPING BOLERO..");
    api.stop().then(() => {
        console.log("BOLERO STOPPED!");
        app.quit();
        process.exit(0);
    })
}

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);

// Don't show the app in the doc
app.dock && app.dock.hide();

app.on('ready', () => {
    api.start();
    createTray();
    showBrowserWindow();
});
