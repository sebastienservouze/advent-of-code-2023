import { readInput } from "../inputReader.js";
import { Heap } from "heap-js"

let input = readInput(17);
let answer = 0;
let map = input.split('\r\n');

const X = 0;
const Y = 1
const MAX_STRAIGHT = 3;
const END_COORDS = [map[0].length - 1, map.length - 1];
const DIRECTIONS = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
]

let visitedNodes = new Set();
let unvisitedNodes = new Heap(nodeComparator)
unvisitedNodes.init([{
    heatLoss: 0,
<<<<<<< HEAD
    totalHeathLoss: 0,
    pathLength: 0
}

let minHeatLossNode = null;


let path = [
    [1, 0],
    [2, 0],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
    [5, 0],
    [6, 0],
    [7, 0],
    [8, 0],
    [8, 1],
    [8, 2],
    [9, 2],
    [10, 2],
    [10, 3],
    [10, 4],
    [11, 4],
    [11, 5],
    [11, 6],
    [11, 7],
    [12, 7],
    [12, 8],
    [12, 9],
    [12, 10],
    [11, 10],
    [11, 11],
    [11, 12],
    [12, 12],
]

let minTheorical = (map.length + map[0].length) * 8; // Avec une moyenne de 8
/*let totalHeathLoss = 0;
for (let i = 0; i < path.length; i++) {
    totalHeathLoss += +map[path[i][Y]][path[i][X]];
}*/

let startTime = performance.now();
progress(node, map);
displayPath(minHeatLossNode);
let currentTime = performance.now();
let elapsedTime = currentTime - startTime;
console.log(`${Math.round(elapsedTime / 1000 * 100) / 100}s`);

answer = minHeatLossNode.totalHeathLoss;

function progress(node, map) {

    // Si on est sur la dernière ville, on s'arrête
    if (node.coords[X] === END_COORDS[X] && node.coords[Y] === END_COORDS[Y]) {

        node.totalHeathLoss -= +map[0][0];
        if (minHeatLossNode === null || node.totalHeathLoss < minHeatLossNode.totalHeathLoss) {
            minHeatLossNode = node;
            console.log('New min ! ' + node.totalHeathLoss);   
        }

        return;
    }

    // Si on a déjà ateint une fin
    if (minHeatLossNode !== null) {
        // Si on est déjà au dessus du min
        if (node.totalHeathLoss > minHeatLossNode.totalHeathLoss || node.totalHeathLoss > minTheorical) {
            //console.log(`${node.coords} - ${node.totalHeathLoss} trop haut de ${node.totalHeathLoss - minHeatLossNode.totalHeathLoss}`);
            return;
        }

        // Si on est trop loin de la ville de fin
        let distanceFromEnd = getDistanceFrom(node, END_COORDS);
        if (node.totalHeathLoss + distanceFromEnd > minHeatLossNode.totalHeathLoss) {
            //console.log(`${node.coords} - ${node.totalHeathLoss} trop loin de ${distanceFromEnd}`);
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
        progress(newNode, map);
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
        [1,0],
        [-1,0],
        [0,1],
        [0,-1]
    ];

    // Si les dernières directions sont toutes les mêmes, on ne peut pas aller dans cette direction
    if (lastDirection && lastDirections.length === MAX_STRAIGHT && lastDirections.every(dir => dir[X] === lastDirection[X] && dir[Y] === lastDirection[Y])) {
        let indexOfLastDirectionInPossibleDirections = possibleDirections.findIndex(dir => dir[X] === lastDirection[X] && dir[Y] === lastDirection[Y]);
        possibleDirections.splice(indexOfLastDirectionInPossibleDirections, 1);
    }

    if (lastDirection) {
        let oppositeDirection = [-lastDirection[X], -lastDirection[Y]];
        let indexOfOppositeDirectionInPossibleDirections = possibleDirections.findIndex(dir => dir[X] === oppositeDirection[X] && dir[Y] === oppositeDirection[Y]);
        possibleDirections.splice(indexOfOppositeDirectionInPossibleDirections, 1);
    }

    // Ne garde que les directions qui sont dans la map
    possibleDirections = possibleDirections.filter(dir => {
        let newCoords = getCoordsPlusDirection(node.coords, dir)
        return isInMap(map, newCoords) && !node.prevNodes.some(n => n.coords[X] === newCoords[X] && n.coords[Y] === newCoords[Y]);
    });

    return possibleDirections;
}

function isInMap(map, coords) {
=======
    coords: [0, 0],
    dir: [0, 0],
    consecutives: 0,
}]);


let minHeatLoss = Number.MAX_VALUE;
let bestEndNode = null;

let iterations = 0;
measure('Durée du traitement: ', dijkstrat);
answer = minHeatLoss;

function dijkstrat() {
    while (unvisitedNodes.length > 0) {
        iterations++;
        let node = unvisitedNodes.peek();
        unvisitedNodes.remove(node);

        if (iterations % 10000 === 0) {
            console.log(`${node.coords} > ${node.heatLoss} (${node.dir} ${node.consecutives}) - ${unvisitedNodes.length}/${visitedNodes.size}`);
        }

        if (equal2D(node.coords, END_COORDS)) {
            minHeatLoss = Math.min(minHeatLoss, node.heatLoss);
            bestEndNode = node;
            return;
        }

        // Déjà passé par là ?
        if (visitedNodes.has(getIdentifier(node.coords, node.dir, node.consecutives))) {
            continue;
        }

        visitedNodes.add(getIdentifierNode(node));

        for (let i = 0; i < DIRECTIONS.length; i++) {
            let nextCoords = getCoordsPlusDirection(node.coords, DIRECTIONS[i])

            // Opposé ?
            let oppositeDirection = [-node.dir[X], -node.dir[Y]];
            if (equal2D(DIRECTIONS[i], oppositeDirection)) {
                continue;
            }

            // Hors map ?
            if (!isInMap(nextCoords)) {
                continue;
            }

            // Tout droit alors qu'on peut pas ?
            let consecutives = 0;
            if (equal2D(DIRECTIONS[i], node.dir)) {
                if (node.consecutives === MAX_STRAIGHT) {
                    continue;
                }
                else {
                    consecutives = node.consecutives + 1;
                }
            } else {
                consecutives = 1;
            }

            let nextNode = {
                heatLoss: node.heatLoss + +map[nextCoords[Y]][nextCoords[X]],
                coords: nextCoords,
                dir: DIRECTIONS[i],
                consecutives: consecutives,
            }

            unvisitedNodes.push(nextNode);
        }

        //unvisitedNodes.filter(n => n.totalHeathLoss < Number.MAX_VALUE).forEach(n => console.log(`${n.coords} - ${n.totalHeathLoss}`));
    }
}


function isInMap(coords) {
>>>>>>> dijkstrat
    return coords[X] >= 0 && coords[X] < map[0].length && coords[Y] >= 0 && coords[Y] < map.length;
}

function getCoordsPlusDirection(coords, direction) {
    return [coords[X] + direction[X], coords[Y] + direction[Y]];
}

function getIdentifier(coord, dir, consecutives) {
    return `${coord}|${dir}|${consecutives}`;
}

function getIdentifierNode(node) {
    return getIdentifier(node.coords, node.dir, node.consecutives);
}

function displayPath(node) {
    while (node.prevNode !== null) {
        console.log(`${node.coords} - ${node.heatLoss} / ${node.dir} ${node.consecutives}`);
        node = node.prevNode;
    }
}

<<<<<<< HEAD
function isSamePath(node, path) {
    for (let i = 1; i < path.length; i++) {
        if (node.prevNodes[i].coords.join(',') !== path[i].join(',')) {
            return false;
        }
    }
    return true;
=======
function equal2D(a, b) {
    return a[0] === b[0] && a[1] == b[1];
}

function nodeComparator(a, b) {
    return a.heatLoss - b.heatLoss;
}

function measure(str, fn) {
    let startTime = performance.now();
    fn();
    console.log(`${str}: ${Math.round((performance.now() - startTime) * 100) / 10000}s`);
>>>>>>> dijkstrat
}

console.log(`Answer is '${answer}'`);