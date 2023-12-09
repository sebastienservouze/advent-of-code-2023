import { readInput } from "../inputReader.js";

let input = readInput(5);
let answer = Number.MAX_VALUE;

let lines = input.split('\r\n');
let seeds = [...lines[0].split(':')[1].matchAll(/\d+/g)]
    .map(match => parseInt(match.toString()));

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
    let location = seed;
    maps.forEach((map) => {
        location = getCorrespondingValue(location, map);
    })

    console.log(location);

    answer = Math.min(location, answer);
})

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