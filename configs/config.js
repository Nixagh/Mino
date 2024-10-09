import Config from './config.json' with { type: "json" };
class Configuration {
    static _instances = null;
    selectedStartUrls = [];

    constructor() {
        this.load();
    }

    static getInstances() {
        if (!this._instances) {
            this._instances = new Configuration();
        }

        return this._instances;
    }

    load() {
        this.width = Config.width;
        this.height = Config.height;
        this.numberOfWindows = Config.numberOfWindows;
        this.startUrl = Config.startUrl;
        this.resizable = Config.resizable;
        this.autoHideMenuBar = Config.autoHideMenuBar;
        this.devtools = Config.devtools;
        this.preload = Config.preload;
        this.darkTheme = Config.darkTheme;
        this.offscreen = Config.offscreen;
    }

    getRandomStartUrl() {
        let url = this.startUrl[Math.floor(Math.random() * this.startUrl.length)];

        while (this.selectedStartUrls.includes(url)) {
            url = this.startUrl[Math.floor(Math.random() * this.startUrl.length)];
        }

        this.selectedStartUrls.push(url);

        return url;
    }

    resetSelectedStartUrls() {
        this.selectedStartUrls = [];
    }

    removeSelectedStartUrl(url) {
        this.selectedStartUrls = this.selectedStartUrls.filter((item) => item !== url);
    }
}

export default Configuration.getInstances();