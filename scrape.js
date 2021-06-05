const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://www.heroesofmightandmagic.com/heroes4/heroesofmightandmagic4iv.shtml');
    const imagesDir = 'images/';
    const scrapeUrl = async (url) => {
        await page.goto(url);
        const heroes = await page.evaluate(() => {
            const scrapeTable = (rows, sex) => {
                return Array.from(rows).map((row) => {
                    const tds = row.querySelectorAll('td');
                    const imageUrl = tds[0].firstChild.src;
                    const description = tds[1].textContent;
                    const [, name, race, biography, history] = /([^-]+)-((?:(?!Biography:)[\s\S])+)Biography:((?:(?!History:)[\s\S])+)History:([\s\S]+)/.exec(description);
                    return {
                        imageUrl,
                        name: name.trim(),
                        race: race.trim(),
                        biography: biography.trim(),
                        history: history.trim(),
                        sex
                    };
                });
            }
            const heroesTables = Array.from(document.querySelectorAll('table.H4_heroes'));
            let result = scrapeTable(heroesTables[0].rows, 'male');
            result = result.concat(scrapeTable(heroesTables[1].rows, 'female'));
            return result;
        });

        /**
         * Saving of images
         */
        for (let hero of heroes) {
            const imageSource = await page.goto(hero.imageUrl);
            const fileName = /\/([^\.\/]+\.[a-z]{3})$/.exec(hero.imageUrl)[1];
            hero.imageUrl = fileName;
            const imageData = await imageSource.buffer();
            fs.writeFileSync(`${imagesDir}${fileName}`, imageData);
        }
        return heroes;
    }

    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href^=heroes_]')).map((link) => {
            return link.getAttribute('href');
        });
    });

    let result = [];
    for (const link of links) {
        const url = `http://www.heroesofmightandmagic.com/heroes4/${link}`;
        const heroes = await scrapeUrl(url);
        result = result.concat(heroes);
    }

    await browser.close();
    fs.writeFile('result.json', JSON.stringify(result, null, '  '),  (err) => {
        console.log(`All Done! ${result.length + 1} heroes scraped`);
    });
})();
