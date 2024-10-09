import {app, BrowserWindow, screen} from 'electron';
import Configuration from './configs/config.js';

import {WinLoadType, DefaultConfig, createConfig, calculateWindowPosition} from './scripts/utils/windows.util.js';

import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const createWindow = (type = WinLoadType.FILE, url, config = DefaultConfig) => {
    console.log(config);
    const win = new BrowserWindow({
        width: config.width,
        height: config.height,
        x: config.x,
        y: config.y,
        resizable: config.resizable,
        autoHideMenuBar: config.autoHideMenuBar,
        webPreferences: {
            nodeIntegration: true,
            devTools: config.devtools,
            preload: path.join(__dirname, config.preload),
            offscreen: config.offscreen,
        },
        darkTheme: config.darkTheme,
    })

    if (type === WinLoadType.FILE) {
        win.loadFile(url).then();
    } else if (type === WinLoadType.URL) {
        win.loadURL(url).then();
    }
}

app.whenReady().then(() => {
    const type = WinLoadType.URL;
    const positions = calculateWindowPosition(Configuration);

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