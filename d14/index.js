function parseData(raw) {
    return raw.split(/\n/).map(d => {
        if (d.startsWith("mask =")) {
            return { op: "mask", mask: d.substring(7) }
        }

        const groups = /^mem\[(?<address>\d*)\] = (?<value>\d*)$/g.exec(d).groups
        return { op: "mem", value: Number(groups.value), mem: Number(groups.address) };
    });


}

const rawData = require('fs').readFileSync(process.env.INPUT_DATA || "./data.txt", "utf8")
const data = parseData(rawData);

function leftpad(s) {
    while (s.length < 36) {
        s = "0" + s;
    }
    return s;
}

function applyMask(n, mask) {
    const binary = n.toString(2)
    const pad = leftpad(binary);
    let result = "";
    for (let i = 0; i < pad.length; i++) {
        result += mask[i] === "X" ? pad[i] : mask[i];
    }
    return parseInt(result, 2);
}

function execute(data) {
    let mask = "";
    const mem = Array.from({ length: 36 }, () => 0);
    data.forEach(d => {
        switch (d.op) {
            case "mask": mask = d.mask; break;
            case "mem": mem[d.mem] = applyMask(d.value, mask)
        }
    })
    return mem.reduce((a, b) => a + b, 0);
}

function decode(r) {
    if (r.indexOf("X") === -1) {
        return parseInt(r, 2);
    }
    const p = r.lastIndexOf("X");
    const prefix = r.slice(0, p);
    const suffix = r.slice(p + 1);
    return [decode(prefix + 0 + suffix), decode(prefix + 1 + suffix)].flat();
}

function applyMask2(n, mask) {
    const binary = n.toString(2)
    const pad = leftpad(binary);
    let result = "";
    for (let i = 0; i < pad.length; i++) {
        result += mask[i] === "0" ? pad[i] : mask[i];
    }
    return decode(result);
}

function execute2(data) {
    let mask = "";
    const mem = Array.from({ length: 36 }, () => 0);
    data.forEach(d => {
        switch (d.op) {
            case "mask":
                mask = d.mask;
                break;
            case "mem":
                const result = applyMask2(d.mem, mask);
                result.map(v => mem[v] = d.value);
                break;
        }
    })
    return mem;
}

console.log("PART ONE", execute(data));

const result = execute2(data);

let sum2 = 0;
Object.keys(result).forEach(key=>{
    sum2 += result[key];
})
console.log('PART TWO : ' + sum2)
