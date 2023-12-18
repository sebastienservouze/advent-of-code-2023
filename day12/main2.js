import { readInput } from "../inputReader.js";

let input = readInput(12);
let answer = 0;

let lines = input.split('\r\n');
let cache = new Map();

// Parsing
let fieldRows = lines.map(line => {
    let split = line.split(' ');
    return {
        row: new Array(5).fill(split[0]).join('?'),
        groups: new Array(5).fill(split[1]).join(',').split(',').map(g => +g),
    };
})

// Traitement
fieldRows.forEach(fieldRow => {
    answer += getPossibleSolutions(fieldRow.row, fieldRow.groups);
    //console.log(cache);
});

function getPossibleSolutions(row, groups) {
    
    let identifier = row + '|' + groups.join(',');
    if (cache.has(identifier)) {
        return cache.get(identifier);
    }

    // Si chaine vide (fin de la récursion)
    if (row.length === 0) {
        // Plus de groupes ? C'est un match !
        let result = groups.length === 0 ? 1 : 0;
        cache.set(identifier, result);
        return result;
    }

    // Si plus de groupes
    if (groups.length === 0) {
        // Plus de cassées on a tous les matchs !
        let result = !row.includes('#') ? 1 : 0;
        cache.set(identifier, result);
        return result;
    }

    let firstChar = row[0];
    let restOfRow = row.substring(1);

    // Si c'est un spring OK
    if (firstChar === ".") {
        let result = getPossibleSolutions(restOfRow, groups);
        cache.set(identifier, result);
        return result;
    }

    // Si c'est un spring KO
    if (firstChar === "#") {
        let group = groups[0];

        // On est au début d'un groupe, pour être ok, il doit être assez grand, complètement cassé et soit à la fin de la string, soit il ne se termine pas par un spring KO
        let isEnoughSpringsLeft = group <= row.length;
        let isAllBroken = !row.substring(0, group).includes('.');
        let isNextCharOperational = group === row.length || row.charAt(group) !== '#';

        if (isEnoughSpringsLeft && isAllBroken && isNextCharOperational) {
            let result = getPossibleSolutions(row.substring(group + 1), groups.slice(1));
            cache.set(identifier, result);
            return result;
        }

        cache.set(identifier, 0);
        return 0;
    }

    // Si c'est un inconnu
    if (firstChar === "?") {
        let result = getPossibleSolutions('#' + restOfRow, groups) + getPossibleSolutions('.' + restOfRow, groups);
        cache.set(identifier, result);
        return result;
    }
}


console.log(`Answer is '${answer}'`);