const puppeteer = require('puppeteer');
const {combineWithQueryParam, genreSelector} =require("../utils/helper.js")


exports.getFilterAnime = async (req, res) => {

    try {
        const search = req.query.search === undefined ? "" : req.query.search ;
        const genre = req.query.genre === undefined ? "" : combineWithQueryParam(req.query.genre,"genre") ;
        const country = req.query.country === undefined ? "" : combineWithQueryParam(req.query.country,"country") ;
        const season = req.query.season === undefined ? "" : combineWithQueryParam(req.query.season,"season") ;
        const year = req.query.year === undefined ? "" : combineWithQueryParam(req.query.year,"year") ;
        const language = req.query.language === undefined ? "" : combineWithQueryParam(req.query.language,"language") ;
        const type = req.query.type === undefined ? "" : combineWithQueryParam(req.query.type,"type") ;
        const status = req.query.status === undefined ? "" : combineWithQueryParam(req.query.status,"status") ;
        const order = req.query.order === undefined ? "" : combineWithQueryParam(req.query.order) ;
        const pages = req.query.page === undefined ? "1" : req.query.page;


        const url = `https://anitaku.to/filter.html?keyword=${search}${genre}${country}${season}${year}${language}${type}${status}&sort=${order}&page=${pages}`;

        console.log(url)
        const browser = await puppeteer.launch({ headless: 'new', });
        const page = await browser.newPage();
        await page.goto(url);


        const anime = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('.items li .img a img'));
            const names = Array.from(document.querySelectorAll('.items li .name a'));
            const ids = Array.from(document.querySelectorAll('.items li .name a'));
            const release = Array.from(document.querySelectorAll('.items li .released'))

            return images.map((image, index) => {
                return {
                    "image": image.src,
                    "id": ids[index].href,
                    "anime": names[index].title,
                    "released": release[index].textContent.trim(),
                }
            });
        });


        await browser.close();

        res.status(200)
            .json({ anime });

    } catch (error) {
        res.status(500)
            .json({ error: 'Internal Server Error' });
    }

}



exports.getGenreAnime = async (req, res) => {

    try {
        const genre = req.query.genre === undefined ? "" : genreSelector(req.query.genre) ;
        const pages = req.query.page === undefined ? "1" : req.query.page;


        const url = `https://anitaku.to/filter.html?keyword=&${genre}&page=${pages}`;


        const browser = await puppeteer.launch({ headless: 'new', });
        const page = await browser.newPage();
        await page.goto(url);


        const anime = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('.items li .img a img'));
            const names = Array.from(document.querySelectorAll('.items li .name a'));
            const ids = Array.from(document.querySelectorAll('.items li .name a'));
            const release = Array.from(document.querySelectorAll('.items li .released'))

            return images.map((image, index) => {
                return {
                    "image": image.src,
                    "id": ids[index].href,
                    "anime": names[index].title,
                    "released": release[index].textContent.trim(),
                }
            });
        });


        await browser.close();

        res.status(200)
            .json({ anime });

    } catch (error) {
        res.status(500)
            .json({ error: 'Internal Server Error' });
    }

}




exports.getAnimeBy = async (req, res) => {

    try {
        const search = req.query.getBy === undefined ? "" : req.query.getBy;
        const pages = req.query.page === undefined ? "1" : req.query.page;


        const url = `https://anitaku.to/${search}.html?page=${pages}`;


        const browser = await puppeteer.launch({ headless: 'new', });
        const page = await browser.newPage();
        await page.goto(url);


        const anime = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('.items li .img a img'));
            const names = Array.from(document.querySelectorAll('.items li .name a'));
            const ids = Array.from(document.querySelectorAll('.items li .name a'));
            const release = Array.from(document.querySelectorAll('.items li .released'))

            return images.map((image, index) => {
                return {
                    "image": image.src,
                    "id": ids[index].href,
                    "anime": names[index].title,
                    "released": release[index].textContent.trim(),
                }
            });
        });


        await browser.close();

        res.status(200)
            .json({ anime });

    } catch (error) {
        res.status(500)
            .json({ error: 'Internal Server Error' });
    }

}





