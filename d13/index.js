function parseData(raw) {
    const lines = raw.split(/\n/);
    return { depart: Number(lines[0]), bus: lines[1].split(",").filter(d => d !== 'x').map(d => Number(d)) }
}

function parseData2(raw) {
    return raw.split(/\n/)[1].split(",").
        map((d, i) => ({ b: d, o: i })).
        filter(d => d.b !== 'x').
        map(({ b, o }) => ({ b: Number(b), o })).
        sort((a, b) => a.b > b.b ? -1 : 1);
}

const rawData = require('fs').readFileSync(process.env.INPUT_DATA || "./data.txt", "utf8")
const data = parseData(rawData);

function lowestTime({ depart, bus }) {
    return bus.map(d => ({ b: d, d: Math.floor(depart / d + 1) * d - depart })).reduce((a, b) => a.d > b.d ? b : a, { d: 100 });
}

function* getMultiples(m) {
    let i = 1;
    while (true) {
        yield m * i++;
    }
}

function findSolution(data) {
    const a = data[0];
    for (const t of getMultiples(a.b)) {
        const match = data.map(d => (Math.floor(((t - a.o + d.o) / d.b)) * d.b - t) === (d.o - a.o)).filter(d => d).length;
        if (match === data.length) {
            console.log("win", t, a);
            return data.map(d => ({ b: d.b, o: d.o, v: Math.floor(((t - a.o + d.o) / d.b)) * d.b }));
        }
    }
}

function ExtendedEuclid(x, y) {
    let x0 = 1, x1 = 0, y0 = 0, y1 = 1;
    while (y > 0) {
        q = Math.floor(x / y)
        x = y;
        y = x % y;
        x0 = x1;
        x1 = x0 - q * x1;
        y0 = y1;
        y1 = y0 - q * y1;
    }

    return { q, x0, y0 }  // gcd and the two coefficients
}

function invmod(a, m) {
    let {g, x0} = ExtendedEuclid(a, m)
    if (g !== 1)
        throw new Error('modular inverse does not exist')
    else
        return x0 % m
}

function ChineseRemainderGauss(n, N, a) {
    let result = 0
    n.forEach((ni, i) => {
        ai = a[i]
        bi = N / ni

        result += ai * bi * invmod(bi, ni)
    });
    return result % N
}

console.log(data);
const result = lowestTime(data)
console.log(lowestTime(data));
console.log(result.b * result.d);

const data2 = parseData2(rawData);
console.log(findSolution(data2));