const WinLoadType = {
    FILE: 'file',
    URL: 'url'
}

const DefaultConfig = {
    width: 800,
    height: 600,
    x: 0,
    y: 0,
    resizable: false,
    devtools: false,
    darkTheme: true,
    autoHideMenuBar: true,
    offscreen: false,
    preload: 'scripts/preloads/mino.preload.js',
}

const createConfig = (globalConfig, position) => {
    return {
        width: globalConfig.width,
        height: globalConfig.height,
        x: position.x,
        y: position.y,
        resizable: globalConfig.resizable,
        devtools: globalConfig.devtools,
        darkTheme: globalConfig.darkTheme,
        autoHideMenuBar: globalConfig.autoHideMenuBar,
        offscreen: globalConfig.offscreen,
        preload: globalConfig.preload,
    }
}

const calculateWindowPosition = (screen, config) => {
    const {width, height} = screen.getPrimaryDisplay().workAreaSize;
    let {width: windowWidth, height: windowHeight, numberOfWindows: numberOfWindows} = config;

    let maxRow = Math.floor(height / windowHeight);
    let maxCol = Math.floor(width / windowWidth);

    if (numberOfWindows > maxRow * maxCol) numberOfWindows = maxRow * maxCol;

    maxRow += 1;

    const windowPositions = [];

    for (let i = 0; i < numberOfWindows; i++) {
        if (i % maxCol === 0) maxRow--;

        const currentWidth = (i % maxCol) * windowWidth;
        const currentHeight = maxRow * windowHeight;

        windowPositions.push({
            x: currentWidth,
            y: currentHeight
        });
    }

    return windowPositions;
}

const updateNewUrl = (win, Configuration) => {
    const newUrl = Configuration.getRandomStartUrl();
    win.loadURL(newUrl).then();
}

const collectEvents = (win, Configuration) => {
    win.webContents.on('ipc-message', (event, channel, ...args) => {
        switch (channel) {
            case 'read-done':
                const currentUrl = win.webContents.getURL();
                Configuration.removeSelectedStartUrl(currentUrl);
                updateNewUrl(win, Configuration);
                break;
            case 'next':
               console.log(`${new Date().toLocaleString()} : ${args[0]}`);
               break;
            default:
                break;
        }
    })
}

const addCookies = (win, Configuration) => {
    win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['Cookie'] = Configuration.cookies;
        callback({
            cancel: false,
            requestHeaders: details.requestHeaders
        });
    });
}

module.exports = {
    WinLoadType,
    DefaultConfig,
    createConfig,
    calculateWindowPosition,
    collectEvents,
    addCookies
}