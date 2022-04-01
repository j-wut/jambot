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

const commandConstMatcher = /\{\{(\s+)\}\}/;

export function createCommand(channel, tags, args, client) {
    if (isMod(tags)) {
        client.say(channel, `command ${args[0]} created`);
        commandStore[args[0]] = args[1];
        console.log(commandStore);
    }
}


const argMatcher = /((?:(?:'.*')|(?:".*")|(?:`.*`)|(?:[^'"`,\s]+)))[,\s]*/g;

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




export default {
    hai,
    createConst,
}