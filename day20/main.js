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
const BUTTON_PRESSES = 1000;

for (let i = 0; i < BUTTON_PRESSES; i++) {
    queue.push([null, modules.find(module => module.name === 'broadcaster'), false])

    while (queue.length) {
        let data = queue.shift();

        let prev = data[0];
        let module = data[1];
        let pulse = data[2];

        if (pulse) pulseCounts[1]++;
        if (!pulse) pulseCounts[0]++;

        //console.log(prev ? prev.name : 'broadcaster', pulse, '->', module ? module.name : ' fin'); 
        
        if (!module) continue;

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

console.log(pulseCounts);

answer = pulseCounts[0] * pulseCounts[1];

console.log(`Answer is ${answer}`);