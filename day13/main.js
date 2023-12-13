import { readInput } from "../inputReader.js";

let input = readInput(13);
let answer = 0;

let lines = input.split('\r\n');

// Création des patterns
let patterns = [];
patterns.push({
    rows: [],
    cols: new Array(lines[0].length).fill(''),
})

lines.forEach((line, i) => {
    if (!line.length) {
        patterns.push({
            rows: [],
            cols: new Array(lines[i + 1].length).fill(''),
        })
        return;
    }

    patterns[patterns.length - 1].rows.push(line);
    Array.from(line).forEach((char, j) => {
        patterns[patterns.length - 1].cols[j] += char;
    })
})

patterns.forEach(pattern => {
    answer += getReflectionsScore(pattern.rows, 100) + getReflectionsScore(pattern.cols, 1);
})
console.log(`Answer is '${answer}'`);

function getReflectionsScore(strings, multiplier) {
    let reflectionsScore = 0;

    // A partir du deuxième élément
    for (let i = 1; i < strings.length; i++) {

        // Sépare toutes les lignes en deux tableau de taille équivalent à l'index de la ligne
        let aboveStrings;
        let belowStrings;

        if (i < strings.length / 2) {
            aboveStrings = strings.slice(0, i);
            belowStrings = strings.slice(i, i + aboveStrings.length);
        }
        else {
            belowStrings = strings.slice(i, strings.length);
            aboveStrings = strings.slice(i - belowStrings.length, i);
        }

        if (isReflect(aboveStrings, belowStrings)) {
            console.log(`Reflection between ${i} & ${i + 1}`);
            reflectionsScore += multiplier * i;
        }
    }

    return reflectionsScore;
}

function isReflect(a, b) {
    // Parcours les deux chaines dans le sens opposé et sort dès qu'il y a un delta
    for (let i = 0, j = a.length - 1; i < a.length; i++, j--) {
        if (a[i] !== b[j]) {
            return false;
        }
    }

    return true;
}