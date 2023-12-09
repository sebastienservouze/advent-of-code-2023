import fs from "fs";
import path from "path";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function readInput(day) {
    let filePath = path.join(__dirname, 'day' + day, '/input.txt');

    return fs.readFileSync(filePath).toString();
}