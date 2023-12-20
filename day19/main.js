import { readInput } from "../inputReader.js";

let input = readInput(19);
let answer = 0;

let lines = input.split('\r\n');

// Parse
let workflows = [];
let parts = [];
let isWorkflow = true;
lines.forEach(line => {
    if (line.trim() === '') {
        isWorkflow = false;
        return;
    }

    // Workflows
    if (isWorkflow) {
        let name = line.match(/^[^{]+/g).toString();
        let flows = line.match(/\{([^\}]+)\}/)[1]
            .split(',')
            .map(flow => {
                // Contient une condition
                if (flow.includes(':')) {
                    return {
                        category: flow[0],
                        operator: flow[1],
                        value: +flow.match(/\d+/),
                        next: flow.split(':')[1]
                    };
                }
                // Seulement un next 
                return {
                    next: flow,
                }
            });

        workflows[name] = flows;
        return;
    } 

    // Parts
    let partDecomposed = line.match(/\{([^\}]+)\}/)[1].split(',');
    let part = [];
    partDecomposed.forEach(category => part[category[0]] = +category.substring(2));
    parts.push(part);
})

// Enchainement des workflow
parts.forEach(part => {
    console.log(part);
    // Commence par le workflow 'in'
    let nextWorkflowName = getNextWorkflowForPart(part, workflows['in']);

    while (!'RA'.includes(nextWorkflowName)) {
        nextWorkflowName = getNextWorkflowForPart(part, workflows[nextWorkflowName]);
    }

    if (nextWorkflowName === 'A') {
        answer += part.x + part.m + part.a + part.s;
    }
})

console.log(`Answer is '${answer}'`);

function getNextWorkflowForPart(part, workflow) {
    //console.log('Passe à travers le workflow', workflow);
    // Si aucune condition remplie prend le dernier next
    let next = workflow[workflow.length - 1].next;

    // Every pour pouvoir break la loop
    for (let condition of workflow) {
        if (partSatisfiesCondition(part, condition)) {
            next = condition.next;
            break;
        }
        //console.log('Première condition non remplie', condition);
    }

    //console.log('Va vers', next, workflows[next]);

    return next;
}

function partSatisfiesCondition(part, condition) {
    if (!condition.category) {
        return true;
    }

    if (condition.operator === '>') {
        //console.log(part[condition.category], '>', condition.value, part[condition.category] > condition.value);
        return part[condition.category] > condition.value;
    }

    //console.log(part[condition.category], '<', condition.value, part[condition.category] < condition.value);

    return part[condition.category] < condition.value;
}