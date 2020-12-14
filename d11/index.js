function parseData(raw) {
    return raw.split(/\n/).map(d => d.split(""));
}

const rawData = require('fs').readFileSync(process.env.INPUT_DATA || "./data.txt", "utf8")
const data = parseData(rawData);

function countOccupied(data, i, j, di, dj) {
    if (!data[j + dj] || !data[j + dj][i + di] || data[j + dj][i + di] === "L") {
        return 0
    };
    if (data[j + dj][i + di] === "#") {
        return 1;
    }
    if (data[j + dj][i + di] === ".") {
        return countOccupied(data, i + di, j + dj, di, dj);
    }
    throw new Error("impossible");
}

/*****
 *   -1,-1 | -1,+0 | -1,+1
 *   +0,-1 |       | +0,+1
 *   +1,-1 | +1,+0 | +1,+1
 */
function countAdjacentOccupied(data, i, j) {
    return [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].map(([x, y]) =>
        countOccupied(data, i, j, x, y)).
        reduce((a, b) => a + b);
}

function round(data) {
    return data.map((row, j) => row.map((d, i) => {
        const occupied = countAdjacentOccupied(data, i, j)
        if (d === "L" && occupied === 0) {
            return "#";
        }
        if (d === "#" && occupied >= 5) {
            return "L"
        }
        return d;
    }));
}

function toString(data) {
    return data.map(r => r.join("")).join("\n")
}

const display = d => {
    const countA = d.map((r, j) => r.map((s, i) => countAdjacentOccupied(d, i, j)))
    const occupy = d.map((r, j) => r.map((s, i) => s === "L" && countA[j][i] === 0 ? "#" : " "));
    const free = d.map((r, j) => r.map((s, i) => s === "#" && countA[j][i] >= 4 ? "L" : " "));
    console.log(d.map((r, j) => r.join("") + " " + countA[j].join("") + " " + occupy[j].join("") + " " + free[j].join("")).join("\n"));
}



let roundN = data
let prev = "";
while (toString(roundN) !== prev) {
    display(roundN)
    prev = toString(roundN);
    // console.log("next\n", prev);
    console.log("---------------------------")
    roundN = round(roundN);
}
console.log(prev.split("").filter(d => d === "#").length);