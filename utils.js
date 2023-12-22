export function measure(str, fn, args) {
    let startTime = performance.now();
    let result = fn(args);
    console.log(`${str}: ${Math.round((performance.now() - startTime) * 100) / 10000}s`);
    return result;
}

export function replaceAt(string, index, replacement) {
    return string.substring(0, index) + replacement + string.substring(index + replacement.length);
}

export function hashCode(str) {
    var hash = 0,
      i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }