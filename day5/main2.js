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

// Parcours des seed
seeds.forEach(seed => {
    console.log(`Testing seed ${seed.start} to ${seed.start + seed.range} - Current lowest location is ${answer}`);
    for (let i = seed.start; i < seed.start + seed.range; i++) {
        let location = i;
        maps.forEach((map) => {
            location = getCorrespondingValue(location, map);
        })

        //console.log(location);

        if (location < answer) {
            console.log(`New best location is ${location} for seed ${i}`);
        }
        answer = Math.min(location, answer);

    }
})

console.log(`Answer is '${answer}'`);

function getCorrespondingValue(location, map) {
    // Cherche la source correspondante à notre location parmis les combos source range
    for (let i = 0; i < map.sources.length; i++) {

        // Si dans le range de la source
        if (location >= map.sources[i] && location < map.sources[i] + map.ranges[i]) {
            
            let deltaFromSource = location - map.sources[i];
            return map.destinations[i] + deltaFromSource;
        }
    }

    return location;
}

