import { readInput } from "../inputReader.js";

let input = readInput(3);
let answer = 0;

let gearRegex = /[*]/;
let lines = [];
let digitMatchs = [];
let pairs = [];

input.split("\r\n").forEach(line => {;
    digitMatchs.push([...line.matchAll(/\d+/g)]);
    lines.push(line);
});

for (let i = 0; i < lines.length; i++) {
    let prevLine = i > 0 ? lines[i - 1] : null;
    let nextLine = i < lines.length ? lines[i + 1] : null;

    if (digitMatchs[i]) {
        digitMatchs[i].filter(match => match).forEach(match => {
            let pair = getMatchAndDigitAdjacentToGear(prevLine, lines[i], nextLine, match, i);
            if (pair) {
                pairs.push(pair);
            }
        })
    }
}

console.log(pairs);

for (let i = 0; i < pairs.length; i++) {
    pairs.forEach(pair => {
        if (!pair || pair === pairs[i]) return;

        if (pair.gearLine === pairs[i].gearLine && pair.gearIndex === pairs[i].gearIndex) {
            console.log(`FOUND ${pair.digit} et ${pairs[i].digit}`);
            answer += pair.digit * pairs[i].digit;
            return true;
        }
    });
    
    pairs[i] = null;
}

console.log(answer);

function getMatchAndDigitAdjacentToGear(prevLine, line, nextLine, match, lineIndex) {
    let startIndex = Math.max(0, match.index - 1);
    let endIndex = Math.min(line.length - 1, match.index + match.toString().length + 1);

    if (prevLine) {
        let prevLineToCheck = prevLine.substring(startIndex, endIndex);
        let gearMatch = prevLineToCheck.match(gearRegex);

        if (gearMatch) {
            let gearIndex = startIndex;
            for (let i = startIndex; i < endIndex; i++) {
                if (prevLine[i] === '*') break;
                gearIndex++;
            }
            return {
                gearIndex: gearIndex,
                gearLine: lineIndex - 1,
                digit: parseInt(match.toString())
            };
        }
    }

    let lineToCheck = line.substring(startIndex, endIndex);

    let gearMatch = lineToCheck.match(gearRegex);
    if (gearMatch) {
        let gearIndex = startIndex;
        for (let i = startIndex; i < endIndex; i++) {
            if (line[i] === '*') break;
            gearIndex++;
        }
        return {
            gearIndex: gearIndex,
            gearLine: lineIndex,
            digit: parseInt(match.toString())
        };
    }

    if (nextLine) {
        let nextLineToCheck = nextLine.substring(startIndex, endIndex);

        let gearMatch = nextLineToCheck.match(gearRegex);
        if (gearMatch) {
            let gearIndex = startIndex;
            for (let i = startIndex; i < endIndex; i++) {
                if (nextLine[i] === '*') break;
                gearIndex++;
            }
            return {
                gearIndex: gearIndex,
                gearLine: lineIndex + 1,
                digit: parseInt(match.toString())
            };
        }
    }

    return null;
}