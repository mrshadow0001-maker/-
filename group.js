const { cmd } = require('../command');

cmd({
    pattern: "add",
    desc: "Add a member to group",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, q, isGroup, isAdmins, isBotAdmins, reply }) => {
    if (!isGroup) return reply("❌ Group only command!");
    if (!isAdmins) return reply("❌ Admins only!");
    if (!isBotAdmins) return reply("❌ Bot must be admin!");
    if (!q) return reply("❌ Provide phone number with country code (e.g. 947xxxxxxx)");
    
    let user = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
    try {
        await conn.groupParticipantsUpdate(from, [user], "add");
        reply(`✅ Successfully added @${user.split('@')[0]}`, { mentions: [user] });
    } catch (e) {
        reply("❌ Failed to add member.");
    }
});

cmd({
    pattern: "remove",
    alias: ["kick"],
    desc: "Remove member from group",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, quoted, q, isGroup, isAdmins, isBotAdmins, reply }) => {
    if (!isGroup) return reply("❌ Group only command!");
    if (!isAdmins) return reply("❌ Admins only!");
    if (!isBotAdmins) return reply("❌ Bot must be admin!");

    let user = quoted ? quoted.sender : q ? q.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : null;
    if (!user) return reply("❌ Reply to a user or mention them to remove.");

    try {
        await conn.groupParticipantsUpdate(from, [user], "remove");
        reply(`✅ Successfully removed!`);
    } catch (e) {
        reply("❌ Failed to remove member.");
    }
});

cmd({
    pattern: "tagall",
    desc: "Tag all group members",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, groupMetadata, reply }) => {
    if (!isGroup) return reply("❌ Group only command!");
    if (!isAdmins) return reply("❌ Admins only!");

    let mems = groupMetadata.participants;
    let teks = `╔═══ 📢 *TAG ALL* 📢\n`;
    let jids = [];
    for (let mem of mems) {
        teks += `╠ @${mem.id.split('@')[0]}\n`;
        jids.push(mem.id);
    }
    teks += `╚════════════════`;
    await conn.sendMessage(from, { text: teks, mentions: jids }, { quoted: mek });
});
