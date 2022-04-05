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

export default {
    hai,
    createConst,
    insertArg
}