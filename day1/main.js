import { readInput } from "../inputReader.js";

let input = readInput(1);
let answer = 0;
let numberTxt = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
]

input.split('\r\n').forEach(line => {
    let rLine = replaceLettersByDigits(line);
    let digits = getFirstAndLastConcatenedDigitForLine(rLine);
    answer += parseInt(digits);
    console.log(`Line ${line} - ${rLine} - ${digits}`);
})

console.log(`Answer is '${answer}'`);


function getFirstAndLastConcatenedDigitForLine(line) {
    const digitGroups = [...line.matchAll(/\d+/g)];

    if (!digitGroups) {
        console.log(`Line ${line} - 0`);
        return '0';
    }

    if (digitGroups.length === 1) {
        return getConcatenedFirstAndLastDigit(digitGroups[0]);
    }
    
    let firstMatch = digitGroups[0].toString();
    let lastMatch = digitGroups[digitGroups.length - 1].toString();

    return firstMatch[0] + lastMatch[lastMatch.length - 1];
}

function getConcatenedFirstAndLastDigit(digitGroup) {;
    digitGroup = digitGroup.toString();
    if (digitGroup.length === 1) {
        return digitGroup + digitGroup;
    }

    return digitGroup[0] + digitGroup[digitGroup.length - 1];
}

function replaceLettersByDigits(line) {
    let replacedLine = line;
    for (let i = 0; i < numberTxt.length; i++) {
        replacedLine = replacedLine.replaceAll(numberTxt[i], numberTxt[i] + i + numberTxt[i]);
    }

    return replacedLine;
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}
