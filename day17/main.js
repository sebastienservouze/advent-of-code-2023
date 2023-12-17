import { readInput } from "../inputReader.js";

let input = readInput(17);
let answer = 0;
let map = input.split('\r\n');

const X = 0;
const Y = 1
const MAX_STRAIGHT = 3;

const coords = [0,0];
const END_COORDS = [map[0].length - 1, map.length - 1];
let node = {
    prevNode: null,
    prevNodes: [],
    coords: coords,
    heatLoss: 0,
    totalHeathLoss: 0,
    pathLength: 0
}
let endNodes = [];
let minHeatLoss = Number.MAX_VALUE;

progress(endNodes, node, map);
for (let i = 0; i < endNodes.length; i++) {
    displayPath(endNodes[i]);
}

answer = minHeatLoss;

function progress(endNodes, node, map) {

    // Si on a déjà ateint une fin
    if (endNodes.length > 0) {
        // Si on est déjà au dessus du min
        if (node.totalHeathLoss > minHeatLoss) {
            //console.log(`${node.coords} - ${node.totalHeathLoss} trop haut de ${node.totalHeathLoss - minHeatLoss}`);
            //return;
        }

        // Si on est trop loin de la ville de fin
        /*let distanceFromEnd = getDistanceFrom(node, END_COORDS);
        if (node.totalHeathLoss + distanceFromEnd > minHeatLoss) {
            //console.log(`${node.coords} - ${node.totalHeathLoss} trop loin de ${distanceFromEnd}`);
            return;
        }*/

        // Si on est déjà passé par la node, on sort
        //console.log(node.coords);
        if (node.prevNodes.some(n => n.coords.join(',') === node.coords.join(','))) {
            //console.log(`[${node.pathLength}] ${node.coords} - ${node.totalHeathLoss} déjà passé par là depuis ${node.prevNode.coords} en ${node.pathLength}`);
            return;
        }
    }

    // Si on est sur la dernière ville, on s'arrête
    if (node.coords.join(',') === END_COORDS.join(',')) {
        if (node.totalHeathLoss < minHeatLoss) {
            minHeatLoss = node.totalHeathLoss;
            endNodes.push(node);
            console.log('New min ! ' + minHeatLoss);   
            return;
        }
    }

    // Récupère les trois dernière directions depuis la node actuelle
    let lastDirections = getLastDirectionsFromNode(node, MAX_STRAIGHT);

    // Récupère les directions possibles depuis la node actuelle en prenant en compte les dernières directions
    let directions = getPossibleDirectionsFromNode(map, node, lastDirections);

    // Pour chaque direction possible
    for (let i = 0; i < directions.length; i++) {
        let newCoords = getCoordsPlusDirection(node.coords, directions[i]);
        let prevNodes = [...node.prevNodes];
        prevNodes.push(node);
        let newNode = {
            prevNode: node,
            prevNodes: prevNodes,
            coords: newCoords,
            heatLoss: +map[newCoords[Y]][newCoords[X]],
            totalHeathLoss: node.totalHeathLoss + +map[newCoords[Y]][newCoords[X]],
            pathLength: node.pathLength + 1,
        }
        progress(endNodes, newNode, map);
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
        return isInMap(map, newCoords) && !hasNodeCycle(node, newCoords);
    });

    possibleDirections = possibleDirections.map(dir => dir.split(',').map(coord => +coord));

    return possibleDirections;
}

function hasNodeCycle(node, coord) {
    while (node.prevNode !== null) {
        if (node.coords.join(',') === coord.join(',')) {
            return true;
        }

        node = node.prevNode;
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

function getDistanceFrom(node, destination) {
    return (destination[X] - node.coords[X]) + (destination[Y] - node.coords[Y]);
}

function displayPath(node) {
    while (node.prevNode !== null) {
        console.log(`[${node.pathLength}] ${node.coords} - ${node.heatLoss} - ${node.totalHeathLoss}`);
        node = node.prevNode;
    }
}

console.log(`Answer is '${answer}'`);