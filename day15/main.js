import { readInput } from "../inputReader.js";

let inputs = readInput(15).split(',');
let answer = 0;

inputs.forEach(input => {
    answer += hash(input);
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