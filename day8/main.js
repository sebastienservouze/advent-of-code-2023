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
let moves = 0;
let position = 'AAA';

answer = getMovesToReachDestination(position, 'ZZZ');

console.log(`Answer is '${answer}'`);

function getMovesToReachDestination(startPos, destination) {
    let position = startPos;
    do {
        let oldPos = position;
        let entry = entries[position];
        let direction = directions[moves % directions.length];
        position = entry[possibleDirections.indexOf(direction)];
        console.log(`[${moves}]: ${oldPos} > ${position}`);
        moves++;
    }
    while (position !== destination);

    return moves;
}