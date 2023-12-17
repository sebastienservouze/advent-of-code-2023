import { readInput } from "../inputReader.js";

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
    if (i > 0) return;

    // Récupère les matchs des ?
    let unknowns = [...fieldRow.row.matchAll(/\?/g)];

    // Récupère le nombre de springs endommagés manquants (n)
    let knownDamagedSprings = [...fieldRow.row.matchAll(/#/g)];
    let missingDamagedSprings = fieldRow.groups.reduce((acc, elem) => acc + elem) - knownDamagedSprings.length;

    // Crée une combinaison avec le nombre de spring endommagées manquantes
    for (let j = 0; j < missingDamagedSprings; j++) {
        unknowns[j][0] = '#';
    }

    // Récupère toutes les combinaisons possibles 
    let possibleCombinations = getCombinations(unknowns);

    console.log(possibleCombinations);

    // Remplace
    /*possibleCombinations.forEach(combination => {
        let testString = getRemapedRow(combination, fieldRow.row);
        console.log(combination);
        console.log(fieldRow.row + ' > ' + testString);
        let damagedGroups = testString.split('.');

        damagedGroups.map(group => group.length);
        if (JSON.stringify(damagedGroups) === JSON.stringify(fieldRow.groups)) {
            answer += 1;
        }
    })*/
});


console.log(`Answer is '${answer}'`);

function getCombinations(array) {
    console.log('Combinations');
    let combinations = [];

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length; j++) {
            if (i === j || array[i][0] === array[j][0]) continue;

            let combination = [...array];
            permute(combination, i, j);
            console.log(combination);
            combinations.push(combination);
        }
    }

    console.log('Fin')
    console.log(combinations);

    return combinations;
}

function permute(array, ia, ib) {
    let temp = array[ia].index;
    array[ia].index = array[ib].index;
    array[ib].index = temp;
}

function getRemapedRow(combination, baseRow) {
    let result = baseRow;

    combination.forEach(match => {
        //console.log(result);
        result = replaceAt(result, match.index, match[0]);
        //console.log(result);
    })
    //console.log(result);

    return result;
}

function replaceAt(string, index, replacement) {
    return string.substring(0, index) + replacement + string.substring(index + replacement.length);
}
