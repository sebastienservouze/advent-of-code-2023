import { readInput } from "../inputReader.js";

let inputs = readInput(15).split(',');
let answer = 0;

const REMOVE = "-";

let boxes = new Array(256).fill('').map(elem => []);
inputs.forEach(input => {
    console.log(`[${input}]`);
    let label = input.match(/[a-zA-Z]+/).toString();
    let operation = input.match(/[-=]/).toString();
    let boxIndex = hash(label);
    let lensIndex = boxes[boxIndex].findIndex(lens => lens.includes(label));

    if (operation === REMOVE) { 
        if (lensIndex !== -1) {
            boxes[boxIndex].splice(lensIndex, 1);
        }  
    } else {
        let focalLength = parseInt(input.match(/\d+/).toString());
        if (lensIndex !== -1) {
            boxes[boxIndex][lensIndex] = label + focalLength;
        } else {
            boxes[boxIndex].push(label + focalLength);

        }
    }
});

console.log('Résultat final');
boxes.forEach((box, i) => {
    if (box.length !== 0) {
        console.log(`Box ${i}: ${boxes[i]}`);
    }

    box.forEach((lens, j) => {
        let focusLength = parseInt(lens.match(/\d+/).toString());
        answer += (1 + i) * (j + 1) * focusLength;
    })
})

console.log(`Answer is '${answer}'`);

function hash(string) {
    let currentValue = 0;

    Array.from(string).forEach(char => {
        currentValue = hashChar(currentValue, char);
    });

    return currentValue;
}

function hashChar(currentValue, char) {
    let ascii = char.charCodeAt(0);

    currentValue += ascii;
    currentValue *= 17;
    currentValue %= 256;

    return currentValue;
}