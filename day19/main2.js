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

// Récupère tous les workflow qui envoient vers A
let pairWorkflowConditionToA = Object.keys(workflows).filter(name => workflows[name].some(condition => condition.next === 'A'))
    .map(name => {
        return {
            name: name,
            conditions: workflows[name].filter(condition => condition.next === 'A')
        };
    });

console.log(pairWorkflowConditionToA);
// Pour chaque workflow, traverse récursivement jusqu'à trouvé 'in'
let validRanges = [];
let prevWorkflowName = 'A';
let dontDoAgain = [];
pairWorkflowConditionToA.forEach(pair => {
    pair.conditions.forEach(condition => {
        if (dontDoAgain.some(workflowName => workflowName === pair.name)) return;

        let ranges = [];

        ranges.x = [1, 4000];
        ranges.m = [1, 4000];
        ranges.a = [1, 4000];
        ranges.s = [1, 4000];
    
        validRanges.push(getRangesToPrevWorkflows(workflows[pair.name], pair.name, prevWorkflowName, ranges, condition)); 
        if (workflows[pair.name].every(condition => condition.next === 'A')) {
            dontDoAgain.push(pair.name);
        }

        let combinations = (ranges.x[1] - ranges.x[0] + 1) * (ranges.m[1] - ranges.m[0] + 1) * (ranges.a[1] - ranges.a[0] + 1) * (ranges.s[1] - ranges.s[0] + 1) ;
        
        console.log('Depuis', pair.name, 'vers A', condition, ranges, combinations);
    })
})

validRanges.forEach(range => {
    let combinations = (range.x[1] - range.x[0] + 1) * (range.m[1] - range.m[0] + 1) * (range.a[1] - range.a[0] + 1) * (range.s[1] - range.s[0] + 1) ;
    answer += combinations; 
})

console.log(`Answer is '${answer}'`);

function getRangesToPrevWorkflows(workflow, workflowName, prevWorkflowName, ranges, searchedCondition) {
    if (!workflow.every(condition => condition.next === 'A')) {
        // Récupère les ranges qui permettent d'accéder à ce workflow
        for (let condition of workflow){
            if (getRangesToGoToSpecificWorkflowFromCondition(condition, prevWorkflowName, ranges, searchedCondition)) {
                //console.log('On a trouvé', ranges);
                break;
            }
        }
    }
    
    // Récupère tous les workflow allant jusqu'à ce workflow
    let prevWorkflowNames = Object.keys(workflows).filter(name => workflows[name]
        .some(condition => condition.next === workflowName));
        
    //console.log('Workflow allant jusqu\'a', workflowName, ':', prevWorkflowNames)

    // Recommence pour chacun des workflows qui mène à celui-ci
    prevWorkflowNames.forEach(name => {
        ranges = getRangesToPrevWorkflows(workflows[name], name, workflowName, ranges);
    })

    return ranges;
}

function getRangesToGoToSpecificWorkflowFromCondition(condition, workflowName, ranges, searchedCondition) {
    if (!condition.category) {
        return true;
    }

    // On peut potentiellement simplifier mais j'ai peur

    // Si c'est le workflow qu'on cherche, on doit être dans le range
    if (condition.next === workflowName && (!searchedCondition || JSON.stringify(searchedCondition) === JSON.stringify(condition))) {
        if (searchedCondition) {
            console.log('Hello',workflowName,searchedCondition);
        }
        
        // Si opérateur plus grand que, le range minimum pour la categorie devient le max entre le range actuel min et condition.value + 1
        if (condition.operator === '>') {
            ranges[condition.category][0] = Math.max(ranges[condition.category][0], condition.value + 1);
            return true;
        }

        // Si opérateur plus petit que, le range maximum pour la catégorie devient le minimum entre le range actuel et condition.value
        ranges[condition.category][1] = Math.min(ranges[condition.category][1], condition.value - 1);
        return true;
    }
    // Sinon, on ne doit pas être dans le range !
    else {
        // Si opérateur plus grand que, le range maximum pour la catégorie devient le minimum entre le range actuel et condition.value
        if (condition.operator === '>') {
            ranges[condition.category][1] = Math.min(ranges[condition.category][1], condition.value);
            return false;
        }

        // Si opérateur plus petit que, le range minimum pour la categorie devient le max entre le range actuel min et condition.value
        ranges[condition.category][0] = Math.max(ranges[condition.category][0], condition.value);
        return false;
    }
}