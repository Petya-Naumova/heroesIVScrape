const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://www.heroesofmightandmagic.com/heroes4/heroesofmightandmagic4iv.shtml');
    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href^=heroes_]')).map((link) => {
            return link.getAttribute('href');
        });
    });
    console.log(links);
    await browser.close();
})();
