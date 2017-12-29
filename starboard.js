const datastorage = require("./datastorage");
const cookieblob = require("./cookieblob");
const table = require("rethinkdb").table("starboard");
async function handle(r, user) {
    const reactionamount = 3;
    const star = "⭐";
    if (!r.message.guild || r.count <= reactionamount || r.emoji != star || user.me) return;
    let count = r.count;
    let gd = await datastorage.getGuildData(r.guild.id);
    if (gd.guildData.starboard == null) return;
    if (r.count == reactionamount) {
        let starChannel = r.guild.channels.get(gd.guildData.starboard);
        if (!starChannel) return; // channel does not exist );
        let m = await starChannel.send(`${star} ${count} ${r.message.tag} \`${r.message.content}\``);
        await table.insert({id: r.message.id /*orig message*/, count:count, target: m.id}).run(cookieblob.rethinkConnection);
        await m.react(star);
    } else {
        let infonr = table.get(r.message.id);
        let info = await infonr.run(cookieblob.rethinkConnection);
        if (!info) return;
        let ha = await r.message.channel.messages.fetch(info.target);
        info.count = count;
        await ha.edit(`${star} ${count} ${r.message.tag} \`${r.message.content}\``);
        await infonr.update(info).run(cookieblob.rethinkConnection);
    }
}
cookieblob.client.on('messageReactionAdd', handle);
cookieblob.client.on('messageReactionRemove', handle);