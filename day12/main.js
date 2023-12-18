import { resourceLimits } from "worker_threads";
import { readInput } from "../inputReader.js";
import { measure, replaceAt } from "../utils.js";

let input = readInput(12);
let answer = 0;

let lines = input.split('\r\n');

// Parsing
let fieldRows = lines.map(line => {
    let split = line.split(' ');
    return {
        row: split[0],
        groups: split[1].split(',').map(length => +length)
    };
})

//console.log(fieldRows);

// Traitement
fieldRows.forEach((fieldRow, i) => {
    console.log('Recherche pour la row ' + JSON.stringify(fieldRow));
    let lineResult = getPossibleSolutions(fieldRow.row, fieldRow.groups);
    console.log(lineResult);
    answer += lineResult;
});

function getPossibleSolutions(row, groups) {
    console.log(row + ' - ' + groups)
    if (row.length === 0) {
        if (groups.length === 0) {
            console.log(`${row} - ${groups} + 1`);
            return 1;
        } else {
            return 0;
        }
    }

    if (groups.length === 0) {
        if (!row.includes('#')) {
            console.log(`${row} - ${groups} + 1`);
            return 1;
        }
        else {
            return 0;
        }

    }

    let result = 0;
    let firstChar = row.charAt(0);

    // Continue d'itérer
    if (".?".includes(firstChar)) {
        result += getPossibleSolutions(row.substring(1), groups.slice());
    }

    // Potentiel bloc valide
    if ("#?".includes(firstChar)) {
        // Valide si toutes ces conditions respectée
        let isEnoughSpringsLeft = row.length >= groups[0];
        let isAllBroken = !row.substring(0, groups[0]).includes('.');
        let isNextCharOperational = groups[0] === row.length || row.charAt(groups[0] !== '#');
        if (isEnoughSpringsLeft && isAllBroken && isNextCharOperational) {
            result += getPossibleSolutions(row.substring(groups[0] + 1), groups.slice(1));
        } 
    }

    return result;
}


console.log(`Answer is '${answer}'`);