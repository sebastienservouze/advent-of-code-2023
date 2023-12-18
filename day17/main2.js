import { readInput } from "../inputReader.js";
import { Heap } from "heap-js"

let input = readInput(17);
let answer = 0;
let map = input.split('\r\n');

const X = 0;
const Y = 1
const MIN_STRAIGHT = 4;
const MAX_STRAIGHT = 10;
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
    coords: [0, 0],
    dir: [0, 0],
    consecutives: 0,
    prevNode: null
}]);


let minHeatLoss = Number.MAX_VALUE;
let bestEndNode = null;

let iterations = 0;
measure('Durée du traitement: ', dijkstrat);
displayPath(bestEndNode)
answer = minHeatLoss;

function dijkstrat() {
    while (unvisitedNodes.length > 0) {
        iterations++;
        let node = unvisitedNodes.peek();
        unvisitedNodes.remove(node);

        if (iterations % 10000 === 0) {
            console.log(`${node.coords} > ${node.heatLoss} (${node.dir} ${node.consecutives}) - ${unvisitedNodes.length}/${visitedNodes.size}`);
        }

        if (equal2D(node.coords, END_COORDS) && node.consecutives >= MIN_STRAIGHT) {
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

            // Gestion des mouvements
            let consecutives = 0;

             // Même direction que le dernier ?
            if (equal2D(DIRECTIONS[i], node.dir)) {
                // Si on est a MAX_STRAIGHT blocs dans cette direction, on sort
                if (node.consecutives === MAX_STRAIGHT) {
                    continue;
                }

                // Sinon on continue dans cette direction
                consecutives = node.consecutives + 1;
            } 
            // Pas la même direction ?
            else {
                // Si on est à moins de MIN_STRAIGHT blocs dans la précédente node, on sort
                if (node.consecutives < MIN_STRAIGHT && node.prevNode) {
                    continue;
                }
                
                // Sinon on tourne
                consecutives = 1;
            }

            let nextNode = {
                heatLoss: node.heatLoss + +map[nextCoords[Y]][nextCoords[X]],
                coords: nextCoords,
                dir: DIRECTIONS[i],
                consecutives: consecutives,
                prevNode: node,
            }

            unvisitedNodes.push(nextNode);
        }

        //unvisitedNodes.filter(n => n.totalHeathLoss < Number.MAX_VALUE).forEach(n => console.log(`${n.coords} - ${n.totalHeathLoss}`));
    }
}


function isInMap(coords) {
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
}

console.log(`Answer is '${answer}'`);