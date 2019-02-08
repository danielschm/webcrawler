const fs = require('fs');

module.exports = class StatisticEngine {
    constructor() {

    }

    static getTitle(content) {
        const aMatches = /<h1>([\s\S]*)<\/h1>/.exec(content);

        if (aMatches && aMatches.length >= 2) {
            return getFilteredTextFromString(aMatches[1].trim());
        } else {
            return undefined;
        }
    }

    static getTextFromHTML(content) {
        let sBody;
        const aMatches = /<body.*?>([\s\S]*?)<\/body>/.exec(content);
        if (aMatches && aMatches.length > 0) {
            sBody = aMatches[1];
            return sBody.replace(/<.*?>/g, "").trim();
        }
    }

    static getFilteredTextFromString(s) {
        return s.replace(new RegExp("<.*?>", "g"), "");
    }

    static getDataFromHTML(sContent, aStatistic) {
        const text = StatisticEngine.getTextFromHTML(sContent);
        console.log("\n");

        if (text) {
            const firstSplit = text.split("\n");
            const secondSplit = [];
            firstSplit.forEach(e => {
                secondSplit.push(...e.split(" "));
            });

            secondSplit.forEach(e => {
                const txt = e.replace(/\n/g, "").toLowerCase();
                const obj = aStatistic.filter(obj => obj.id === txt)[0];
                if (!obj) {
                    aStatistic.push({id: txt, count: 1});
                } else {
                    obj.count++;
                }
            });
        }
    }

    static getUnwantedIds() {
        return [
            "",
            "der",
            "die",
            "das",
            "und",
            "in",
            "im",
            "+",
            "=",
            "startseite",
            "für",
            "von",
            "des",
            "den",
            "nicht",
            "zum",
            "zu",
            "tagesschau",
            "ist",
            "dem",
            "var",
            "aus",
            "|",
            "if",
            "'['",
            "']',",
            "mit",
            "auf",
            "über",
            "wird",
            "so",
            "nutzer",
            "bei",
            "als",
            "auch",
            "-",
            "{",
            "&",
            "<img",
            "dossiers",
            "mehr",
            "oder",
            "sich",
            "sie",
            "eine",
            "viewsize",
            "durch",
            "es",
            "}",
            "vor",
            "/>",
            'class="img"',
            "else",
            "ein",
            "bildquelle:",
            "sieben-tage-überblick",
            "//",
            "(cookieviewsize",
            "==",
            "archiv",
            "20",
            "uhr",
            "video",
            "'',",
            "videos",
            "audios",
            "zur",
            "nach"
        ]
    }

    static getOutputStatistic(aStatistic) {
        console.log("Formatting to print statistic");


        // fs.appendFile("statistic.json", JSON.stringify(aStatistic), () => {
        //
        // });

        aStatistic = aStatistic.filter(e => !StatisticEngine.getUnwantedIds().includes(e.id));
        aStatistic.sort((a, b) => b.count - a.count);
        return aStatistic.slice(0, 20);
    }
};