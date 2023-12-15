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
fieldRows.forEach(fieldRow => {
    
    // Récupère les matchs des ?
    let unknowns = [...fieldRow.row.matchAll(/\?/g)];

    // Récupère le nombre de springs endommagés manquants (n)
    let knownDamagedSprings = [...fieldRow.row.matchAll(/#/g)];
    let missingDamagedSprings = fieldRow.groups.reduce((acc, elem) => acc + elem) - knownDamagedSprings.length;

    // Crée une combinaison avec le nombre de spring endommagées manquantes
    for (let i = 0; i < missingDamagedSprings; i++) {
        unknowns[i][0] = '#';
    }

    // Récupère toutes les combinaisons possibles 
    let possibleCombinations = getCombinations(unknowns);

    // Remplace
    possibleCombinations.forEach(combinations => {
        let testString = getRemapedRow(combinations);
        let damagedGroups = testString.split('.');

        damagedGroups.map(group => group.length);
        if (JSON.stringify(damagedGroups) === JSON.stringify(fieldRow.groups)) {
            answer += 1;
        }
    })
});


console.log(`Answer is '${answer}'`);

function getCombinations(array) {
    console.log(array);
    return new Array(1 << array.length).fill().map(
      (e1, i) => array.filter((e2, j) => i & 1 << j));
}

function getRemapedRow(combination) {
    //console.log(combination);
    let result = combination[0].input;

    combination.forEach(match => {
        result = replaceAt(baseRow, match.index, match[0]);
    })

    result = result.replaceAll('?', '.');

    return result;
}

function replaceAt(string, index, replacement) {
    return string.substring(0, index) + replacement + string.substring(index + replacement.length);
}
