const {ipcRenderer} = require('electron');

document.addEventListener('DOMContentLoaded',() => {
    let readingTime = 35;

    let readFirstBtn = document.querySelector("body > main > div > div > div > div:nth-child(1) > article > div.lg\\:flex > div.lg\\:px-4.mb-4.md\\:mx-0.mx-auto.flex-1 > div.flex.flex-wrap.gap-2 > a:nth-child(1) > div");
    // let nextChapterBtn = document.querySelector("body > main > div > div.bg-black.py-2 > div > div:nth-child(2) > div.translate-y-0.transition-all.bg-slate-800.select-none.sticky.top-0.left-0.right-0.z-10.md\\:rounded-b-md.h-11 > div > div > a:nth-child(3)");
    // let cantNextChapterBtn = document.querySelector("body > main > div > div.bg-black.py-2 > div > div:nth-child(2) > div.translate-y-0.transition-all.bg-slate-800.select-none.sticky.top-0.left-0.right-0.z-10.md\\:rounded-b-md.h-11 > div > div > div.bg-gray-400.rounded-md");

    if (readFirstBtn) {
        readFirstBtn.click();
        return;
    }

    let navigationDiv;
    let nextChapterBtn;
    let cantNextChapterBtn;
    let interval;


    const check = () => {
        navigationDiv = document.querySelector("body > main > div > div.bg-black.py-2 > div > div:nth-child(2) > div.translate-y-0.transition-all.bg-slate-800.select-none.sticky.top-0.left-0.right-0.z-10.md\\:rounded-b-md.h-11 > div > div");
        nextChapterBtn = navigationDiv?.children[2];
        cantNextChapterBtn = nextChapterBtn?.tagName.toLowerCase() === 'DIV'.toLowerCase();

        if (nextChapterBtn) {
            console.log('Next chapter in', readingTime, 'seconds')
            // clear setIntervals
            clearInterval(interval);

            setTimeout(() => {
                nextChapterBtn.click();

                // restart interval
                interval = setInterval(check, 1000);
            }, readingTime * 1000);
            return;
        }

        if (cantNextChapterBtn) {
            // send message to server
            ipcRenderer.send('read-done', 'read done');
        }
    };

    check();
    interval = setInterval(check, 1000);

    console.log('Mino preload script loaded');
})
