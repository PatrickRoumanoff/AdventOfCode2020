function absmod(a, n) {
    while (a < 0) a += n;
    return a % n;
}

function parseData(raw) {
    return raw.split(/\n/)[1].split(",").
        map((id, i) => ({ id, i })).
        filter(({ id }) => id !== 'x').
        sort((a, b) => b.id - a.id).
        map(({ id, i }) => ({ id: BigInt(id), offset: BigInt(absmod(- i, Number(id))) }));
}

const rawData = require('fs').readFileSync(process.env.INPUT_DATA || "./data.txt", "utf8")
const data = parseData(rawData);
console.log(data);

function findSolution(inputs) {
    let cN = inputs[0].id;
    let cA = inputs[0].offset;
    console.log(cA)
    for (let i = 1; i < inputs.length; i++) {
        const bus = inputs[i];
        while (cA % bus.id !== bus.offset) {
            cA += cN;
        }
        cN *= bus.id;
    }
    return cA;
}

console.log(`Part 2: the timestamp is ${findSolution(data)}`);