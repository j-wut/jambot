import { isMod } from "./utils.js";

const constStore = {};

const commandStore = {};

export function hai(channel, tags, args, client) {
    client.say(channel, `hai ${args[0]}! :3 -${tags["username"]}`);
}

export function createConst(channel, tags, args, client) {
    if (isMod(tags)){
        client.say(channel, `const ${args[0]} initialized`);
        constStore[args[0]] = Number(args[1]) || 0;
        console.log(constStore);
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


const argMatcher = /((?:(?:'.*')|(?:".*")|(?:`.*`)|(?:[^'"`,\s]*)))[,\s]*/;



export default {
    hai,
    createConst,
}