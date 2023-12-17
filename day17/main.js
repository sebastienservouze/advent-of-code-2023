import { readInput } from "../inputReader.js";

let input = readInput(17);
let answer = 0;
let map = input.split('\r\n');

const X = 0;
const Y = 1
const MAX_STRAIGHT = 3;
const END_COORDS = [map[0].length - 1, map.length - 1].join(',');

let visitedNodes = new Set();
let unvisitedNodes = [{
    heatLoss: 0,
    coords: [0,0],
    dir: [0, 0],
    lastDirs: [],
}];

let minHeatLoss = Number.MAX_VALUE;
let bestEndNode = null;

let iterations = 0;
dijkstrat();

//displayPath(bestEndNode);

answer = minHeatLoss;

function dijkstrat() {
    while (unvisitedNodes.length > 0) {
        iterations++;

        let node = unvisitedNodes.shift();

        if (iterations % 10000 == 0) {
            console.log(`${node.coords} > ${node.heatLoss} (${node.dir} ${node.lastDirs}) - ${unvisitedNodes.length}/${visitedNodes.size}`);
        }

        visitedNodes.add(getIdentifierNode(node));

        if (node.coords.join(',') === END_COORDS) {
            minHeatLoss = Math.min(minHeatLoss, node.totalHeathLoss);
            bestEndNode = node;
            continue;
        }

        let possibleDirections = getPossibleDirectionsFromNode(map, node);
        for (let i = 0; i < possibleDirections.length; i++) {
            let nextCoords = getCoordsPlusDirection(node.coords, possibleDirections[i])
            let lastDirs = [...node.lastDirs];
            lastDirs.push(possibleDirections[i]);
            let nextNode = {
                heatLoss: node.heatLoss + +map[nextCoords[X]][nextCoords[Y]],
                coords: nextCoords,
                dir: possibleDirections[i],
                lastDirs: lastDirs.slice(0, MAX_STRAIGHT),
            }

            unvisitedNodes.push(nextNode);
        }

        unvisitedNodes.sort((a, b) => a.heatLoss - b.heatLoss);
        //unvisitedNodes.filter(n => n.totalHeathLoss < Number.MAX_VALUE).forEach(n => console.log(`${n.coords} - ${n.totalHeathLoss}`));
    }
}

function getPossibleDirectionsFromNode(map, node) {
    let possibleDirections = [
        '1,0',
        '-1,0',
        '0,1',
        '0,-1'
    ];

    // Si les dernières directions sont toutes les mêmes, on ne peut pas aller dans cette direction
    if (node.lastDirs.length === MAX_STRAIGHT && node.lastDirs.every(dir => dir[X] === node.dir[X] && dir[Y] === node.dir[Y])) {
        let indexOfLastDirectionInPossibleDirections = possibleDirections.indexOf(node.dir.join(','));
        possibleDirections.splice(indexOfLastDirectionInPossibleDirections, 1);
    }

    let oppositeDirection = [-node.dir[X], -node.dir[Y]];
    let indexOfOppositeDirectionInPossibleDirections = possibleDirections.indexOf(oppositeDirection.join(','));
    possibleDirections.splice(indexOfOppositeDirectionInPossibleDirections, 1);

    // Ne garde que les directions qui sont dans la map et par lesquelles on est pas déjà passé
    possibleDirections = possibleDirections.filter(dir => {
        let newCoords = getCoordsPlusDirection(node.coords, dir.split(',').map(v => +v))
        let lastDirs = [...node.lastDirs];
        lastDirs.push(dir.split(','));
        return isInMap(map, newCoords) && !hasAlreadyGoneThrough(newCoords, dir, lastDirs);
    });

    possibleDirections = possibleDirections.map(dir => dir.split(',').map(coord => +coord));

    //console.log(`${node.coords} - ${node.dir} - ${node.lastDirs} - ${possibleDirections}`)

    return possibleDirections;
}

function hasAlreadyGoneThrough(coord, dir, lastDirs) {
    // if (visitedNodes.some(n => n.coords.join(',') === coord.join(',') && (n.dir.join(',') === dir) && n.lastDirs.join(',') === lastDirs.join(','))) {
    if (visitedNodes.has(getIdentifier(coord, dir, lastDirs))) {
        //console.log(`${coord} - déjà passé par là`);
        return true;
    }

    return false;
}

function isInMap(map, coords) {
    return coords[X] >= 0 && coords[X] < map[0].length && coords[Y] >= 0 && coords[Y] < map.length;
}

function getCoordsPlusDirection(coords, direction) {
    return [coords[X] + direction[X], coords[Y] + direction[Y]];
}

function getIdentifier(coord, dir, lastDirs) {
    //console.log(`${coord}|${dir}|${lastDirs}`);
    return `${coord}|${lastDirs}`;
}

function getIdentifierNode(node) {
    //console.log(`${node.coords}|${node.dir}|${node.lastDirs}`);
    return `${node.coords}|${node.lastDirs}`;
}

function displayPath(node) {
    while (node.prevNode !== null) {
        console.log(`${node.coords} - ${node.totalHeathLoss} (${map[node.coords[Y]][node.coords[X]]})`);
        node = node.prevNode;
    }
}

console.log(`Answer is '${answer}'`);