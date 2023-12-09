import { readInput } from "../inputReader.js";

let input = readInput(2);
let answer = 0;

input.split("\r\n").forEach((line, i) => {;
    console.log(line);
    let lineWithoutGame = line.replace(line.split(":")[0], '').replace(":", '');
    let sets = lineWithoutGame.split(";");
    let maxCubeMap = {
        red: 0,
        blue: 0,
        green: 0,
    }

    sets.forEach(set => {
        set.split(",").forEach(cube => {
            let split = cube.substring(1).split(" ");
            maxCubeMap[split[1]] = Math.max(parseInt(split[0]), maxCubeMap[split[1]]);
        });

        console.log(maxCubeMap);
    })

    console.log(maxCubeMap.red * maxCubeMap.blue * maxCubeMap.green);

    answer += maxCubeMap.red * maxCubeMap.blue * maxCubeMap.green;
});

console.log(answer);