const lines = require('fs').readFileSync('test.txt', { encoding: 'utf-8' }).split('\n');

let seats = lines;

function countA(i,j,x,y) {
    return ((i != 0 || j != 0) && seats[y + j] && seats[y + j][x + i] === '#') ?  1: 0;
}

function countAll(x,y) {
    let occupied = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            occupied += countA(i,j,x,y)
        }
    }
    return occupied;
}

function nextState() {
    let hasChanged = false;
    seats = seats.map((line,y) => [...line].map((seat,x)=>{
        let occupied = countAll(x,y);
        if (seat === 'L' && occupied === 0) {
            hasChanged = true;
            return '#';
        } else if (seat === '#' && occupied >= 4) {
            hasChanged = true;
            return 'L';
        }
        return seat;
    }).join(""));
    return hasChanged;
}

const display = d => {
    const countA = d.map((r, j) => r.split("").map((s, i) => countAll( i, j)))
    const occupy = d.map((r, j) => r.split("").map((s, i) => s === "L" && countA[j][i] === 0 ? "#" : " "));
    const free = d.map((r, j) => r.split("").map((s, i) => s === "#" && countA[j][i] >= 4 ? "L" : " "));
    console.log(d.map((r, j) => r + " " + countA[j].join("") + " " + occupy[j].join("") + " " + free[j].join("")).join("\n"));
}


function getOccupiedSeats(){
    return seats.map(l=>l.split("")).flat().filter(d=>d==="#").length;
}

display(seats)
console.log("---------------------------")

while (nextState()) {
    display(seats)
    console.log("---------------------------")
}

console.log(getOccupiedSeats());
