const Cookieblob = require("../Cookieblob");
const Permissions = require("../Permissions");
module.exports = {
    /**
     * @param {Cookieblob} cookieblob
     * @param {Message} msg
     * @param {String[]} args
     */
    run: async (cookieblob, msg, args) => {
        try {
            const toEval = args.join(" ");
            let result = eval(toEval);
            if (typeof result != "string") result = require("util").inspect(result);
            if (result.length > 1990) return msg.channel.send("Message is over the discord message contents limit.");
            msg.channel.send("```js\n"+result+"\n```");
        } catch (error) {
            msg.channel.send("Error!```"+error.stack+"```");
        }
    },
    name: "eval",
    description: "Evaluate a command",
    usage: [],
    permissionLevel:Permissions.botOwner,
    guildOnly:false
}