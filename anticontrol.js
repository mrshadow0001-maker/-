const { cmd } = require('../command');
const fs = require('fs');
const path = require('./database/antilink.json'); // වෝනින් සේව් කරගැනීමට

cmd({
    on: "body"
}, async (conn, mek, m, { from, isGroup, sender, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup || isAdmins || !isBotAdmins) return;
        
        const bodyText = m.body || "";
        const isLink = /chat.whatsapp.com|t.me|http|https|www./i.test(bodyText);

        if (isLink) {
            let db = fs.existsSync('./database/antilink.json') ? JSON.parse(fs.readFileSync('./database/antilink.json')) : {};
            if (!db[from]) db[from] = {};
            
            if (!db[from][sender]) {
                db[from][sender] = 1;
                fs.writeFileSync('./database/antilink.json', JSON.stringify(db, null, 2));
                await conn.sendMessage(from, { delete: mek.key });
                return reply(`⚠️ *WARNING 1/2:* @${sender.split('@')[0]}, Links are not allowed in this group! Second time you will be removed.`, { mentions: [sender] });
            } else {
                db[from][sender] += 1;
                fs.writeFileSync('./database/antilink.json', JSON.stringify(db, null, 2));
                
                if (db[from][sender] >= 2) {
                    await conn.sendMessage(from, { delete: mek.key });
                    await conn.groupParticipantsUpdate(from, [sender], "remove");
                    return reply(`❌ @${sender.split('@')[0]} has been removed for spamming links twice!`, { mentions: [sender] });
                } else {
                    await conn.sendMessage(from, { delete: mek.key });
                    return reply(`⚠️ *WARNING:* @${sender.split('@')[0]} Link deleted again!`, { mentions: [sender] });
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
});
