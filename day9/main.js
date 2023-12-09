import { readInput } from "../inputReader.js";

let input = readInput(9);
let lines = input.split('\r\n');
let answer = 0;


let histories = lines.map(line => [[...line.matchAll(/-?\d+/g)].map(number => parseInt(number))]);


for (let i = 0; i < histories.length; i++) {
    let deltaSequence = getDeltasFromSequence(histories[i][0]);
    histories[i].push(deltaSequence)

    while (!deltaSequence.every(elem => elem === 0)) {
        deltaSequence = getDeltasFromSequence(deltaSequence);
        histories[i].push(deltaSequence);
    }

    histories[i].reverse();
}

console.log(histories);

for (let i = 0; i < histories.length; i++) {
    let rebuiltSequence = rebuildSequenceFromDeltas(histories[i]);
    answer += rebuiltSequence[rebuiltSequence.length - 1];
}


console.log(`Answer is '${answer}'`);


function getDeltasFromSequence(sequence) {
    let deltas = [];
    for (let i = 1; i < sequence.length; i++) {
        deltas.push(sequence[i] - sequence[i - 1]);
    }

    return deltas;
}

function rebuildSequenceFromDeltas(sequences) {
    let sequence = [...sequences[0]];
    for (let i = 1; i < sequences.length; i++) {
        console.log(`Addition des sequences ${sequences[i]} et ${sequences[i - 1]}`);
        for (let j = 0; j < sequences[i].length - 1; j++) {
            sequence[j] = sequences[i][j] + sequences[i - 1][j];
            console.log(`Sequence[${j}] = ${sequence[j]}`);
        }

        sequence.push(sequences[i][sequences[i].length - 1] + sequences[i - 1][sequences[i - 1].length - 1]);
        sequences[i].push(sequences[i][sequences[i].length - 1] + sequences[i - 1][sequences[i - 1].length - 1]);
        console.log(`Sequence = ${sequence}`)
    }

    console.log(`Sequence reconstruite pour ${sequences[sequences.length - 1]} > ${sequence}`);
    return sequence;
}