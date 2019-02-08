const request = require('request');
const fs = require('fs');

const aOverviewPages = [];
let aArticles;

new Promise((resolve, reject) => {
    fs.readFile('links.txt', "utf8", function (err, data) {
        resolve(data);
    });
}).then(aData => {
    aArticles = aData.split("\n");
});


module.exports = class LinkCollector {
    constructor() {

    }

    static addToFile(id, data) {
        let fd;

        try {
            fd = fs.openSync(id, 'a');
            fs.appendFileSync(fd, data, 'utf8');
        } catch (err) {
            /* Handle the error */
        } finally {
            if (fd !== undefined)
                fs.closeSync(fd);
        }
    }

    static getLinks(url) {
        request.get(url, (err, res, body) => {
            console.log(`Scanning ${url} for new articles...`)
            // LinkCollector.addToFile("test2.txt", body);
            let oRegex = /"http.*?"/g;
            let aMatches = [];
            while (true) {
                const a = oRegex.exec(body);
                if (!a) {
                    break;
                }
                aMatches.push(a[0].replace(/"/g, ""));
            }

            oRegex = /href="(\/\w.*?)"/g;
            while (true) {
                const a = oRegex.exec(body);
                if (!a) {
                    break;
                }
                aMatches.push("https://www.tagesschau.de" + a[1].replace(/"/g, ""));
            }

            console.log(`Validating found links of ${url}.`);
            aMatches.forEach(e => {
                request.get(e, (err, res, body) => {
                    if (body) {
                        // check if article
                        let oRegex = /class="meldungHead"/;
                        let aMatches = oRegex.exec(body);
                        if (aMatches && aMatches.length > 0)
                            if (aArticles.filter(link => link === e).length === 0) {
                                console.log(`Added ${e} to article library.`);
                                aArticles.push(e);
                                LinkCollector.addToFile("links.txt", e + "\n");
                            }

                        // check if overview
                        oRegex = /<title>.*?Aktuelle Nachrichten.*?<\/title>/;
                        aMatches = oRegex.exec(body);
                        if (aMatches && aMatches.length > 0) {
                            if (!aOverviewPages.find(link => link === e)) {
                                console.log(`Found new overview page: ${e}.`);
                                aOverviewPages.push(e);
                                LinkCollector.getLinks(e);
                            }
                        }
                    }
                });
            })
        });
    }
}