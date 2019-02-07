const http = require('http');
const request = require('request');
const fs = require('fs');

const url = "https://www.tagesschau.de/wirtschaft/eu/index.html";

// http.get(url, function(res) {
//     console.log("Got response: " + res.statusCode);
//     let content = '';
//     res.on('data', function(chunk) {
//         console.log('chunk ' + chunk.length);
//         content += chunk;
//     });
//     res.on('end', function() {
//         getTextFromHTML(content);
//         // console.log(content.length);
//         // console.log(content);
//     });
// }).on('error', function(e) {
//     console.log("Got error: " + e.message);
// });

request.get(url, (error, response, body) => {
    console.log(`Status ${response.statusCode}`);
    if (!error) {
        fs.writeFile("test.txt", body, () => {
        });
        getDataFromHTML(body);
    }
});

function getTitle(content) {
    const aMatches = /<h1>([\s\S]*)<\/h1>/.exec(content);

    if (aMatches && aMatches.length >= 2) {
        return getFilteredTextFromString(aMatches[1].trim());
    } else {
        return undefined;
    }
}

function getTextFromHTML(content) {
    const sBody = /<body.*?>([\s\S]*?)<\/body>/.exec(content)[1];
    return sBody.replace(/<.*?>/g, "").trim();
}

function getFilteredTextFromString(s) {
    return s.replace(new RegExp("<.*?>", "g"), "");
}

function getDataFromHTML(content) {
    const title = getTitle(content);
    const text = getTextFromHTML(content);
    console.log(title);
    console.log("\n");

    let statistic = [];
    const firstSplit = text.split("\n");
    const secondSplit = [];
    firstSplit.forEach(e => {
        secondSplit.push(...e.split(" "));
    });

    secondSplit.forEach(e => {
        const txt = e.replace(/\n/g, "").toLowerCase();
        const obj = statistic.filter(obj => obj.id === txt);
        if (obj.length === 0) {
            statistic.push({id: txt, count: 1});
        } else {
            obj.count++;
        }
    });

    statistic.sort((a, b) => a.count - b.count);
    console.log(statistic);
}
