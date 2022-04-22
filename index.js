import tmi from "tmi.js";
import { tmiIdentity } from "./auth.js";
import commands, {argsParser} from "./commands.js";

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

const functionRegex = /^jam\.(\w+)\(\s*((?:(?:(?:'.*')|(?:".*")|(?:`.*`)|([^'"`,\s]+))[,\s]*)*)\)$/;

client.on('message', (channel, tags, message, self)=>{
    try{
        const matches = message.match(functionRegex);
        if(!matches && message.substring(0,4) === "jam."){
            throw new Error("misformated command");
        } else if (!!matches) {

            console.log("Command Found:", matches);
            const [_, command, args] = matches;
            const validCommand = Object.keys(commands).find((val)=>val === command);
            if (validCommand) {
                commands[validCommand](channel, tags, argsParser(args), client);
            } else {
                throw new Error(`Uncaught TypeError: ${command} is not a function`);
            }
        }
    } catch (e) {
        console.error(e);
        client.say(channel, e.message);
    }
});
