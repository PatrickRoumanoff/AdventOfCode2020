function parseData(raw) {
    return raw.split(/\n\n/).map(d => d.split(/\n/).map(d => d.split("")));
}

function countYes(group) {
    return new Set(group.flat()).size
}

function countSharedYes(group) {
    return group.reduce((a, b) => a.filter(d => b.indexOf(d) >= 0), group[0]).length;
}

const sum = (a, b) => a + b;

const rawData = require('fs').readFileSync(process.env.INPUT_DATA || "./data.txt", "utf8")
const data = parseData(rawData);

console.log(data.map(countYes).reduce(sum));
console.log(data.map(countSharedYes).reduce(sum));
