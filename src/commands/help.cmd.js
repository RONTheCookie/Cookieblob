const {MessageEmbed, Message} = require("discord.js");
const Cookieblob = require("../Cookieblob");
const Permissions = require("../Permissions");
module.exports = {
    /**
     * @param {Cookieblob} cookieblob
     * @param {Message} msg
     * @param {String[]} args
     */
    run: async (cookieblob, msg, args) => {
        if (args.length < 1) args[0] = 1;
        if (args[0] < 1) return msg.channel.send(":x: Pages start from `1`!");
        const abandonTime = 40000;//ms
        const cpp = 10; // commands per page
        const commands = Object.keys(cookieblob.commands).map(cookieblob.getCommand).filter(cm => cm.meta.permissionLevel != "botAdmin").filter(cx => cx.meta.permissionLevel != "botOwner");
        let currentPage = args[0] - 1;
        if (isNaN(currentPage)) {
            require("../util").usage(msg);
            return;
        }
        function getLastProperPage() {
            let amount = commands.length;
            let result = commands.length/cpp;
            if (commands.length%cpp != 0) result++;
            return ~~result;
        }
        if (currentPage > getLastProperPage()) return msg.channel.send(`Invalid page! Range is 1 to ${getLastProperPage()}`);
        async function makeEmbed() {
            let startFrom = currentPage*cpp;
            let pageCmds = commands.slice(startFrom, startFrom + cpp);
            const viewthedocs = "***[View the documentation online](https://cookieblob.ronthecookie.me/docs)***";
            let embed = new MessageEmbed()
            .setAuthor("Cookieblob command list - Page "+(currentPage+1),client.user.displayAvatarURL())
            .setColor(0xffc300)
            .setTimestamp(new Date())
            .setDescription(viewthedocs+"\n"
            +pageCmds.map(cmd => `**${cmd.meta.name}** - ${cmd.meta.description}\nUsage: ${require("../util").renderUsage(cmd.meta.name)}`).join("\n\n")
        + "\n" + viewthedocs);
//             pageCmds.forEach(cmd => {
//                 embed.addField(cmd.meta.name,`Description: \`${cmd.meta.description}\` 
// Usage: \`${require("../util").renderUsage(cmd.meta.name)}\``);    
//             });
            return embed;
        }
        let emB = await makeEmbed();
        let m = await msg.channel.send(emB);
    },
    name: "help",
    description: "Show the list of commands you are currently looking at!",
    usage: ["page:number"],
    permissionLevel:Permissions.everyone,
    guildOnly:false
}
