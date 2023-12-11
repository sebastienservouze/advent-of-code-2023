import { readInput } from "../inputReader.js";

let input = readInput(11);
let answer = 0;

let lines = input.split('\r\n');

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
for (let y = 0; y < universe.length; y++) {
    let isGalaxyInRow = universe[y].some(elem => elem === '#');
    if (!isGalaxyInRow) {
        universe.splice(y, 0, universe[y]);
        y++;
    }
}

console.log('Univers 1');
for (let y = 0; y < universe.length; y++) {
    console.log(universe[y].join(''));
}

// Duplication des colonnes vides
let cols = universe[0].map(() => []);
let columnsAdded = 0;
for (let x = 0; x < cols.length; x++) {
    for (let y = 0; y < universe.length; y++) {
        cols[x].push(universe[y][x]);;
    }

    let isGalaxyInCol = cols[x].some(elem => elem === '#');
    if (!isGalaxyInCol) {
        console.log('Pas de galaxie dans la colonne ' + x);
        for (let y = 0; y < universe.length; y++) {
            // Splice fonctionne pas, personne sait
            console.log(y + ': ' + universe[y].join(''));
            universe[y] = [
                universe[y].join('').substring(0, x),
                '.',
                universe[y].join('').substring(x)
            ];
            console.log(y + ': ' + universe[y].join(''));
        }
        x++;
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
galaxies.forEach((a, i) => {
    galaxies.forEach((b, j) => {
        if (i === j || pairs.some(pair => pair.x === j && pair.y === i)) return;

        let distance = Math.abs((b.x - a.x) + (b.y - a.y));
        answer += distance;

        console.log(`${i + 1} ${JSON.stringify(a)} vers ${j + 1} ${JSON.stringify(b)} => ${distance}`);
        
        pairs.push({
            x: i,
            y: j
        });
    })
})

console.log(pairs.length);

console.log(`Answer is '${answer}'`);