import { isMod } from "./utils.js";

const constStore = {};

const commandStore = {};

export function hai(channel, tags, args, client) {
    client.say(channel, `hai ${args[0]}! :3 -${tags["username"]}`);
}

export function createConst(channel, tags, args, client) {
    if (isMod(tags)){
        constStore[args[0]] = Number(args[1]) || 0;
        console.log("constStore:", constStore);
        client.say(channel, `const ${args[0]} initialized to ${constStore[args[0]]}`);
    }
}

export function createCommand(channel, tags, args, client) {
    if (isMod(tags)) {
        client.say(channel, `command ${args[0]} created`);
        commandStore[args[0]] = args[1];
        console.log(commandStore);
    }
}

export function insertArg(channel, tags, args, client) {
    console.log("insertParamter");
    client.say(channel, insertArgs(args[0], args.slice(1)));
}

const argMatcher = /((?:(?:'.*?')|(?:".*?")|(?:`.*?`)|(?:[^'"`,\s]+)))[,\s]*/g;

export const argsParser = (argString) => {
    const matches = argString.trim().matchAll(argMatcher);
    let currentMatcher = matches.next();
    const args = [];
    while (currentMatcher.value && !currentMatcher.done) {
        args.push(currentMatcher.value[1]);
        currentMatcher = matches.next();
    }
    console.debug(`argsParsed: `, args);
    return args;
}


const insertArgMatcher = /\[\[([0-9]+)\]\]/g
export const insertArgs = (inputString, argList, allowStrings = true) => {
    const matches = inputString.matchAll(insertArgMatcher);
    let currentMatcher = matches.next();
    let currentResult = inputString;
    console.log(currentMatcher);
    while(currentMatcher.value && !currentMatcher.done) {
        const argIndex = Number(currentMatcher.value[1]);
        const argToInsert = argList[Number(currentMatcher.value[1])];
        console.log ("argIndex",argIndex, "argToInsert", "argToInsert");
        if(!allowStrings && (argToInsert.includes('"') || argToInsert.includes('`') || argToInsert.includes('\''))){
            throw new Error("Quotes not allowed here");
        }
        currentResult = currentResult.replace(`[[${argIndex}]]`, isStringArg(argToInsert) ? argToInsert.substring(1,argToInsert.length-1) : argToInsert );
        console.log(currentResult);
        currentMatcher = matches.next()
    }
    return currentResult;
}

const isStringArg = (input) => {
    return input && input[0] === input[input.length-1] && ['"', '`', '\''].includes(input[0]);
}
/*
node:
{ operator: +-/*^,
  Left: Node,
  Right: Node,
  value: ??
}
*/


export function testExpressionBuilder(channel, tags, args, client) {
    const expressionTree = buildExpressionTree(args[0]);
    client.say(channel, expressionTreeToString(expressionTree));
    client.say(channel, String(evaluateExpressionTree(expressionTree)));
}
const variableExpressionRegex = /((\w+)((?:\+\+)|(?:\-\-))?)/

const operatorCharacters = ['+','-','*','/','^'];
const incDec = ["++","--"];

const isEquation = (inputString) =>{
return inputString.length > 1  && inputString.match(/[\+\-\*\/\^\(\)]/);
}

const getTier = (op) => {
    const tiers= [
        ['^'],
        ['*','/'],
        ['+','-']
    ];
    return tiers.findIndex((tier)=>tier.includes(op))
}

const buildExpressionTree = (inputString) =>  {
    const arrayOfThings = [];
    let currentString="";
    let depth=0;
    for(let index=0;index<inputString.length;index++){
        if(depth || inputString[index]=='('){
            if(inputString[index]=='('){
                if(depth++){
                    currentString+=inputString[index];
                }
            }else if(inputString[index]==')'){
                if(!--depth){
                    arrayOfThings.push(currentString);
                    currentString="";
                }else{
                    currentString+=inputString[index];
                }
            } else {
                currentString+=inputString[index]
            }
        }else if(inputString[index]==' '){
            arrayOfThings.push(currentString);
            currentString="";
        }else if(operatorCharacters.includes(inputString[index])){
            arrayOfThings.push(currentString);
            currentString="";
            arrayOfThings.push(inputString[index]);
        } else {
            currentString+=inputString[index]
        }
        console.log("currentString:",currentString);
        console.log("ArrayOfThings:",arrayOfThings);
    }
    arrayOfThings.push(currentString);
    
    console.log("final ArrayOfThings:",arrayOfThings);

    const filteredArrayOfThings = arrayOfThings.filter((thing)=>thing);
    console.log("filteredArrayOfThings:", filteredArrayOfThings);

    // Heres where we built the tree
    let head;
    while(filteredArrayOfThings.length){
        if(!head){
            let left = filteredArrayOfThings.shift();
            let operator = filteredArrayOfThings.shift();
            let right = filteredArrayOfThings.shift();
            // if (right == operator && (operator == '-' || operator == '+')){
            //     left+=operator+right;
            //     operator = filteredArrayOfThings.shift();
            //     right = filteredArrayOfThings.shift();
            // }
            head = {
                left: isEquation(left) ? buildExpressionTree(left) : {value: Number(left)},
                operator,
                right: isEquation(right) ? buildExpressionTree(right) : {value: Number(right)}
            }
        } else {
            let operator = filteredArrayOfThings.shift();
            let next = filteredArrayOfThings.shift();
            // if (next == operator && (operator == '-' || operator == '+')){
            //     left+=operator+right;
            //     operator = filteredArrayOfThings.shift();
            //     right = filteredArrayOfThings.shift();
            // }
            if(getTier(operator) <= getTier(head.operator)){
                head = {
                    left: head,
                    operator: operator,
                    right: isEquation(next) ? buildExpressionTree(next) : {value: Number(next)},
                }
            } else {
                head.right = {
                    left: head.right,
                    operator: operator,
                    right: isEquation(next) ? buildExpressionTree(next) : {value: Number(next)}
                }
            }
        }
        console.log("-".repeat(20));
        console.log(expressionTreeToString(head));

    }
    console.log(expressionTreeToString(head));
    return head;
}

const expressionTreeToString = (head, depth=0) => {
    console.log(head);
    return head.value ? 
    `${"--".repeat(depth)}Value: ${head.value}` : 
    `${"--".repeat(depth)}Operator: ${head.operator}\n${"--".repeat(depth)}Left:\n${expressionTreeToString(head.left,depth+1)}\n${"--".repeat(depth)}Right:\n${expressionTreeToString(head.right,depth+1)}`
}

/*
    1. replace variable inc/dec with placeholder
    2. Create Tree
    3. (successful tree creation)
    4. replace placeholders in tree with variable inc/dec
    5. slice variable store
    6. evaluate with copy of variable store
    7. if successful replace variable store with slice
    8. if unsuccessful, throw error, discard copy of variable store
*/

const evaluateExpressionTree = (head) => {
    switch(head.operator){
        case '+': return evaluateExpressionTree(head.left) + evaluateExpressionTree(head.right);
        case '-': return evaluateExpressionTree(head.left) - evaluateExpressionTree(head.right);
        case '/': return evaluateExpressionTree(head.left) / evaluateExpressionTree(head.right);
        case '*': return evaluateExpressionTree(head.left) * evaluateExpressionTree(head.right);
        case '^': return Math.pow(evaluateExpressionTree(head.left), evaluateExpressionTree(head.right));
        default:
            if(head.value)
                return head.value;
            else
                throw new Error("Invalid Operation");
    }
}

export function mockExpressionTree(channel, tags, args, client) {
    client.say(channel, String(evaluateExpressionTree({operator: args[0], left: {value: Number(args[1])}, right:{value:Number(args[2])}})));
}

export default {
    hai,
    createConst,
    insertArg,
    mockExpressionTree,
    testExpressionBuilder
}