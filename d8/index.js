function parseLine(line) {
    const re = /^(?<op>\w+) (?<value>(\+|\-)\d+)$/
    const groups = line.match(re).groups;
    return { op: groups.op, value: Number.parseInt(groups.value) };
}

function parseData(raw) {
    return raw.split(/\n/).map(parseLine);
}

function execute(data, index, acc) {
    if (index >= data.length) {
        console.log("program terminated! :" + acc);
        return { acc, state: "finished" };
    }
    const cur = data[index];
    const prev = cur.prev;
    if (prev) { return { acc, state: "loop" }; }
    cur.prev = true;
    switch (cur.op) {
        case "nop": return execute(data, index + 1, acc);
        case "acc": return execute(data, index + 1, acc + cur.value);
        case "jmp": return execute(data, index + cur.value, acc)
        default: console.log(`cur.op`); throw new Error("unknown op:" + cur.op);
    }
}

function reset(data) {
    return data.map(d => Object.assign(d, { prev: false }));
}

function trySwap(from, to, data) {
    return data.find((d, i) => {
        if (d.op === from) {
            d.op = to;
            const r = execute(reset(data), 0, 0);
            d.op = from;
            if (r.state === "finished") {
                console.log(`switch ${from} to ${to} at ${i} returned ${r.acc}`);
                return true;
            }
            return false;
        }
    })

}

const rawData = require('fs').readFileSync(process.env.INPUT_DATA || "./data.txt", "utf8")
const data = parseData(rawData);

console.log(data);
console.log(execute(data, 0, 0));
console.log(trySwap("jmp", "nop", data));
console.log(trySwap("nop", "jmp", data));