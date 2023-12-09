import { readInput } from "../inputReader.js";

let input = readInput(4);
let answer = 0;
let copiesByCard = new Array(input.split('\r\n').length).fill(1);

input.split('\r\n').forEach((line, i) => {
    console.log(line);

    let lineWithoutCard = line.replace(line.split(":")[0], '').replace(":", '');

    let matchingNumbers = getMatchingNumbers(lineWithoutCard);
    answer += copiesByCard[i]; 
    
    // Pour chaque copie nombre gagnant de cette carte, ajoute 1 * le nombre de copie de la carte actuelle
    for (let j = 0; j < matchingNumbers; j++) {
        copiesByCard[i + j + 1] += 1 * copiesByCard[i];
    }

    copiesByCard.forEach((multiplicator, k) => console.log(`[${k}]: ${multiplicator}`))
})

console.log(`Answer is '${answer}'`);

function getMatchingNumbers(line) {
    let winningNumbers = [...line.split("|")[0].matchAll(/\d+/g)];
    let myNumbers = [...line.split("|")[1].matchAll(/\d+/g)];

    let myWinningNumbers = winningNumbers.filter(winningNumber => myNumbers.some(number => number.toString() === winningNumber.toString()));

    return myWinningNumbers.length;
}