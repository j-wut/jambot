import tmi from "tmi.js";
import { tmiIdentity } from "./auth.js";
import commands from "./commands.js";

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ["jamuwu_"],
    identity: tmiIdentity
});

client.connect().then(
    client.getChannels().forEach((channel)=>{
        client.say(channel, "initiating jamming :3");
    })
);

const functionRegex = /^jam\.(\w+)\(\s*((?:(?:(?:'.*')|(?:".*")|(?:`.*`)|([^'"`,\s]*))[,\s]*)*)\)$/;

client.on('message', (channel, tags, message, self)=>{
    try{
        console.log(tags);
        const matches = message.match(functionRegex);
        if(!matches && message.substring(0,4) === "jam."){
            client.say(channel, "misformated command");
        } else if (!!matches) {

            console.log("Command Found:");
            console.log(matches)
            console.log(`${matches[1]}: ${matches[2]}`);
            const [_, command, args] = matches;
            const validCommand = Object.keys(commands).find((val)=>val === command);
            if (validCommand) {
                commands[validCommand](channel, tags, args.split(/[\s,]+/), client);
            } else {
                client.say(channel, `Uncaught TypeError: ${command} is not a function`);
            }
        }
    } catch (e) {
        console.error(e);
    }
});
