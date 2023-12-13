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

patterns.forEach((pattern, i) => {;
    //console.log(`Pattern ${i}\n${pattern.rows.join('\n')}`);
    let patternReflections = {
        row: getReflections(pattern.rows),
        col: getReflections(pattern.cols)
    };
    //console.log(pattern.rows.join('\n'));
    //console.log(`Pattern reflections: ${JSON.stringify(patternReflections)}`);

    let newReflections = {
        row: [],
        col: [],
    };

    let rowSmudgesCandidates = findSmudgeCandidates(pattern.rows);
    rowSmudgesCandidates.forEach(candidate => {
        let copyRow = pattern.rows[candidate.ia];
        let copyCol = pattern.cols[candidate.i];
        
        pattern.rows[candidate.ia] = replaceAt(copyRow, candidate.i, copyRow.charAt(candidate.i) === '#' ? '.' : '#');
        pattern.cols[candidate.i] = replaceAt(copyCol, candidate.ia, copyCol.charAt(candidate.ia) === '#' ? '.' : '#');

        let rowsReflections = getReflections(pattern.rows);
        let colsReflections = getReflections(pattern.cols);

        for (let i = 0; i < rowsReflections.length; i++) {
            if (!patternReflections.row.some(reflection => reflection === rowsReflections[i]) && !newReflections.row.some(reflection => reflection === rowsReflections[i])) {
                newReflections.row.push(rowsReflections[i]);
            }
        }

        for (let i = 0; i < colsReflections.length; i++) {
            if (!patternReflections.col.some(reflection => reflection === colsReflections[i]) && !newReflections.col.some(reflection => reflection === colsReflections[i])) {
                newReflections.col.push(colsReflections[i]);
            }
        }

        pattern.rows[candidate.ia] = copyRow;
        pattern.cols[candidate.i] = copyCol;
    })

    let colSmudgesCandidates = findSmudgeCandidates(pattern.cols);
    if (colSmudgesCandidates !== null) {
        colSmudgesCandidates.forEach(candidate => {
            let copyRow = pattern.rows[candidate.i];
            let copyCol = pattern.cols[candidate.ia];

            pattern.rows[candidate.i] = replaceAt(copyRow, candidate.ia, copyRow.charAt(candidate.ia) === '#' ? '.' : '#');
            pattern.cols[candidate.ia] = replaceAt(copyCol, candidate.i, copyCol.charAt(candidate.i) === '#' ? '.' : '#');

            let rowsReflections = getReflections(pattern.rows);
            let colsReflections = getReflections(pattern.cols);

            for (let i = 0; i < rowsReflections.length; i++) {
                if (!patternReflections.row.some(reflection => reflection === rowsReflections[i]) && !newReflections.row.some(reflection => reflection === rowsReflections[i])) {
                    newReflections.row.push(rowsReflections[i]);
                }
            }

            for (let i = 0; i < colsReflections.length; i++) {
                if (!patternReflections.col.some(reflection => reflection === colsReflections[i]) && !newReflections.col.some(reflection => reflection === colsReflections[i])) {
                    newReflections.col.push(colsReflections[i]);
                }
            }

            pattern.rows[candidate.i] = copyRow;
            pattern.cols[candidate.ia] = copyCol;
        })
    }

    console.log(`New: ${JSON.stringify(newReflections)}`);

    let plus = 0;
    for (let k = 0; k < newReflections.row.length; k++) {
        plus += newReflections.row[k] * 100;
    }

    for (let k = 0; k < newReflections.col.length; k++) {
        plus += newReflections.col[k];
    }

    //console.log(plus);

    console.log();

    answer += plus;
})

console.log(`Answer is '${answer}'`);

function findSmudgeCandidates(strings) {
    // Trouve toutes les lignes qui n'ont qu'un caractère de différence
    let smudgeCandidates = [];
    strings.forEach((a, i) => {
        strings.forEach((b, j) => {
            if (i === j) return;

            let differences = getDifferentCharacters(a, b, i, j);
            //console.log(`Differences entre ${a} et ${b} > ${differences.length}`);
            if (differences.length === 1) {
                smudgeCandidates.push(differences[0]);
            }
        })
    })

    return smudgeCandidates;
}

function getDifferentCharacters(a, b, ia, ib) {
    let differences = [];
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            differences.push({
                a, // Chaine a complète
                b, // Chaine b complète
                i, // Index du delta
                ia, // Index de la ligne a
                ib, // Index de la ligne b
            })
        }
    }

    return differences;
}

function getReflections(strings) {
    let reflections = [];

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

        //console.log(aboveStrings);
        //console.log(belowStrings);

        if (isReflect(aboveStrings, belowStrings)) {
            //console.log(`Reflection between ${i} & ${i + 1}`);
            reflections.push(i);
        }
    }

    return reflections;
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

function replaceAt(string, index, replacement) {
    return string.substring(0, index) + replacement + string.substring(index + replacement.length);
}