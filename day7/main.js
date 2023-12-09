import { readInput } from "../inputReader.js";

let input = readInput(7);
let answer = 0;

let lines = input.split('\r\n');
let hands = lines.map(line => line.split(" "));

// Calcul le pseudo rang d'une main en fonction de son type
hands.forEach(hand => {
    let occurence = getOccurences(hand[0]);
    let pseudoRank = getHandPseudoRank(occurence);
    hand.push(pseudoRank);
    console.log(`${hand[0]} - ${JSON.stringify(occurence)} - ${pseudoRank}`);
})

// Tri par pseudo rang, si égalité utilise la méthode de classement secondaire
hands.sort((a, b) => {
    if (a[2] !== b[2]) {
        return b[2] - a[2];
    } 
    else {
        return compareSamePseudoRanks(a[0], b[0]);
    }
})

hands.forEach((hand, i) => {
    console.log(`${i + 1}: ${hand}`);
    answer += (i + 1) * hand[1];
})

console.log(`Answer is '${answer}'`);

function getOccurences(hand) {
    let occurencesMap = [];
    for (let i = 0; i < hand.length; i++) {
        if (hand[i] === ' ') continue;

        let card = hand[i];
        let occurences = getCardOccurences(card, hand);
        if (occurences > 1) {
            occurencesMap.push({
                card: card,
                occurences: occurences
            })
        }

        hand = hand.replaceAll(card, ' ');
    }

    return occurencesMap;
}

function getCardOccurences(card, hand) {
    let occurence = ([...hand.matchAll(new RegExp(card, 'g'))] || []).length
    return occurence;
}

function getHandPseudoRank(occurences) {
    if (occurences.length === 1) {
        if (occurences[0].occurences === 5) {
            return 0;
        }

        if (occurences[0].occurences === 4) {
            return 1;
        }

        if (occurences[0].occurences === 3) {
            return 3;
        }

        if (occurences[0].occurences === 2) {
            return 5;
        }

    }
    else if (occurences.length === 2) {
        if (occurences.some(occurence => occurence.occurences === 3)) {
            return 2;
        }
        else {
            return 4;
        }
    }

    return 6;
}

function compareSamePseudoRanks(a, b) {
    let scoreTable = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    for (let i = 0; i < a.length; i++) {
        let aScore = scoreTable.indexOf(a[i]);
        let bScore = scoreTable.indexOf(b[i]);
        if (aScore !== bScore) {
            return bScore - aScore;
        }
    }
}