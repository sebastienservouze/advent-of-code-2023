import { readInput } from "../inputReader.js";

let input = readInput(20);
let answer = 0;

let lines = input.split('\r\n');

let modules = [];
lines.forEach(line => {
    let split = line.split(' -> ');
    let name = split[0];

    let module = {};
    module.outputs = split[1].split(',').map(output => output.trim());
    module.state = false;

    if (line.charAt(0) === '%') {
        module.type = 'FLIP';
        name = split[0].substring(1);
    } else if (line.charAt(0) === '&') {
        module.type = 'CONJ';
        module.inputs = [];
        name = split[0].substring(1);
    } else {
        module.type = '';
    }

    module.name = name;

    modules.push(module);
});

// Affecte les inputs aux module CONJ
modules.filter(module => module.type !== 'CONJ').forEach(module => {
    let conjOutputs = module.outputs.filter(outputName => modules.find(mod => mod.name === outputName).type === 'CONJ')
        .map(outputName => modules.find(mod => mod.name === outputName));

    conjOutputs.forEach(mod => mod.inputs[module.name] = false);
})

modules.forEach(module => {
    for (let i = 0; i < module.outputs.length; i++) {
        module.outputs[i] = modules.find(mod => mod.name === module.outputs[i]);
    }
})


let queue = [];
let pulseCounts = [0, 0];
let cycles = 0;
let importantMap = new Map();

while (importantMap.size < 4) {
    queue.push([null, modules.find(module => module.name === 'broadcaster'), false])

    while (queue.length) {
        let data = queue.shift();
        cycles++;

        let prev = data[0];
        let module = data[1];
        let pulse = data[2];

        if (pulse) pulseCounts[1]++;
        if (!pulse) pulseCounts[0]++;

        //console.log(prev ? prev.name : 'broadcaster', pulse, '->', module ? module.name : ' fin'); 

        if (!module) {
            if (!pulse) {
                rxLowPulse = true;
                break;
            }
            continue;
        }

        // Trouve les quatres conjonctions directement avant cs > rx
        // Il faudrait les trouver par le code en partant depuis les inputs de rx puis de cs, mais un peu la flemme
        // Le but c'est de comprendre qu'il faut qu'ils s'alignent, donc on cherche la taille de leur cycles respectifs
        if (module.inputs) {
            if (module.name === 'tg' && !importantMap.has('tg') && !Object.keys(module.inputs).every(key => module.inputs[key])) {
                console.log('tg', cycles);
                importantMap.set('tg', cycles);
            }
            if (module.name === 'lz' && !importantMap.has('lz') && !Object.keys(module.inputs).every(key => module.inputs[key])) {
                console.log('lz', cycles);
                importantMap.set('lz', cycles);
            }
            if (module.name === 'kh' && !importantMap.has('kh') && !Object.keys(module.inputs).every(key => module.inputs[key])) {
                console.log('kh', cycles);
                importantMap.set('kh', cycles);
            }
            if (module.name  === 'hn' && !importantMap.has('hn') && !Object.keys(module.inputs).every(key => module.inputs[key])) {
                console.log('hn', cycles);
                importantMap.set('hn', cycles);
            }
        }

        // Passe plat
        if (module.type === '') {
            module.outputs.forEach(output => queue.push([module, output, pulse]));
        }
        // Flip
        else if (module.type === 'FLIP') {
            // Rien ne se passe sur une forte pulsation
            if (pulse) continue;

            // Toggle
            module.state = !module.state;

            // Envoi l'inverse de son nouvel état
            module.outputs.forEach(output => queue.push([module, output, module.state]))
        }
        // Conjonction
        else {
            // Met à jour son input
            module.inputs[prev.name] = pulse;

            // Tous les inputs positifs ?
            let allPositives = Object.keys(module.inputs).every(key => module.inputs[key]);

            // Si oui, on envoi false, sinon true
            module.outputs.forEach(output => queue.push([module, output, !allPositives]));
        }
    }
}

// PPCM :D > A noter, j'ai du utiliser le calculateur de dcode.fr parce que le mien doit faire des approximation avec la division, lourd
answer = getLeastCommonMultipleOfValues([importantMap.get('tg'), importantMap.get('lz'), importantMap.get('kh'), importantMap.get('hn')]);

console.log(`Answer is ${answer}`);

function getLeastCommonMultipleOfValues(values) {
    return values.reduce(getLeastCommonMultiple)
}

function getGreatestCommonDenominator(a, b) {
    return a ? getGreatestCommonDenominator(b % a, a) : b;
}

function getLeastCommonMultiple(a, b) {
    return a * b / getGreatestCommonDenominator(a, b);
}