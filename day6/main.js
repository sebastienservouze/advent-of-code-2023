import { readInput } from "../inputReader.js";

let input = readInput(6);
let answer = 1;

let lines = input.split('\r\n');

let times = [...lines[0].matchAll(/\d+/g)].map(match => parseInt(match));
let distances = [...lines[1].matchAll(/\d+/g)].map(match => parseInt(match));
console.log(`Times: ${times}`);
console.log(`Distances: ${distances}`);

for (let i = 0; i < times.length; i++) {
    console.log(`Race ${i} - ${distances[i]}mm in ${times[i]}ms`);
    
    let waysToWin = 0;
    for (let j = 0; j < times[i]; j++) {
        let distance = j * (times[i] - j);
        console.log(`Appui pendant ${j}ms - ${distance}`);
        if (distance > distances[i]) {
            waysToWin++;
        }
    }

    console.log(`Race ${i} - ${waysToWin} manières de gagner la course`);

    answer *= waysToWin;
}

console.log(`Answer is '${answer}'`);

