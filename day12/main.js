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
    answer += getPossibleSolutions(fieldRow.row, fieldRow.groups);
});

function getPossibleSolutions(row, groups) {
    
    // Si chaine vide (fin de la récursion)
    if (row.length === 0) {
        // Plus de groupes ? C'est un match !
        return groups.length === 0 ? 1 : 0;
    }

    // Si plus de groupes
    if (groups.length === 0) {
        // Plus de cassées on a tous les matchs !
        return !row.includes('#') ? 1 : 0;
    }

    let firstChar = row[0];
    let restOfRow = row.substring(1);

    // Si c'est un spring OK
    if (firstChar === ".") {
        return getPossibleSolutions(restOfRow, groups);
    }

    // Si c'est un spring KO
    if (firstChar === "#") {
        let group = groups[0];

        // On est au début d'un groupe, pour être ok, il doit être assez grand, complètement cassé et soit à la fin de la string, soit il ne se termine pas par un spring KO
        let isEnoughSpringsLeft = group <= row.length;
        let isAllBroken = !row.substring(0, group).includes('.');
        let isNextCharOperational = group === row.length || row.charAt(group) !== '#';

        if (isEnoughSpringsLeft && isAllBroken && isNextCharOperational) {
            return getPossibleSolutions(row.substring(group + 1), groups.slice(1));
        }

        return 0;
    }

    // Si c'est un inconnu
    if (firstChar === "?") {
        return getPossibleSolutions('#' + restOfRow, groups) + getPossibleSolutions('.' + restOfRow, groups);
    }
}


console.log(`Answer is '${answer}'`);