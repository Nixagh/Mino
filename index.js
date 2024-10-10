const configuration = require('./configs/config.js');
const {app, BrowserWindow, screen} = require('electron')

const {
    WinLoadType,
    DefaultConfig,
    createConfig,
    calculateWindowPosition,
    addCookies,
    collectEvents
} = require('./scripts/utils/windows.util.js');

const path = require('path');

const Configuration = configuration.getInstances();

const createWindow = (type = WinLoadType.FILE, url, config = DefaultConfig) => {
    const win = new BrowserWindow({
        width: config.width,
        height: config.height,
        x: config.x,
        y: config.y,
        resizable: config.resizable,
        autoHideMenuBar: config.autoHideMenuBar,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, config.preload),
            offscreen: config.offscreen,
        },
        darkTheme: config.darkTheme,
    })

    if (config.devtools) {
        win.webContents.openDevTools();
    }

    collectEvents(win, Configuration);

    if (type === WinLoadType.FILE) {
        win.loadFile(url).then();
    } else if (type === WinLoadType.URL) {
        addCookies(win, Configuration);
        win.webContents.loadURL(url)
            .catch(e => {
                console.error(e);
            });
    }

}

app.whenReady().then(() => {
    const type = WinLoadType.URL;
    const positions = calculateWindowPosition(screen, Configuration);

    for (let i = 0; i < positions.length; i++) {
        const url = Configuration.getRandomStartUrl();

        createWindow(type, url, createConfig(Configuration, positions[i]));
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})