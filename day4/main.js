import { readInput } from "../inputReader.js";

let input = readInput(4);
let answer = 0;

input.split('\r\n').forEach(line => {
    let lineWithoutCard = line.replace(line.split(":")[0], '').replace(":", '');
    answer += getPoints(lineWithoutCard);
})

console.log(`Answer is '${answer}'`);

function getPoints(line) {
    let winningNumbers = [...line.split("|")[0].matchAll(/\d+/g)];
    let myNumbers = [...line.split("|")[1].matchAll(/\d+/g)];

    let myWinningNumbers = winningNumbers.filter(winningNumber => myNumbers.some(number => number.toString() === winningNumber.toString()));
    
    if (myWinningNumbers.length > 0) {
        let points = 1;
        for (let i = 1; i < myWinningNumbers.length; i++) {
            points *= 2;
        }

        return points;
    }

    return 0;
}