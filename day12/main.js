import { readInput } from "../inputReader.js";

let input = readInput(12);
let answer = 0;

let lines = input.split('\r\n');

// Parsing
let fieldRows = []
lines.forEach(line => {
    let split = line.split(' ');
    fieldRows.push({
        row: split[0],
        damagedGroups: split[1].split(',').map(char => parseInt(char))
    });

})

// Traitement
fieldRows.forEach(fieldRow => {
    console.log(`Information de ${JSON.stringify(fieldRow)}`);
    
    // Détermine les groupes naturels potentiellements cassés
    let naturalGroups = fieldRow.row.split('.').filter(group => group !== '');
    let knownDamagedGroups = naturalGroups.filter(group => group === '#'.repeat(group.length));
    let unknownGroups = naturalGroups.filter(group => group.includes('?'));
    let unknownMatchs = [...fieldRow.row.matchAll(/\?/g)];

    console.log(naturalGroups);
    console.log(knownDamagedGroups);
    console.log(unknownGroups);
    console.log(unknownMatchs);

    // Récupère le nombre de groupes restant à créer
    let groupsToMake = fieldRow.damagedGroups.filter(group => !knownDamagedGroups.some(kGroup => kGroup.length === group))

    // Calcule le nombre de groupes endommagés pouvant être créés à partir des groupes inconnus restants
    let possibleGroups = 0;

    // Pour chaque groupe à créer
    for (let k = 0; k < groupsToMake.length; k++) {

    }

    console.log(possibleGroups);
    
});

function replaceAt(string, index, replacement) {
    return string.substring(0, index) + replacement + string.substring(index + replacement.length);
}


console.log(`Answer is '${answer}'`);