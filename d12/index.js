function parseData(raw) {
    return raw.split(/\n/).map(d => ({ d: d[0], a: Number(d.slice(1)) }));
}

const rawData = require('fs').readFileSync(process.env.INPUT_DATA || "./data.txt", "utf8")
const data = parseData(rawData);

// console.log(data);

function followPath(data, dir, x, y) {
    return data.reduce(({ dir, x, y }, { d, a }) => {
        console.log({ dir, x, y }, "\n", { d, a })
        switch (d) {
            case 'N': return ({ dir, x, y: y + a });
            case 'E': return ({ dir, x: x + a, y });
            case 'S': return ({ dir, x, y: y - a });
            case 'W': return ({ dir, x: x - a, y });
            case 'R': return ({ dir: dir - a, x, y });
            case 'L': return ({ dir: dir + a, x, y });
            case 'F': return ({ dir, x: x + a * Math.round(Math.cos(dir * Math.PI / 180)), y: y + a * Math.round(Math.sin(dir * Math.PI / 180)) });
            default: throw new Error(d);
        }
    }, { dir, x, y });
}

function rotateX(x, y, angle) {
    return x * Math.round(Math.cos(angle* Math.PI / 180)) - y * Math.round(Math.sin(angle* Math.PI / 180));
}
function rotateY(x, y, angle) {
    return y * Math.round(Math.cos(angle* Math.PI / 180)) + x * Math.round(Math.sin(angle* Math.PI / 180));
}

function followWayPoint(data, dir, x, y, wx, wy) {
    return data.reduce(({ dir, x, y, wx, wy }, { d, a }) => {
        console.log({ dir, x, y, wx, wy }, "\n", { d, a })
        switch (d) {
            case 'N': return ({ dir, x, y, wx, wy: wy + a });
            case 'E': return ({ dir, x, y, wx: wx + a, wy });
            case 'S': return ({ dir, x, y, wx, wy: wy - a });
            case 'W': return ({ dir, x, y, wx: wx - a, wy });
            case 'R': return ({ dir, x, y, wx: rotateX(wx, wy, -a), wy: rotateY(wx, wy, -a) });
            case 'L': return ({ dir, x, y, wx: rotateX(wx, wy, a), wy: rotateY(wx, wy, a) });
            case 'F': return ({ dir, x: x + a * wx, y: y + a * wy,wx,wy });
            default: throw new Error(d);
        }
    }, { dir, x, y, wx, wy });
}

function Manhattan({ x, y }) {
    return Math.abs(x) + Math.abs(y)
}

const pos = followPath(data, 0, 0, 0);
console.log(Manhattan(pos));

const posW = followWayPoint(data, 0, 0, 0, 10, 1);
console.log(posW);
console.log(Manhattan(posW));


/**
 *       N
 *       90
 * W 180   0 E
 *      270
 *       S
 *
 */

