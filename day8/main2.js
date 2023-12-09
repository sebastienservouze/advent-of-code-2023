import { readInput } from "../inputReader.js";

let input = readInput(8);
let answer = 0;

let lines = input.split('\r\n');

let possibleDirections = 'LR';
let directions;

// Map toutes les lignes vers des from / to
let entries = {};
lines.filter(line => line.length).forEach((line, i) => {
    // Première ligne = directions
    if (i === 0) {
        directions = line;
        return;
    }

    let noUselessChars = line.replaceAll(/[ ()]/g, '');
    let split = noUselessChars.split('=');
    let destinations = split[1].split(',');
    let from = split[0];

    entries[from] = destinations;
})

// Parcours
let startPositions = Object.keys(entries).filter(from => from.endsWith('A')).slice(0, 6);
let positions = [...startPositions];

let movesToReach = [];
let moves = [];
let paths = [];
for (let i = 0; i < startPositions.length; i++) {
    paths.push([]);
    movesToReach.push(0);
    moves.push(0);
}

console.log(`${startPositions.length} positions de départ`);

// Trouve combien de déplacement sont nécessaire pour arriver jusqu'à Z pour chaque entrée
do {
    for (let i = 0; i < positions.length; i++) {
        let direction = directions[moves[i] % directions.length];

        let entry = entries[positions[i]];
        positions[i] = entry[possibleDirections.indexOf(direction)];

        if (positions[i].endsWith('Z')) {
            movesToReach[i] = moves[i] + 1;
        }

        moves[i]++;
    }
}
while (!movesToReach.every(move => move !== 0));

console.log(movesToReach);


// PPCM :D
answer = getLeastCommonMultipleOfValues(movesToReach);
console.log(`Answer is '${answer}'`);

function getLeastCommonMultipleOfValues(values) {
    return values.reduce(getLeastCommonMultiple)
}

function getGreatestCommonDenominator(a, b) {
    return a ? getGreatestCommonDenominator(b % a, a) : b;
}

function getLeastCommonMultiple(a, b) {
    return a * b / getGreatestCommonDenominator(a, b);
}
