const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "menu",
    alias: ["panel", "help"],
    react: "🔥",
    desc: "Get bot menu",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        let menuText = `
* Ｉｔｓme𝑳𝒖𝒄𝒊𝒇𝒆𝒓 ࿐  *

> *👑 Owner:* ${config.OWNER_NAME}
> *📢 WhatsApp Channel 1:* ${config.WHATSAPP_CHANNEL_1}
> *📢 WhatsApp Channel 2:* ${config.WHATSAPP_CHANNEL_2}
> *💬 Telegram Channel:* ${config.TELEGRAM_CHANNEL}

*┌─────────────────*
*│ 📥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗠𝗘𝗡𝗨*
*│  • .song / .video*
*│  • .tiktok <url>*
*│  • .fb <url>*
*│  • .insta <url>*
*└─────────────────*

*┌─────────────────*
*│ 👥 𝗚𝗥𝗢𝗨𝗣 & 𝗔𝗗𝗠𝗜𝗡*
*│  • .add <number>*
*│  • .remove <number>*
*│  • .tagall*
*│  • .mute / .unmute*
*└─────────────────*

*┌─────────────────*
*│ 🤖 𝗔𝗜 & 𝗧𝗢𝗢𝗟𝗦*
*│  • .ai <question>*
*│  • .aipic <prompt>*
*└─────────────────*

> *✨ ᴄʀᴇᴀᴛᴇᴅ ʙ🇾 cyber king shadow*
`;

        // Owner contact button / vcard setup
        await conn.sendMessage(from, {
            image: { url: 'https://res.cloudinary.com/df2rnoijw/image/upload/v1752404824/shkqo3nbxkhhbyej2lxm.jpg' },
            caption: menuText,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

        // Sending Owner Contact Card with Button format
        const vcard = 'BEGIN:VCARD\n' +
              'VERSION:3.0\n' +
              'FN:' + config.OWNER_NAME + '\n' +
              'TEL;type=CELL;type=VOICE;waid=' + config.OWNER_NUMBER + ':+' + config.OWNER_NUMBER + '\n' +
              'END:VCARD';

        await conn.sendMessage(from, {
            contacts: {
                displayName: config.OWNER_NAME,
                contacts: [{ vcard }]
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
