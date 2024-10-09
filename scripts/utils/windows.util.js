import {screen} from "electron";

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

const calculateWindowPosition = (config) => {
    const {width, height} = screen.getPrimaryDisplay().workAreaSize;
    const {width: windowWidth, height: windowHeight, numberOfWindows: numberOfWindows} = config;

    const windowWidthOffset = windowWidth + 2;
    const windowHeightOffset = windowHeight + 2;

    const windowPositions = [];

    for (let i = 0; i < numberOfWindows; i++) {
        const x = (i % 2) * windowWidthOffset;
        const y = Math.floor(i / 2) * windowHeightOffset;

        if (x + windowWidth > width) {
            return windowPositions;
        }

        if (y + windowHeight > height) {
            return windowPositions;
        }

        windowPositions.push({x, y});
    }

    return windowPositions;
}

export {WinLoadType, DefaultConfig, createConfig, calculateWindowPosition}