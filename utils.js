export function measure(str, fn, args) {
    let startTime = performance.now();
    let result = fn(args);
    console.log(`${str}: ${Math.round((performance.now() - startTime) * 100) / 10000}s`);
    return result;
}

export function replaceAt(string, index, replacement) {
    return string.substring(0, index) + replacement + string.substring(index + replacement.length);
}
