import { readInput } from "../inputReader.js";

let input = readInput(11);
let answer = 0;

let lines = input.split('\r\n');

/**
 * J'ai fais nimp, trop fatigué ajrd
 */

let universe = lines.map(() => []);
lines.forEach((row, y) => {
    row.split('').forEach((col, x) => {
        universe[y].push(col);
    })
})

console.log('Univers 0');
for (let y = 0; y < universe.length; y++) {
    console.log(universe[y].join(''));
}

// Duplication des lignes vides
let rowsAdded = 0;
let oString = universe[0].map(elem => 'o');
for (let y = 0; y < universe.length; y++) {
    console.log(`${y}: ${universe[y].join('')}`);
    let isGalaxyInRow = universe[y].some(elem => elem === '#');
    if (!isGalaxyInRow) {
        console.log('Pas de galaxie dans la ligne ' + (y - rowsAdded));
        universe.splice(y, 0, oString);
        rowsAdded++;
        y++;
    }
}

console.log('Univers 1');
for (let y = 0; y < universe.length; y++) {
    console.log(universe[y].join(''));
}

// Duplication des colonnes vides
let cols = universe[0].map(() => []);
for (let x = 0; x < cols.length; x++) {
    for (let y = 0; y < universe.length; y++) {
        cols[x].push(universe[y][x]);
    }
}

let colsAdded = 0;
for (let x = 0; x < cols.length; x++) {
    let isGalaxyInCol = cols[x].some(elem => elem === '#');
    if (!isGalaxyInCol) {
        console.log('Pas de galaxie dans la colonne ' + x);
        for (let y = 0; y < universe.length; y++) {
            //console.log(`${universe[y].join('').substring(0, x + colsAdded)}X${universe[y].join('').substring(x + colsAdded)}`);
            universe[y] = [
                universe[y].join('').substring(0, x + colsAdded),
                'o',
                universe[y].join('').substring(x + colsAdded)
            ];
        }
        colsAdded++;
    }
}

console.log('Univers 2');
for (let y = 0; y < universe.length; y++) {
    console.log(universe[y].join(''));
}

// Récupère les position des galaxies
let galaxies = [];
for (let y = 0; y < universe.length; y++) {
    [...universe[y].join('').matchAll(/#/g)].forEach(match => {
        galaxies.push({
            x: match.index,
            y: y
        })
    });
}

let pairs = [];
console.log('Check');
galaxies.forEach((a, i) => {
    galaxies.forEach((b, j) => {
        if (i === j || pairs.some(pair => pair.x === j && pair.y === i)) return;

        let minX = Math.min(a.x, b.x);
        let maxX = Math.max(a.x, b.x);
        let minY = Math.min(a.y, b.y);
        let maxY = Math.max(a.y, b.y);

        let colsBetweenAB = universe[minY].join('');
        let rowsBetweenAB = [];

        if (a.x === maxX) {
            colsBetweenAB = colsBetweenAB.substring(minX, a.x);
        } else if (a.x === minX) {
            colsBetweenAB = colsBetweenAB.substring(minX, b.x);
        }

        if (a.y === minY) {
            minY++;
        } 
        
        for (let y = minY; y <= maxY; y++) {
            rowsBetweenAB.push(universe[y].join('')[minX]);
        }

        let addedCols = [...colsBetweenAB.matchAll(/o/g)].length;
        let addedRows = [...rowsBetweenAB.join('').matchAll(/o/g)].length;

        let multiplier = 1000000;
        let distanceX = addedCols * (multiplier - 1) + colsBetweenAB.length - addedCols;
        let distanceY = addedRows * (multiplier - 1) + rowsBetweenAB.length - addedRows;
        
        //console.log(`Col ${i + 1} ${JSON.stringify(a)} vers ${j + 1} ${JSON.stringify(b)}: ${colsBetweenAB} (${distanceX})`);
        //console.log(`Row ${i + 1} ${JSON.stringify(a)} vers ${j + 1} ${JSON.stringify(b)}: ${rowsBetweenAB.join('')} (${distanceY})`);


        let distance = distanceX + distanceY;
        answer += distance;

        //console.log(`${i + 1} ${JSON.stringify(a)} vers ${j + 1} ${JSON.stringify(b)} => ${distance}`);
        
        pairs.push({
            x: i,
            y: j
        });
    })

    console.log(`Galaxie ${i} avec n'importe quel autre terminée > ${answer}`);
})

//console.log(pairs.length);

console.log(`Answer is '${answer}'`);