exports.getStreamLinks = async (req, res) => {

    try {
        const id = req.params.id;
        const url = `https://anitaku.to/${id}`;
        const browser = await puppeteer.launch({ headless: 'new', });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });


        const streamLinkSelector = '.anime_muti_link ul';
        const episodeNameSelector = '.title_name h2';
        const lastEpisodeSelector = '.content_left #episode_page';

        const selectorsToWaitFor = [
            streamLinkSelector,
            episodeNameSelector,
            lastEpisodeSelector
        ];
        await Promise.all(selectorsToWaitFor.map(selector => page.waitForSelector(selector, { timeout: 100000 })));

        //streamLinks
        const streamlinks = await page.evaluate((streamLinkSelector) => {
            const anchors = Array.from(document.querySelectorAll(`${streamLinkSelector} li a`));
            return anchors.map(anchor => {
                return {
                    "link": anchor.getAttribute('data-video'),
                    "provider": Array.from(anchor.childNodes)
                        .filter(node => node.nodeType === Node.TEXT_NODE)
                        .map(node => node.textContent.trim())
                        .join(' ')
                };
            });
        }, streamLinkSelector);

        //episodeName
        const episodeName = await page.evaluate((episodeNameSelector) => {
            return document.querySelector(`${episodeNameSelector}`).textContent.trim();
        }, episodeNameSelector);


        //episodeCount
        const episodeCount = await page.evaluate((lastEpisodeSelector) => {
            const element = document.querySelector(lastEpisodeSelector);

            if (element) {
                const anchor = element.querySelector('li:last-child a');

                let noOfEpisode = '';
                if (anchor) {
                    noOfEpisode = anchor.getAttribute("ep_end")
                }

                return noOfEpisode;
            }
            return null;
        }, lastEpisodeSelector);



        await browser.close();

        res.status(200)
            .json({ episodeName, episodeCount, streamlinks });
    }
    catch (error) {
        res.status(500)
            .json({ error: 'Internal Server Error' });
    }
}


exports.getAnimeInfo = async (req, res) => {

    try {
        const id = req.params.id;
    
        const url = `https://anitaku.to/category/${id}`;
        const browser = await puppeteer.launch({ headless: 'new', });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    
        const imageSelector = '.anime_info_body_bg';
        const typeSelector = '.anime_info_body_bg';
        const lastEpisodeSelector = '.content_left #episode_page';

    
    
        const selectorsToWaitFor = [
          imageSelector,
          typeSelector,
          lastEpisodeSelector
    
        ];
        await Promise.all(selectorsToWaitFor.map(selector => page.waitForSelector(selector, { timeout: 100000 })));
    
        //anime information such type status ...  i.e heading of content
        const animeInfo = await page.evaluate((typeSelector) => {
          const content = document.querySelectorAll(`${typeSelector} .type`)
          const type = content[0] ? content[0].querySelector('span').textContent.trim() : null;
          const description = content[1] ? content[1].querySelector('span').textContent.trim() : null;
          const genres = content[2] ? content[2].querySelector('span').textContent.trim() : null;
          const release = content[3] ? content[3].querySelector('span').textContent.trim() : null;
          const status = content[4] ? content[4].querySelector('span').textContent.trim() : null;
          const names = content[5] ? content[5].querySelector('span').textContent.trim() : null;
    
    
          const genre = [];
          const b = content[2].querySelectorAll('a').forEach(aTag => genre.push(aTag.getAttribute('title')));
          const des = document.querySelectorAll(`${typeSelector} .description`)

    
    
          //the actually content
          const anime = {}
          anime[`${type}`] = content[0] ? content[0].querySelector('a').textContent.trim() : null;
          anime[`${description}`] = des[0] ? des[0].textContent.trim() : null;
          anime[`${genres}`] = genre
          anime[`${release}`] = content[3] ? content[3].textContent.trim() : null;
          anime[`${status}`] = content[4] ? content[4].querySelector('a').getAttribute('title') : null;
          anime[`${names}`] = content[5] ? content[5].textContent.trim() : null;
    
          return anime;
    
    
    
        }, typeSelector);
    
    
        // anime image and title 
        const animeImage = await page.evaluate((imageSelector) => {
          const image = document.querySelector(`${imageSelector} img`).src;
          const title = document.querySelector(`${imageSelector} h1`).textContent.trim();
    
          return { image, title }
        }, imageSelector);
    

        //episode count
        const episodeCount = await page.evaluate((lastEpisodeSelector) => {
            const element = document.querySelector(lastEpisodeSelector);

            if (element) {
                const anchor = element.querySelector('li:last-child a');

                let noOfEpisode = '';
                if (anchor) {
                    noOfEpisode = anchor.getAttribute("ep_end")
                }

                return noOfEpisode;
            }
            return null;
        }, lastEpisodeSelector);

    
    
    
        await browser.close();
    
        res.status(200).json({ animeImage, animeInfo,episodeCount });
      }
      catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    

}