import { readInput } from "../inputReader.js";

let input = readInput(17);
let answer = 0;
let map = input.split('\r\n');

const X = 0;
const Y = 1
const MAX_STRAIGHT = 3;
const END_COORDS = [map[0].length - 1, map.length - 1].join(',');

let visitedNodes = [];
let unvisitedNodes = [];
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        let node = {
            prevNode: null,
            coords: [x, y],
            totalHeathLoss: Number.MAX_VALUE,
        }
        unvisitedNodes.push(node);
    }
}

unvisitedNodes[0].totalHeathLoss = 0;

let minHeatLoss = Number.MAX_VALUE;
let bestEndNode = null;

progress();

displayPath(bestEndNode);

answer = minHeatLoss;

function progress() {
    while (unvisitedNodes.length > 0) {
        let node = unvisitedNodes.shift();
        visitedNodes.push(node);
        console.log(`${node.coords} > ${node.totalHeathLoss} (${map[node.coords[Y]][node.coords[X]]})`);

        if (node.coords.join(',') === END_COORDS) {
            minHeatLoss = Math.min(minHeatLoss, node.totalHeathLoss);
            bestEndNode = node;
            continue;
        }

        let possibleDirections = getPossibleDirectionsFromNode(map, node, getLastDirectionsFromNode(node, MAX_STRAIGHT));
        for (let i = 0; i < possibleDirections.length; i++) {
            let nextCoords = getCoordsPlusDirection(node.coords, possibleDirections[i])
            let nextNode = unvisitedNodes.find(n => n.coords[X] === nextCoords[X] && n.coords[Y] === nextCoords[Y]);

            if (node.coords.join(',') === '0,0') {
                nextNode.prevNode = node;
                nextNode.totalHeathLoss = +map[nextNode.coords[Y]][nextNode.coords[X]];
            } else if (nextNode.totalHeathLoss > node.totalHeathLoss + +map[nextNode.coords[Y]][nextNode.coords[X]]) {
                nextNode.prevNode = node;
                nextNode.totalHeathLoss = node.totalHeathLoss + +map[nextNode.coords[Y]][nextNode.coords[X]];
            }
            //console.log(`Next ${nextNode.coords} > ${nextNode.totalHeathLoss}`);
        }

        if (possibleDirections.length === 0) {
            console.log(`${node.coords} Fin du chemin`);
            //return;
        }

        unvisitedNodes.sort((a, b) => a.totalHeathLoss - b.totalHeathLoss);
        //unvisitedNodes.filter(n => n.totalHeathLoss < Number.MAX_VALUE).forEach(n => console.log(`${n.coords} - ${n.totalHeathLoss}`));
    }
}

function getLastDirectionsFromNode(node, nbDirections) {
    let lastDirections = [];
    let currentNode = node;
    while (lastDirections.length < nbDirections && currentNode.prevNode !== null) {
        lastDirections.push(getDirectionFromANodeToB(currentNode.prevNode, currentNode));
        currentNode = currentNode.prevNode;
    }

    return lastDirections;
}

function getPossibleDirectionsFromNode(map, node, lastDirections) {
    let lastDirection = lastDirections[lastDirections.length - 1];
    let possibleDirections = [
        '1,0',
        '-1,0',
        '0,1',
        '0,-1'
    ];

    // Si les dernières directions sont toutes les mêmes, on ne peut pas aller dans cette direction
    if (lastDirection && lastDirections.length === MAX_STRAIGHT && lastDirections.every(dir => dir[X] === lastDirection[X] && dir[Y] === lastDirection[Y])) {
        let indexOfLastDirectionInPossibleDirections = possibleDirections.indexOf(lastDirection.join(','));
        possibleDirections.splice(indexOfLastDirectionInPossibleDirections, 1);
    }

    if (lastDirection) {
        let oppositeDirection = [-lastDirection[X], -lastDirection[Y]];
        let indexOfOppositeDirectionInPossibleDirections = possibleDirections.indexOf(oppositeDirection.join(','));
        possibleDirections.splice(indexOfOppositeDirectionInPossibleDirections, 1);
    }

    // Ne garde que les directions qui sont dans la map
    possibleDirections = possibleDirections.filter(dir => {
        let newCoords = getCoordsPlusDirection(node.coords, dir.split(',').map(v => +v))
        return isInMap(map, newCoords) && !hasAlreadyGoneThroughCoords(newCoords);
    });

    possibleDirections = possibleDirections.map(dir => dir.split(',').map(coord => +coord));

    return possibleDirections;
}

function hasAlreadyGoneThroughCoords(coord) {
    if (visitedNodes.some(n => n.coords.join(',') === coord.join(','))) {
        //console.log(`${coord} - déjà passé par là`);
        return true;
    }

    return false;
}

function isInMap(map, coords) {
    return coords[X] >= 0 && coords[X] < map[0].length && coords[Y] >= 0 && coords[Y] < map.length;
}

function getDirectionFromANodeToB(a, b) {
    return [b.coords[X] - a.coords[X], b.coords[Y] - a.coords[Y]];
}

function getCoordsPlusDirection(coords, direction) {
    return [coords[X] + direction[X], coords[Y] + direction[Y]];
}

function displayPath(node) {
    while (node.prevNode !== null) {
        console.log(`${node.coords} - ${node.totalHeathLoss} (${map[node.coords[Y]][node.coords[X]]}) (${getDirectionFromANodeToB(node.prevNode, node)})`);
        node = node.prevNode;
    }
}

console.log(`Answer is '${answer}'`);