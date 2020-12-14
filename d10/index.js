function parseData(raw) {
    return raw.split(/\n/).map(d => Number.parseInt(d)).sort((a, b) => a > b ? 1 : -1);
}

const rawData = require('fs').readFileSync(process.env.INPUT_DATA || "./data.txt", "utf8")
const data = parseData(rawData);

function findNext(start, list) {
    return list.filter(d => (d - start) <= 3);
}

function findOrder(adapters) {
    let currentJolt = 0
    let adapterCount = 0
    let oneJoltDiff = 0
    let threeJoltDiff = 0

    while (adapterCount < adapters.length) {
        const compatibleAdapters = adapters.filter(a => a <= currentJolt + 3 && a > currentJolt)
        const nextAdapter = compatibleAdapters[0]
        if (nextAdapter - currentJolt === 1) oneJoltDiff += 1
        if (nextAdapter - currentJolt === 3) threeJoltDiff += 1
        currentJolt = nextAdapter
        adapterCount += 1
    }
    console.warn(oneJoltDiff * threeJoltDiff, 'WINNER WINNER')
}

const memory = [];

function countWays(list, i) {
    if (i === list.length - 1) {
        return 1;
    }
    if (memory[i]) {
        return memory[i];
    }
    let result = 0;
    for (let j = i + 1; j < list.length; j++) {
        if (list[j] - list[i] <= 3) {
            result += countWays(list, j);
        }
    }
    memory[i] = result;
    return result;
}

// add 0 at the front
data.splice(0,0,0);
// add +3 at the back
data.push(data[data.length - 1] + 3)
findOrder(data);
console.log(countWays(data, 0));
