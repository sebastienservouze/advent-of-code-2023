import { readInput } from "../inputReader.js";

let input = readInput(14);
let answer = 0;

let lines = input.split('\r\n');

let cols = new Array(lines[0].length).fill('');

lines.forEach((line) => {
    Array.from(line).forEach((char, j) => {
        cols[j] += char;
    })
})

// Récupère les colonnes une fois penchées
let tiltedCols = cols.map(col => {
    // Découpe en sous colonnes en splittant par #
    let subCols = col.split('#');

    // Map chaque sous colonne vers sa version avec les O tout en haut
    let tiltedSubCols = subCols.map(subCol => {

        // Récupère les O
        let roundedRocks = [...subCol.matchAll(/O/g)];

        let tiltedSubCol = 'O'.repeat(roundedRocks.length) + '.'.repeat(subCol.length - roundedRocks.length);

        // Recrée la sous colonne avec le nombre de O suivi de n . (n = taille de la sous colonne moins nombre de O)
        return tiltedSubCol;
    })

    // Recrée la colonne complète en joignant les sous colonnes avec un #
    return tiltedSubCols.join('#');
})

tiltedCols.forEach(tiltedCol => {
    let roundedRocks = [...tiltedCol.matchAll(/O/g)];
    roundedRocks.forEach(roundedRock => answer += tiltedCol.length - roundedRock.index);
})

console.log(`Answer is '${answer}'`);