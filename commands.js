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
const variableExpressionRegex = /((\w+)((?:\+\+)|(?:\-\-))?)/

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
    mockExpressionTree
}