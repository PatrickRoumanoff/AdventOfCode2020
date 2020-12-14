
function parseData(raw) {
    return raw.split(/\n/).map(d => Number.parseInt(d));
}

const rawData = require('fs').readFileSync(process.env.INPUT_DATA || "./data.txt", "utf8")
const data = parseData(rawData);

function checkIndex(pre, list, i) {
    const target = list[i];
    const source = list.slice(Math.max(0, i - pre), i);
    // console.log(i, target, source)
    for (let j = 0; j < source.length; j++) {
        for (let k = 0; k < source.length; k++) {
            if ((source[j] + source[k]) === target) {
                return true;
            }
        }
    }
    return false;
}

function check(pre, list) {
    for (let i = pre; i < list.length; i++) {
        if (!checkIndex(pre, list, i)) {
            return list[i];
        }
    }
}

function sum(list, start, end) {
    return list.slice(start, end).reduce((a, b) => a + b, 0);
}

function findContinuousList(list, target) {
    for (let j = 0; j < list.length; j++) {
        for (let k = 0; k < list.length; k++) {
            if (target === sum(list, j, k)) {
                return list.slice(j, k);
            }
        }
    }
}

const bug = check(25, data)
console.log(bug);

const continuous = findContinuousList(data, bug);
console.log(continuous)
const max = continuous.reduce((a,b)=> a>b?a:b, continuous[0]);
const min = continuous.reduce((a,b)=> a<b?a:b, continuous[0]);
console.log(min, max, min+max)