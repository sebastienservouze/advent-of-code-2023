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


// Flemme de calculer le PPCM, on brute force :D
let startMovesToReach = [...movesToReach];
while (!movesToReach.every(move => move === movesToReach[0])) {
    let minMoveToReach = getMinMoveToReach();
    let indexOfMinMoveToReach = movesToReach.indexOf(minMoveToReach);

    while (movesToReach[indexOfMinMoveToReach] === getMinMoveToReach() && !movesToReach.every(move => move === movesToReach[indexOfMinMoveToReach])) {
        movesToReach[indexOfMinMoveToReach] += startMovesToReach[indexOfMinMoveToReach];
    }    
}

console.log(`Answer is '${movesToReach[0]}'`);

function getMinMoveToReach() {
    let minMoveToReach = Number.MAX_VALUE;
    for (let i = 0; i < movesToReach.length; i++) {
        minMoveToReach = Math.min(movesToReach[i], minMoveToReach);
    }

    return minMoveToReach;
}