const data = [
    [0, 3, 6],
    [2, 20, 0, 4, 1, 17]
]

//              1  2  3  4  5  6  7  8  9 10
const result = [0, 3, 6, 0, 3, 3, 1, 0, 4, 0]

function play(start, until) {
    console.log(start);
    let lastSpoken;
    let next = 0;
    let turn = start.length + 1
    while (turn < until + 1) {
        lastSpoken = start[turn - 2];
        const when = start.lastIndexOf(lastSpoken, turn - 3) + 1;
        if (when != 0) {
            next = turn - when - 1;
        } else {
            next = 0;
        }
        start.push(next);
        console.log(`${turn} => ${next}, ${result[turn - 1] == next ? "" : "expecting " + result[turn - 1]}`);
        turn++;
    }
    console.log(`${turn}: ${next}`)
}

function play2(start, until) {
    let spoken = new Map();
    start.map((d, i) => spoken.set(d, i + 1));
    let justSpoke = start[start.length - 1];
    for (let i = start.length; i < until; i++) {
        const last = spoken.has(justSpoke);
        spoken.set(justSpoke, i);
        justSpoke = last ? (i - last) : 0;
    }
    console.log(justSpoke);
}

function play3(start, until) {
    let spoken = new Map();
    let justSpoke = 0;
    for (let i = 0; i < until; i++) {
        if (start[i] || start[i] === 0) {
            justSpoke = start[i];
            spoken.set(justSpoke, i + 1);
        } else if (!(spoken.has(justSpoke))) {
            spoken.set(justSpoke, i);
            justSpoke = 0;
        } else {
            let temp = spoken.get(justSpoke);
            spoken.set(justSpoke, i);
            justSpoke = i - temp;
        }
    }
    console.log(justSpoke);
}

play(data[0], 10)
play3(data[1],3000);
play2(data[1], 300)