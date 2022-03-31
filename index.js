import tmi from "tmi.js";
import { tmiIdentity } from "./auth.js";

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ["jamuwu_"],
    identity: tmiIdentity
});

console.log("jam jamming");
client.connect();

client.on('message', (channel, tags, message, self)=>{
    console.log(`channel: ${channel}`);
    console.log(tags);
    console.log(`${tags['display-name']}: ${message}`);
});