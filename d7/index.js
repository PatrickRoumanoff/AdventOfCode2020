function parseContent(content) {
    const re = /^ (?<count>\d*) (?<color>\w* \w*)$/
    const match = content.match(re);
    return { count: Number.parseInt(match.groups.count), color: match.groups.color };
}

function parseRule(rule) {
    const simple = rule.replace(/ bags?/g, "").replace(/ contain/g, ":").replace(/: no other/g, "").replace(/\./g, "").replace(/,/g, ":")
    const re = simple.split(":");
    return { color: re[0], content: re.slice(1).map(parseContent) };
}

function parseData(raw) {
    return raw.split(/\n/).map(parseRule).map(rule => ({ [rule.color]: rule.content })).reduce((a, b) => Object.assign(a, b), {});
}

function findAllContainers(data, c) {
    return Object.entries(data).filter(([, v]) => v.map(d => d.color).indexOf(c) >= 0).map(([k]) => k);
}

function buildIsContained(data) {
    const ruleColor = Object.keys(data);
    const contenColor = Object.values(data).flat().map(d => d.color);
    const allColors = [...new Set(contenColor.concat(ruleColor))];
    return allColors.map(c => ({ [c]: findAllContainers(data, c) })).reduce((a, b) => Object.assign(a, b), {});
}

function findNextLevelContainer(data, colorList) {
    const isContained = buildIsContained(data);
    return [...new Set(colorList.map(c => isContained[c]).flat().concat(step))];
}

function countInsideBags(data, c) {
    return data[c].map(({ count, color }) => count * countInsideBags(data, color)).reduce((a, b) => a + b, 1);
}

const rawData = require('fs').readFileSync(process.env.INPUT_DATA || "./data.txt", "utf8")
const data = parseData(rawData);

// let step = ["shiny gold"];
// let = prev ="";
// let json = JSON.stringify(step);
// while (json !== prev) {
//     step = findNextLevelContainer(data, step);
//     prev=json;
//     json = JSON.stringify(step);
// }
// console.log(step.length - 1);

// console.log(data["shiny gold"]);
console.log(countInsideBags(data, "shiny gold") - 1);
