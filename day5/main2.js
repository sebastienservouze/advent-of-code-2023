import { readInput } from "../inputReader.js";

let input = readInput(5);
let answer = Number.MAX_VALUE;

let lines = input.split('\r\n');

// Parsing différent pour gérer des ranges
let seedsRaw = [...lines[0].split(':')[1].matchAll(/\d+/g)]
    .map(match => parseInt(match.toString()));

let seeds = [];
for (let i = 0; i < seedsRaw.length; i+=2) {
    seeds.push({
        start: seedsRaw[i],
        range: seedsRaw[i + 1]
    });
}

// Construction des headers
let maps = [];
let mapHeaderLines = lines.filter(line => line.includes('map'));

// Construction des maps
for(let i = 0; i < mapHeaderLines.length; i++) {
    let mapLines = [];
    let mapValuesStartIndex = lines.indexOf(mapHeaderLines[i]) + 1;
    let count = 0;

    // Récupération des valeurs
    do {
        mapLines.push(lines[mapValuesStartIndex + count])
        count++;

    } while (mapValuesStartIndex + count < lines.length && lines[mapValuesStartIndex + count].length > 0);

    // Construction d'une map
    maps.push({
        destinations: mapLines.map(line => parseInt(line.split(" ")[0])),
        sources: mapLines.map(line => parseInt(line.split(" ")[1])),
        ranges: mapLines.map(line => parseInt(line.split(" ")[2])),
    });
}

maps = maps.reverse();
console.log(maps);

// Récupère les source, highestSource / destination mappé 
let minMappedDestination = [...maps[0].destinations].sort()[0];
let indexOfMinMappedDestination = maps[0].destinations.indexOf(minMappedDestination);
let minMappedSource = maps[0].sources = maps[0].sources[indexOfMinMappedDestination];
let range = maps[0].ranges[indexOfMinMappedDestination];

// Regarde si une valeur non mappée peut être plus faible
let lowestDestination;
if (minMappedDestination > 0) {
    lowestDestination = 0;
    range = minMappedDestination - 1;
} else {
    lowestDestination = minMappedSource;
}

let minDest = lowestDestination;
// Parcours les maps pour trouver la destination minimale correspondante à la source minimale de la map précédente
for (let i = 1; i < maps.length; i++) {

    console.log(`Map[${i - 1}] - Lowest: ${minDest} | Range ${range}`);

    // Récupère les destinations correspondantes et renvoi leur source
    let availaibleSources = maps[i].destinations.filter((destination, j) => {
        //console.log(`Destination ${destination} >= ${minDest} || ${destination + maps[i].ranges[j]} < ${minDest}`)
        return destination >= minDest || destination + range < minDest;
    }).map((destination, k) => {
        return maps[i].sources[k];
    });

    // Si aucune destination correspondantes, elle n'est pas mappée > minSource reste inchangée
    if (!availaibleSources.length) {
        //console.log('Destination non mappée');
        continue;
    }

    minDest = availaibleSources.sort()[0];
    range = maps[i].ranges[maps[i].destinations.indexOf(minDest)];
    //console.log(`Choose destination ${maps[i].destinations.indexOf(minDest)}`)
}

// Cherche la seed dans la range
let seedSequenceInRange = seeds.filter(seed => {
    return seed.start <= minDest + range
});

// Parmis les disponible, laquelle est la plus proche de la dest
seedSequenceInRange.sort((a, b) => {
    return (a.start - minDest) - (b.start - minDest);
})


console.log(seedSequenceInRange);


console.log(minDest + '|' + range);
//console.log(availaibleSeeds);

// Parcours des seed
for (let i = 0; i < seedSequenceInRange.length; i++) {
    for (let j = 0; j < seedSequenceInRange[i].range; j++) {
        let location = seedSequenceInRange[i].start + j;
        maps.forEach((map) => {
            location = getCorrespondingValue(location, map);
        })

        console.log(location);
        
        answer = Math.min(location, answer);
    }
}


console.log(`Answer is '${answer}'`);




function getCorrespondingValue(location, map) {
    // Cherche la source correspondante à notre location parmis les combos source range
    for (let i = 0; i < map.sources.length; i++) {

        // Si dans le range de la source
        if (location >= map.sources[i] && location <= map.sources[i] + map.ranges[i]) {
            let deltaFromSource = location - map.sources[i];
            return map.destinations[i] + deltaFromSource;
        }
    }

    return location;
}


// Comparer par range
// La première seed va de 1 à 5
// Combien de destinations différentes touchent-on ?
// 