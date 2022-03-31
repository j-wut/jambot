export function hai(channel, tags, args, client) {
    client.say(channel, `hai ${args[0]}! :3 -${tags["username"]}`);
}

export default {
    hello: hai
}