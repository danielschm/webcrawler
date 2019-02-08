const LinkCollector = require('./LinkCollector');
const StatisticEngine = require('./StatisticEngine');
const request = require('request');
const fs = require('fs');

console.log("Downloading links...");

const aStatistic = [];
const aPromises = [];

// fs.readFile('links.txt', "utf8", function (err, data) {
//     console.log("Received links. Fetching content...");
//     data.split("\n").forEach(url => {
//         if (url) {
//             aPromises.push(new Promise((resolve, reject) => {
//                 request.get(url, (err, res, body) => {
//                     if (body) {
//                         console.log(`Evaluating content of ${url}`);
//                         StatisticEngine.getDataFromHTML(body, aStatistic);
//                     }
//                     resolve();
//                 });
//             }));
//         }
//     });
//
//     Promise.all(aPromises)
//         .then(() => {
//             console.log(StatisticEngine.getOutputStatistic(aStatistic));
//         })
//         .catch(() => {
//             //handling
//         });
// });

fs.readFile('statistic.json', "utf8", function (err, data) {
    console.log(StatisticEngine.getOutputStatistic(JSON.parse(data)));
});


// LinkCollector.getLinks("https://www.tagesschau.de/");
