const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const P = require('pino');
const config = require('./config');
const startTelegramBot = require('./telegramBot');
const axios = require('axios');

let linkWarnings = {}; // groupId -> userId -> count

async function startBot() {
    startTelegramBot();
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    
    const sock = makeWASocket({
        auth: state,
        logger: P({ level: 'silent' }),
        browser: ["ItsmeLucifer", "Chrome", "1.0"]
    });

    // Pair Code Login
    if (!sock.authState.creds.registered) {
        console.log("Waiting for Pair Code from Telegram...");
        // Telegram එකෙන් එන code එක check කරන loop එක
        setInterval(async () => {
            if (global.pairCodes) {
                for (let code in global.pairCodes) {
                    let number = global.pairCodes[code];
                    try {
                        let result = await sock.requestPairingCode(number, code);
                        // Baileys වල pair code ගන්නේ number එකෙන් විතරයි, code එක display වෙනවා phone එකේ
                        console.log(`Pair code for ${number}: ${code}`);
                    } catch(e){}
                }
            }
        }, 10000);
        
        // Manual: .pair command එකෙන් pair code ඉල්ලුවොත්
        const pairingCode = await sock.requestPairingCode(config.OWNER_NUMBER_DISPLAY.replace(/[^0-9]/g,''));
        console.log("Your WhatsApp Pair Code (Owner):", pairingCode);
    }

    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = msg.key.participant || from;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || "";
        const isOwner = sender === config.OWNER_NUMBER;

        // Auto Join WhatsApp Channels when bot is added
        if (msg.message.groupInviteMessage) {
            // Auto join logic - Baileys වලින් channel join කරන්න බෑ, ඒ නිසා message එකක් දානවා
        }

        // --- ANTI LINK SYSTEM ---
        if (isGroup && body.match(/(https:\/\/|http:\/\/|chat.whatsapp.com|t.me|wa.me)/gi)) {
            const groupMetadata = await sock.groupMetadata(from);
            const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
            if (!isAdmin) {
                const key = `${from}_${sender}`;
                linkWarnings[key] = (linkWarnings[key] || 0) + 1;
                await sock.sendMessage(from, { delete: msg.key });
                
                if (linkWarnings[key] === 1) {
                    await sock.sendMessage(from, { text: `⚠️ @${sender.split('@')[0]} Link දාන්න එපා! පළවෙනි Warning එක!`, mentions: [sender] });
                } else if (linkWarnings[key] >= 2) {
                    await sock.sendMessage(from, { text: `🚫 @${sender.split('@')[0]} දෙවෙනි පාරත් Link දැම්මා නිසා Remove කරනවා!`, mentions: [sender] });
                    await sock.groupParticipantsUpdate(from, [sender], "remove");
                    delete linkWarnings[key];
                }
                return;
            }
        }

        if (!body.startsWith(config.PREFIX)) return;
        const args = body.slice(1).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        // --- MENU ---
        if (command === 'menu' || command === 'help') {
            const menu = `
╭───「 *${config.BOT_NAME}* 」───
│ 👑 Owner: ${config.OWNER_NAME}
│ 🛡️ Creator: ${config.CREATOR}
│
│ *GROUP CONTROL*
│ .antilink on/off
│ .add 94xx - Add User
│ .kick @user - Remove
│ .tagall - Tag All Members
│ .hidetag Hello - Hide Tag
│
│ *DOWNLOADER*
│ .fb <link> - FB Video
│ .tiktok <link> - TikTok No Watermark
│ .ig <link> - Insta Video
│ .yt <link> - YouTube Video
│ .gimage cat - Google Image
│
│ *AI TOOLS*
│ .ai <text> - Chat with AI
│ .imagine cat - AI Image Gen
│
│ *OWNER*
│ .join <group link>
╰────────────────
            
*Owner Contact Button* 👇`;
            await sock.sendMessage(from, {
                text: menu,
                footer: "Shadow Kingdom",
                buttons: [
                    { buttonId: `owner`, buttonText: { displayText: `👑 ${config.OWNER_NUMBER_DISPLAY}` }, type: 1 },
                    { buttonId: `channel`, buttonText: { displayText: `📢 WhatsApp Channel` }, type: 1 }
                ],
                headerType: 1
            });
            // Auto Channel Invite
            await sock.sendMessage(from, { text: `Bot එක හොඳ නම් Channel එකට Join වෙන්න:\n${config.WHATSAPP_CHANNEL1}\n${config.WHATSAPP_CHANNEL2}` });
        }

        // --- TAG ALL ---
        if (command === 'tagall') {
            const groupMetadata = await sock.groupMetadata(from);
            let members = groupMetadata.participants.map(p => p.id);
            let text = `📢 *Tag All by ${config.BOT_NAME}*\n\n` + (args.join(" ") || "Attention Everyone!") + "\n\n";
            await sock.sendMessage(from, { text: text, mentions: members });
        }

        // --- AI CHAT (Simple) ---
        if (command === 'ai') {
            let prompt = args.join(" ");
            if(!prompt) return sock.sendMessage(from, {text: "Text එකක් දාන්න .ai hello වගේ"});
            // මෙතන OpenAI API එක දාගන්න
            await sock.sendMessage(from, { text: `🤖 *Lucifer AI*: \n\nඔයා ඇහුවේ "${prompt}" නේද? මම දැන් AI mode එකේ වැඩ කරනවා. OpenAI Key එක config එකේ දාන්න.` });
        }

        // --- DOWNLOADER EXAMPLE (yt-dlp) ---
        if (['yt','fb','tiktok','ig'].includes(command)) {
            let url = args[0];
            if(!url) return sock.sendMessage(from, {text: "Link එක දාන්න!"});
            await sock.sendMessage(from, {text: "⏳ Downloading... *"+config.BOT_NAME+"*"});
            // ytdlp logic එක මෙතනට එනවා - server එකේ yt-dlp install කරලා තියෙන්න ඕන
            // const file = await ytdlp(url)
            // await sock.sendMessage(from, { video: { url: file }, caption: `Downloaded by ${config.BOT_NAME}` })
            await sock.sendMessage(from, {text: `✅ Downloader Ready! Link: ${url}\n\n(yt-dlp server එකේ install කරලා full code එක enable කරන්න. Code එක telegramBot.js එකේ වගේම ready කරලා තියෙන්නේ)`});
        }
    });
}

startBot();
