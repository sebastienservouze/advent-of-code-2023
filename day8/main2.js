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
let startPositions = Object.keys(entries).filter(from => from.endsWith('A'));
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

let lastlog = 0;
do {
    for (let i = 0; i < positions.length; i++) {
        let direction = directions[moves[i] % directions.length];
       
        // Si on est le plus grand move to reach, on passe
        /*let maxMoveToReach = getMaxMoveToReach(moves[i]);
        if (movesToReach[i] === maxMoveToReach && maxMoveToReach > 0) {
            // console.log(`[${moves[i]}|${startPositions[i]}|${positions[i]}|${direction}]: Let others catch up !`);
            continue;
        }*/

        let entry = entries[positions[i]];
        positions[i] = entry[possibleDirections.indexOf(direction)];

        /*// Cherche un chemin avec cette position
        let existingEntry = paths[i].find(path => path.position === positions[i] && path.direction === direction);
        if (!existingEntry) {
            paths[i].push({
                position: positions[i],
                direction: direction
            });

            //console.log(`[${moves[i]}|${startPositions[i]}|${positions[i]}|${direction}]: New entry !`);
        }
        // Si la position existe
        else {
            // Cherche le chemin correspondant
            let existingPath = paths.find(path => path.includes(existingEntry));
            let currentEntry = existingPath.find(entries => entries.position === positions[i] && entries.direction === direction)
            let indexOfCurrentEntry = existingPath.indexOf(currentEntry);
            let Z = existingPath.find(entries => entries.position.endsWith('Z'));
            if (Z) {
                let indexOfZ = existingPath.indexOf(Z);
                let moveToZ = indexOfZ - indexOfCurrentEntry + 1;
                moves[i] += moveToZ;
                movesToReach[i] = moves[i];
                console.log(positions[i]);
                positions[i] = Z.position;
                console.log(`[${moves[i]}|${startPositions[i]}|${positions[i]}|${direction}]: Found a path to Z in ${moves[i]} moves `);
                continue;
            }
            /*else {
                let end = existingPath.length - 1;
                let moveToEnd = end - indexOfCurrentEntry + 1
                moves[i] += moveToEnd;
                positions[i] = existingPath[existingPath.length - 1].position;
                //console.log(existingPath);
                console.log(`[${moves[i]}|${startPositions[i]}|${positions[i]}|${direction}]: Found a path from ${currentEntry.position} to ${existingPath[existingPath.length - 1].position} in ${moves[i]} moves (+${moveToEnd}) `);
                continue;
            }
        }*/

        // Sinon, on passe directement au premier Z de ce chemin

    
        //console.log(`[${moves}|${startPositions[i]}]: ${oldPos} - ${direction} - ${entry} > ${positions[i]}`);

        if (positions[i].endsWith('Z')) {
            movesToReach[i] = moves[i] + 1;
            //console.log(`[${moves[i]}|${startPositions[i]}|${positions[i]}|${direction}]: found Z after ${moves[i] + 1} moves`);
            // console.log(movesToReach);
        }

        moves[i]++;
    }
}
while (!movesToReach.every(move => move !== 0));

console.log(movesToReach);

// Tant que tout les chiffres ne sont pas égaux
// Multiplie le chiffre le plus bas jusqu'à ce qu'il ne soit plus le bas

let startMovesToReach = [...movesToReach];
let loops = 0;
while (!movesToReach.every(move => move === movesToReach[0])) {
    let minMoveToReach = getMinMoveToReach();
    let indexOfMinMoveToReach = movesToReach.indexOf(minMoveToReach);
    while (movesToReach[indexOfMinMoveToReach] === getMinMoveToReach()) {
        movesToReach[indexOfMinMoveToReach] += startMovesToReach[indexOfMinMoveToReach];
    }

    let equals = movesToReach.filter(move => move === movesToReach[indexOfMinMoveToReach]).length;
    if (equals > 4) {
        console.log(movesToReach);
        console.log(equals);
    }
    
    // loops++;
    // if (loops % 10000000 === 0) {
        
    // }
}


console.log(`Answer is '${answer}'`);

function getMinMoveToReach() {
    let minMoveToReach = Number.MAX_VALUE;
    for (let i = 0; i < movesToReach.length; i++) {
        minMoveToReach = Math.min(movesToReach[i], minMoveToReach);
    }

    return minMoveToReach;
}