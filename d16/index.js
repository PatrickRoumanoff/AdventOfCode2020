function parseData(raw) {
    let next;
    return raw.split(/\n/).map(d => {
        if (d.indexOf(" or ") != -1) {
            const groups = /^(?<name>[\w ]*): (?<min1>\d*)-(?<max1>\d*) or (?<min2>\d*)-(?<max2>\d*)$/g.exec(d).groups
            return {
                field: groups.name,
                min1: Number(groups.min1),
                max1: Number(groups.max1),
                min2: Number(groups.min2),
                max2: Number(groups.max2)
            }
        }
        if (d.indexOf("ticket") != -1) {
            next = d.split(" ")[0];
            return;
        }
        if (next && d.trim()) {
            return { ticket: next, fields: d.split(",").map(d => Number(d)) };
        }
        return;
    }).filter(d => d);


}

const rawData = require('fs').readFileSync(process.env.INPUT_DATA || "./data.txt", "utf8")
const data = parseData(rawData);

function isValid(d, validation) {
    return validation.filter(({ min, max }) => min <= d && d <= max).length > 0;
}

function findInvalidFields(validation, fields) {
    return fields.filter(d => !isValid(d, validation))
}

// console.log(data);

const validation = data.filter(d => d.field);
const range1 = validation.map(d => ({ min: d.min1, max: d.max1 }));
const range2 = validation.map(d => ({ min: d.min2, max: d.max2 }));
const range = range1.concat(range2);
const nearby = data.filter(d => d.ticket === "nearby")
const fields = nearby.map(d => d.fields).reduce((a, b) => a.concat(b), []);

// console.log(range, fields);
const invalidFields = findInvalidFields(range, fields);
console.log(invalidFields.reduce((a, b) => a + b));

const allTickets = data.filter(d => d.ticket)


const validTickets = allTickets.filter(d => d.fields.filter(f => invalidFields.indexOf(f) !== -1).length === 0);
console.log(`valid tickets: ${validTickets.length}/${nearby.length}`)
const fieldValues = [];
validTickets.forEach(t => {
    t.fields.forEach((f, i) => {
        fieldValues[i] = fieldValues[i] || []
        fieldValues[i].push(f);
    })
});
// console.log(validTickets);
const validValidation = fieldValues.map(values =>
    validation.filter(r =>
        values.filter(v => (r.min1 <= v && v <= r.max1) || (r.min2 <= v && v <= r.max2)).length === validTickets.length
    )
)

// console.log(fieldValues[2].sort((a, b) => -a + b));
// console.log(validValidation[2])

// console.log(validValidation.map(r => r.length));
let round = validValidation;
while (round.filter(d => d.length > 1).length > 0) {
    //for each field which only has one validation, it can be removed from every other Field.
    const uniqueValidation = round.filter(vv => vv.length === 1).map(vv => vv[0].field).flat();
    // console.log(uniqueValidation.length)
    round = round.map(vv => {
        if (vv.length > 1) {
            return vv.filter(v => uniqueValidation.indexOf(v.field) === -1);
        }
        return vv;
    })

    // console.log(round.map(r => r.length));
}

const your = data.filter(d => d.ticket === "your")[0];

const my = round.flat().map((v,i)=> ({[v.field]:your.fields[i]})).reduce((a,b)=>Object.assign(a,b), {});
console.log(my);

console.log(Object.entries(my).filter(([k,v])=> k.indexOf("departure")===0).map(([,v])=>v).reduce((a,b)=>a*b,1))