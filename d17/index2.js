function parseData(rawData) {
    return rawData.split("\n").map(r => r.split(""))
}

const rawData = require('fs').readFileSync(process.env.INPUT_DATA || "./data.txt", "utf8")
const data = parseData(rawData);



function get(space, x, y, z, w, extend = true) {
    if (!space[w]) {
        if (!extend) {
            return ".";
        }
        space[w] = { [z]: { [y]: { [x]: "." } } };
    }
    if (!space[w][z]) {
        if (!extend) {
            return ".";
        }
        space[w][z] = { [y]: { [x]: "." } };
    }
    if (!space[w][z][y]) {
        if (!extend) {
            return ".";
        }
        space[w][z][y] = { [x]: "." };
    }
    if (!space[w][z][y][x]) {
        if (!extend) {
            return ".";
        }
        space[w][z][y][x] = ".";
    }
    return space[w][z][y][x];
}

function set(space, x, y, z, w, v) {
    if (!space[w]) {
        space[w] = {};
    }
    if (!space[w][z]) {
        space[w][z] = {};
    }
    if (!space[w][z][y]) {
        space[w][z][y] = {};
    }
    space[w][z][y][x] = v;
}

function display(space) {
    let minW = 0, maxW = 0, minZ = 0, maxZ = 0, minY = 0, maxY = 0, minX = 0, maxX = 0;
    Object.entries(space).map(([w, s]) => Object.entries(s).map(([z, p]) => Object.entries(p).map(([y, r]) => Object.entries(r).map(([x, v]) => {
        minW = Math.min(minW, w);
        maxW = Math.max(maxW, w);
        minZ = Math.min(minZ, z);
        maxZ = Math.max(maxZ, z);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
    }))))

    for (let w = minW; w <= maxW; w++) {
        for (let z = minZ; z <= maxZ; z++) {
            console.log(`z=${z} w=${w}`);
            for (let y = minY; y <= maxY; y++) {
                let line = "";
                for (let x = minX; x <= maxX; x++) {
                    line += get(space, x, y, z, w, false);
                }
                console.log(line);
            }
        }
    }
}

/**
 If a cube is active and exactly 2 or 3 of its neighbors are also active, 
 the cube remains active. Otherwise, the cube becomes inactive.
 If a cube is inactive but exactly 3 of its neighbors are active, 
 the cube becomes active. Otherwise, the cube remains inactive.
*/
function conway(space) {
    //expand by 1 on active cell
    Object.entries(space).map(([w, s]) => Object.entries(s).map(([z, p]) => Object.entries(p).map(([y, r]) => Object.entries(r).map(([x, v]) => {
        if (v === "#") {
            [-1, 0, 1].map(wi => [-1, 0, 1].map(zi => [-1, 0, 1].map(yi => [-1, 0, 1].map(xi =>
                get(space, Number(x) + xi, Number(y) + yi, Number(z) + zi, Number(w) + wi)
            ))))
        }
    }))))
    const next = {};
    Object.entries(space).map(([w, s]) => Object.entries(s).map(([z, p]) => Object.entries(p).map(([y, r]) => Object.entries(r).map(([x, v]) => {
        const neighboors = [-1, 0, 1].map(wi => [-1, 0, 1].map(zi => [-1, 0, 1].map(yi => [-1, 0, 1].map(xi =>
            get(space, Number(x) + xi, Number(y) + yi, Number(z) + zi, Number(w) + wi, false)
        ))))
        const flatNeighboors = neighboors.flat().flat().flat();
        flatNeighboors.splice(40, 1);
        const activeNeighboors = flatNeighboors.filter(d => d === "#").length
        if (v === "#") {
            if (activeNeighboors === 2 || activeNeighboors === 3) {
                set(next, x, y, z, w, "#");
            } else {
                set(next, x, y, z, w, ".");
            }
        } else {
            if (activeNeighboors == 3) {
                set(next, x, y, z, w, "#");
            } else {
                set(next, x, y, z, w, ".");
            }
        }
    }))))
    return next;
}

function obj(a, b) {
    return Object.assign(a, b);
}

function countActive(space) {
    return Object.values(space).map(s => Object.values(s).map(p => Object.values(p).map(r => Object.values(r).map(v =>
        v === "#"
    )))).flat().flat().flat().filter(d => d).length
}

console.log(data)
let space = { 0: { 0: data.map((r, y) => ({ [y]: r.map((v, x) => ({ [x]: v })).reduce(obj, {}) })).reduce(obj, {}) } }
for (let i = 0; i < 6; i++) {
    console.log(i, countActive(space));
    display(space);
    space = conway(space);
}

console.log(countActive(space));