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

modules.forEach(module => {
    for (let i = 0; i < module.outputs.length; i++) {
        module.outputs[i] = modules.find(mod => mod.name === module.outputs[i]) || 'rx';
    }
})

// Affecte les inputs aux module CONJ
modules.forEach(module => {
    // Récupère tous les outputs qui sont des CONJ
    let conjOutputs = module.outputs.filter(output => output.type === 'CONJ');
    conjOutputs.forEach(mod => mod.inputs[module.name] = false);
})

// Trouve les modules qui mènent à rx 
let moduleToRx = modules.find(mod => mod.outputs.some(output => output === 'rx'));

// Trouve tous les modules qui mènent à celui ci (on sait que ce sont des conj)
let importantModules = moduleToRx.inputs;

let queue = [];
let pulseCounts = [0, 0];
let cycles = 0;
let importantMap = new Map(); // Trouve le cycle pour chaque input important

while (importantMap.size < 4) {
    queue.push([null, modules.find(module => module.name === 'broadcaster'), false])
    cycles++;

    while (queue.length) {
        let data = queue.shift();
        
        let prev = data[0];
        let module = data[1];
        let pulse = data[2];

        if (pulse) pulseCounts[1]++;
        if (!pulse) pulseCounts[0]++;

        //console.log(prev ? prev.name : 'broadcaster', pulse, '->', module === 'rx' ? 'rx' : module.name); 
        
        if (module === 'rx') {
            if (!pulse) {
                rxLowPulse = true;
                break;
            }
            continue;
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

            // Trouve les cycles
            if (module.name === moduleToRx.name) {
                Object.keys(module.inputs).forEach(input => {
                    //console.log(input, module.inputs[input]);
                    if (module.inputs[input] && !importantMap.has(input)) {
                        importantMap.set(input, cycles);
                    }
                });
            }

            // Si oui, on envoi false, sinon true
            module.outputs.forEach(output => queue.push([module, output, !allPositives]));
        }
    }
}

// PPCM :D
answer = getLeastCommonMultipleOfValues([...importantMap.values()]);

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