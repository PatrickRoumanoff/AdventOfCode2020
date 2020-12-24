function parseData(rawData) {
    return rawData.split("\n")
}

const rawData = require('fs').readFileSync(process.env.INPUT_DATA || "./data.txt", "utf8")
const data = parseData(rawData);

function hasGreaterPrecedence1(t1, t2) {
    return true;
}

function hasGreaterPrecedence2(t1, t2) {
    return t1 === "*" && t2 === "+";
}


/** from https://en.wikipedia.org/wiki/Shunting-yard_algorithm
while there are tokens to be read:
    read a token.
    if the token is a number, then:
        push it to the output queue.
    else if the token is a function then:
        push it onto the operator stack 
    else if the token is an operator then:
        while ((there is an operator at the top of the operator stack)
              and ((the operator at the top of the operator stack has greater precedence)
                  or (the operator at the top of the operator stack has equal precedence and the token is left associative))
              and (the operator at the top of the operator stack is not a left parenthesis)):
            pop operators from the operator stack onto the output queue.
        push it onto the operator stack.
    else if the token is a left parenthesis (i.e. "("), then:
        push it onto the operator stack.
    else if the token is a right parenthesis (i.e. ")"), then:
        while the operator at the top of the operator stack is not a left parenthesis:
            pop the operator from the operator stack onto the output queue.
        /* If the stack runs out without finding a left parenthesis, then there are mismatched parentheses. 
        if there is a left parenthesis at the top of the operator stack, then:
            pop the operator from the operator stack and discard it
        if there is a function token at the top of the operator stack, then:
            pop the function from the operator stack onto the output queue.
/* After while loop, if operator stack not null, pop everything to output queue 
if there are no more tokens to read then:
    while there are still operator tokens on the stack:
        /* If the operator token on the top of the stack is a parenthesis, then there are mismatched parentheses.
        pop the operator from the operator stack onto the output queue.
exit.
 */
function shuntingYardAlgorithm(tokens, precedence) {
    const output = [];
    const operators = [];
    tokens.split("").filter(c => c !== " ").map(token => {
        if (!isNaN(token)) {
            output.push(Number(token));
        } else if (token === "+" || token === "*") {
            while (operators.length > 0 && precedence(token, operators[operators.length - 1]) && operators[operators.length - 1] !== "(") {
                let op = operators.pop();
                output.push(op);
            }
            operators.push(token);
        } else if (token === "(") {
            operators.push(token);
        } else if (token === ")") {
            while (operators[operators.length - 1] !== "(") {
                let op = operators.pop();
                output.push(op);
            }
            if (operators[operators.length - 1] === "(") {
                operators.pop();
            }
        }
    });
    operators.reverse().map(op => output.push(op));
    return output;
}

function evaluate(data) {
    return data.reduce((a, b) => {
        if (!isNaN(b)) {
            a.push(b);
        } else if (b === "+") {
            a.push(a.pop() + a.pop());
        } else if (b === "*") {
            a.push(a.pop() * a.pop());
        }
        return a;
    }, []).pop()
}

// console.log(data)
const rpn = data.map(d => shuntingYardAlgorithm(d, hasGreaterPrecedence1))
// console.log(rpn);
const values = rpn.map(evaluate)
// console.log(values);
console.log(values.reduce((a, b) => a + b, 0))
//2
const rpn2 = data.map(d => shuntingYardAlgorithm(d, hasGreaterPrecedence2))
// console.log(rpn2);
const values2 = rpn2.map(evaluate)
// console.log(values2);
console.log(values2.reduce((a, b) => a + b, 0))
