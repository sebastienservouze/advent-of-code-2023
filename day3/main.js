import { readInput } from "../inputReader.js";

let input = readInput(3);
let answer = 0;

let symbolsRegex = /[^A-Za-z0-9.]/;
let lines = [];
let digitMatchs = [];

input.split("\r\n").forEach(line => {;
    digitMatchs.push([...line.matchAll(/\d+/g)]);
    lines.push(line);
});

for (let i = 0; i < lines.length; i++) {
    let prevLine = i > 0 ? lines[i - 1] : null;
    let nextLine = i < lines.length ? lines[i + 1] : null;

    if (digitMatchs[i]) {
        digitMatchs[i].filter(match => match).forEach(match => {
            if (hasAdjacentSymbol(prevLine, lines[i], nextLine, match)) {
                console.log(match.toString());
                answer += parseInt(match.toString());
            }
        })
    }
}

console.log(answer);

function hasAdjacentSymbol(prevLine, line, nextLine, match) {
    let startIndex = Math.max(0, match.index - 1);
    let endIndex = Math.min(line.length - 1, match.index + match.toString().length + 1);

    if (prevLine) {
        let prevLineToCheck = prevLine.substring(startIndex, endIndex);
        console.log(prevLineToCheck);
        if (prevLineToCheck.match(symbolsRegex)) {
            return true;
        }
    }

    let lineToCheck = line.substring(startIndex, endIndex);
    console.log(lineToCheck);
    if (lineToCheck.match(symbolsRegex)) {
        return true;
    }

    if (nextLine) {
        let nextLineToCheck = nextLine.substring(startIndex, endIndex);
        console.log(nextLineToCheck);
        if (nextLineToCheck.match(symbolsRegex)) {
            return true;
        }
    }
}