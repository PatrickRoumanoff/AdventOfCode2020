function parseData(rawData) {
    return rawData.split("\n").map(r => r.split(""))
}

const rawData = require('fs').readFileSync(process.env.INPUT_DATA || "./data.txt", "utf8")
const data = parseData(rawData);



function get(space, x, y, z, extend = true) {
    if (!space[z]) {
        if (!extend) {
            return ".";
        }
        space[z] = { [y]: { [x]: "." } };
    }
    if (!space[z][y]) {
        if (!extend) {
            return ".";
        }
        space[z][y] = { [x]: "." };
    }
    if (!space[z][y][x]) {
        if (!extend) {
            return ".";
        }
        space[z][y][x] = ".";
    }
    return space[z][y][x];
}

function set(space, x, y, z, v) {
    if (!space[z]) {
        space[z] = {};
    }
    if (!space[z][y]) {
        space[z][y] = {};
    }
    space[z][y][x] = v;
}

function display(space) {
    let minZ = 0, maxZ = 0, minY = 0, maxY = 0, minX = 0, maxX = 0;
    Object.entries(space).map(([z, p]) => Object.entries(p).map(([y, r]) => Object.entries(r).map(([x, v]) => {
        minZ = Math.min(minZ, z);
        maxZ = Math.max(maxZ, z);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
    })))

    for (let z = minZ; z <= maxZ; z++) {
        console.log(`z=${z}`);
        for (let y = minY; y <= maxY; y++) {
            let line = "";
            for (let x = minX; x <= maxX; x++) {
                line += get(space, x, y, z, false);
            }
            console.log(line);
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
    Object.entries(space).map(([z, p]) => Object.entries(p).map(([y, r]) => Object.entries(r).map(([x, v]) => {
        if (v === "#") {
            [-1, 0, 1].map(zi => [-1, 0, 1].map(yi => [-1, 0, 1].map(xi =>
                get(space, Number(x) + xi, Number(y) + yi, Number(z) + zi)
            )))
        }
    })))
    const next = {};
    Object.entries(space).map(([z, p]) => Object.entries(p).map(([y, r]) => Object.entries(r).map(([x, v]) => {
        const neighboors = [-1, 0, 1].map(zi => [-1, 0, 1].map(yi => [-1, 0, 1].map(xi =>
            get(space, Number(x) + xi, Number(y) + yi, Number(z) + zi, false)
        )))
        const flatNeighboors = neighboors.flat().flat();
        flatNeighboors.splice(13, 1);
        const activeNeighboors = flatNeighboors.filter(d => d === "#").length
        if (v === "#") {
            if (activeNeighboors === 2 || activeNeighboors === 3) {
                set(next, x, y, z, "#");
            } else {
                set(next, x, y, z, ".");
            }
        } else {
            if (activeNeighboors == 3) {
                set(next, x, y, z, "#");
            } else {
                set(next, x, y, z, ".");
            }
        }
    })))
    return next;
}

function obj(a, b) {
    return Object.assign(a, b);
}

function countActive(space) {
    return Object.entries(space).map(([z, p]) => Object.entries(p).map(([y, r]) => Object.entries(r).map(([x, v]) =>
        get(space, x, y, z) === "#"
    ))).flat().flat().filter(d => d).length
}

console.log(data)
let space = { 0: data.map((r, y) => ({ [y]: r.map((v, x) => ({ [x]: v })).reduce(obj, {}) })).reduce(obj, {}) }
for (let i = 0; i < 6; i++) {
    console.log(i, countActive(space));
    display(space);
    space = conway(space);
}

console.log(countActive(space));