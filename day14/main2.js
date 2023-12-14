import { readInput } from "../inputReader.js";

let input = readInput(14);
let answer = 0;

let lines = input.split('\r\n');

let map = {
    rows: [],
    cols: new Array(lines[0].length).fill(''),
}

lines.forEach((line, i) => {
    map.rows.push(line);
    Array.from(line).forEach((char, j) => {
        map.cols[j] += char;
    })
})

// Trouve la taille d'un cycle de répétition
let currentMap = JSON.parse(JSON.stringify(map));
let startTime = performance.now();
let knownConfigurations = new Map();
let cycle = 0;
while (!knownConfigurations.has(currentMap.cols.join('\n'))) {

    knownConfigurations.set(currentMap.cols.join('\n'), cycle);

    // Tilt vers le nord
    currentMap.cols = currentMap.cols.map(col => tiltNorth(col));

    // Conversion en ligne
    currentMap.rows = colsToRows(currentMap.cols, currentMap.rows);

    // Tilt vers l'ouest 
    currentMap.rows = currentMap.rows.map(row => tiltNorth(row));

    // Conversion en colonnes
    currentMap.cols = rowsToCols(currentMap.rows, currentMap.cols);

    // Tilt vers le sud
    currentMap.cols = currentMap.cols.map(col => tiltSouth(col));

    // Conversion en ligne
    currentMap.rows = colsToRows(currentMap.cols, currentMap.rows);

    // Tilt vers l'est 
    currentMap.rows = currentMap.rows.map(row => tiltSouth(row));

    // Conversion en colonnes
    currentMap.cols = rowsToCols(currentMap.rows, currentMap.cols);

    if ((cycle + 1) % 1 == 0) {
        let currentTime = performance.now();
        let elapsedTime = currentTime - startTime;
        console.log(`Temps pour ${cycle + 1} cycles ${Math.round(elapsedTime / 1000 * 100) / 100}s > ${countScore(currentMap.cols)}`);
        startTime = currentTime;
    }

    cycle++;
}

let repetitionCycleLength = cycle - knownConfigurations.get(currentMap.cols.join('\n'));
let startCycleIndex = [...knownConfigurations.keys()].indexOf(currentMap.cols.join('\n'));
let cycleMaps = [...knownConfigurations.keys()].slice(startCycleIndex, startCycleIndex + repetitionCycleLength);


console.log(`Cycle de taille ${repetitionCycleLength} commence à l'index ${startCycleIndex}`);

let nbCycles = 1000000000;
answer = countScore(cycleMaps[(nbCycles - startCycleIndex) % repetitionCycleLength].split('\n'));

console.log(`Answer is '${answer}'`);

function tiltNorth(col) {
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
}

function tiltSouth(col) {
    // Découpe en sous colonnes en splittant par #
    let subCols = col.split('#');

    // Map chaque sous colonne vers sa version avec les O tout en haut
    let tiltedSubCols = subCols.map(subCol => {

        // Récupère les O
        let roundedRocks = [...subCol.matchAll(/O/g)];

        let tiltedSubCol = '.'.repeat(subCol.length - roundedRocks.length) + 'O'.repeat(roundedRocks.length);

        // Recrée la sous colonne avec le nombre de O suivi de n . (n = taille de la sous colonne moins nombre de O)
        return tiltedSubCol;
    })

    // Recrée la colonne complète en joignant les sous colonnes avec un #
    return tiltedSubCols.join('#');
}

function colsToRows(cols, rows) {
    rows = rows.map(row => '');
    cols.forEach((col, i) => {
        Array.from(col).forEach((char, j) => {
            rows[j] += char;
        })
    });

    return rows;
}

function rowsToCols(rows, cols) {
    cols = cols.map(col => '');
    rows.forEach((row, i) => {
        Array.from(row).forEach((char, j) => {
            cols[j] += char;
        })
    });
    
    return cols;
}

function countScore(cols) {
    let score = 0;
    cols.forEach(tiltedCol => {
        let roundedRocks = [...tiltedCol.matchAll(/O/g)];
        roundedRocks.forEach(roundedRock => score += tiltedCol.length - roundedRock.index);
    })

    return score;
}