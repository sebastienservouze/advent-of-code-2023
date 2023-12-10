import { readInput } from "../inputReader.js";

let input = readInput(10);
let answer = 0;

let lines = input.split('\r\n');

// Mapping
let map = lines.map(() => []);
let startPos;
lines.forEach((line, y) => {
    line.split('').forEach((char, x) => {
        map[y].push(char);
        if (char === 'S') {
            startPos = {x, y};
        }
    })
})

// Pipes
let pipes = [
    { char: '|', directionsX: [], directionsY: [-1, 1] },
    { char: '-', directionsX: [-1, 1], directionsY: [] },
    { char: 'L', directionsX: [1], directionsY: [-1] },
    { char: 'J', directionsX: [-1], directionsY: [-1] },
    { char: '7', directionsX: [-1], directionsY: [1] },
    { char: 'F', directionsX: [1], directionsY: [1] },
    { char: '.', directionsX: [], directionsY: [] },
]

console.log(`Start is [${startPos.x}:${startPos.y}] '${getPipeFromAdjacentOnes(startPos).char}'`);

// Parcours
let startPositions = getAvailableAdjacentCoords(startPos);
let moves = startPositions.map(() => [1]);
for (let i = 0; i < startPositions.length; i++) {
    console.log(`Début du parcours ${i}`);
    let oldPos = JSON.parse(JSON.stringify(startPos));
    let currentPos = startPositions[i];
    let temp;
    do {
        temp = JSON.parse(JSON.stringify(currentPos));

        currentPos = getNextPostion(currentPos, oldPos);
        moves[i]++;
        //console.log(`Move ${moves[i]} [${oldPos.x};${oldPos.y}] > [${temp.x};${temp.y}] > [${currentPos.x};${currentPos.y}]`);

        oldPos = temp;

    } while (map[currentPos.y][currentPos.x] !== 'S');
}

answer = moves.sort()[moves.length - 1] / 2;

console.log(`Answer is '${answer}'`);

function getAllAdjacentCoords({x, y}) {
    let adjacentCoords = [];

    if (x > 0) adjacentCoords.push({ x: x - 1, y});
    if (x < map[y].length - 1) adjacentCoords.push({ x: x + 1, y});
    if (y > 0) adjacentCoords.push({ x, y: y - 1});
    if (y < map.length - 1) adjacentCoords.push({x, y: y + 1});

    return adjacentCoords;
}

function getAvailableAdjacentCoords({x, y}) {
    let currentPipe = map[y][x];
    if (currentPipe === 'S') {
        currentPipe = getPipeFromAdjacentOnes({x, y}).char;
    }

    let availaibleAdjacentCoords = [];

    let pipe = pipes.find(pipe => pipe.char === currentPipe);
    for (let i = 0; i < pipe.directionsX.length; i++) {
        availaibleAdjacentCoords.push({x: x + pipe.directionsX[i], y});
    }

    for (let i = 0; i < pipe.directionsY.length; i++) {
        availaibleAdjacentCoords.push({x, y: y + pipe.directionsY[i]});
    }

    //console.log(`Coordonnées disponibles depuis [${x}][${y}]: ${JSON.stringify(availaibleAdjacentCoords)}`);

    return availaibleAdjacentCoords;
}

function getPipeFromAdjacentOnes({x, y}) {
    let adjacentCoords = getAllAdjacentCoords({x, y});

    // Récupère les cellules adacentes qui mène à x y
    let adjacentCoordsLeadingToCoord = [];
    adjacentCoords.forEach(coords => {
        let correspondingCoords = getAvailableAdjacentCoords(coords).find(coord => coord.x === x && coord.y === y);
        if (correspondingCoords) {
            adjacentCoordsLeadingToCoord.push(coords);
        }
    })

    // Transforme les coordonnées en direction
    let directionsToCoords = adjacentCoordsLeadingToCoord.map(coords => {
        return {
            x: coords.x - x,
            y: coords.y - y,
        }
    });

    // Met en forme les directions
    let directionsX = [];
    let directionsY = [];
    directionsToCoords.forEach(directions => {
        if (directions.x !== 0) directionsX.push(directions.x);
        if (directions.y !== 0) directionsY.push(directions.y);
    })
    
    return pipes.find(pipe => JSON.stringify(pipe.directionsX) === JSON.stringify(directionsX) && JSON.stringify(pipe.directionsY) === JSON.stringify(directionsY));
}

function getNextPostion(currentPos, lastPos) {
    let availaibleAdjacentCoords = getAvailableAdjacentCoords(currentPos);
    let nextPosition;
    nextPosition = availaibleAdjacentCoords.find(coords => JSON.stringify(coords) !== JSON.stringify(lastPos));
    //console.log(`[${lastPos.x};${lastPos.y}] > [${currentPos.x};${currentPos.y}] > [${nextPosition.x};${nextPosition.y}]`);

    return nextPosition;
}