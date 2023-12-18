import { readInput } from "../inputReader.js";

let input = readInput(18);
let answer = 0;

let lines = input.split('\r\n');

let instructions = lines.map(line => {
    let split = line.split(' ');
    return {
        dir: getDirFromLetter(split[0]),
        steps: +split[1],
    }
})

const X = 0;
const Y = 1;
let coords = [0, 0];

let path = [];
let segments = [];

instructions.forEach(instruction => {
    coords = moveBy(coords, instruction.dir, instruction.steps);
})

//console.log(path);
answer = getArea(path);
//displayPath(path);

function moveBy(coords, dir, steps) {
    for (let i = 0; i < steps; i++) {
        coords = getCoordsPlusDir(coords, dir);
        path.push([coords[X], coords[Y]]);
    }

    return coords;
}

function displayPath(path) {
    path.sort((a, b) => a[X] - b[X])[0][X];
    let minX = path[0][X];
    let maxX = path[path.length - 1][X];

    path.sort((a, b) => a[Y] - b[Y])[0][Y];
    let minY = path[0][Y];
    let maxY = path[path.length - 1][Y];

    for (let y = minY; y <= maxY; y++) {
        let row = '';
        for (let x = minX; x <= maxX; x++) {
            path.some(p => p[X] === x && p[Y] === y) ? row += '#' : row += '.';
            //console.log(x + ':' + y + ' = ' + row[x]);
        }
        console.log(row);
    }
}

function getArea(path) {
    let area = path.length;

    // Flemme de sort les deux d'un coup :')
    path.sort((a, b) => a[X] - b[X])[0][X];
    let minX = path[0][X];
    let maxX = path[path.length - 1][X];

    path.sort((a, b) => a[Y] - b[Y])[0][Y];
    let minY = path[0][Y];
    let maxY = path[path.length - 1][Y];
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            if (!path.some(p => p[X] === x && p[Y] === y)) {
                if (inside({x, y}, path)) {
                    area++;
                }
            }
        }
    }

    return area;
}

function getCoordsPlusDir(coords, dir) {
    return [coords[X] + dir[X], coords[Y] + dir[Y]];
}

function getDirFromLetter(letter) {
    if (letter === 'R') return [1, 0];
    if (letter === 'L') return [-1, 0];
    if (letter === 'D') return [0, 1];
    if (letter === 'U') return [0, -1];
}

function inside({x, y}, polygon) {       
    let inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][X];
        let yi = polygon[i][Y];
        let xj = polygon[j][X];
        let yj = polygon[j][Y];
        
        var intersect = (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

console.log(`Answer is '${answer}'`);