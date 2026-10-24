const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const P = require('pino');
const config = require('./config');
const startTelegramBot = require('./telegramBot');
const axios = require('axios');

let linkWarnings = {}; // groupId -> userId -> warning count

async function startBot() {
    // 1. Telegram Pair Code Bot එක Run කිරීම
    startTelegramBot();

    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        auth: state,
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ["ItsmeLucifer", "Chrome", "1.0.0"],
        version
    });

    // Telegram එකෙන් එන Number එකට Pair Code එක Generate කිරීම
    setInterval(async () => {
        if (global.pairCodes && !sock.authState.creds.registered) {
            for (let codeKey in global.pairCodes) {
                let number = global.pairCodes[codeKey];
                try {
                    // Pair code එක Baileys එකෙන් ඉල්ලීම
                    let generatedCode = await sock.requestPairingCode(number);
                    console.log(`🔑 Generated Pair Code for ${number}: ${generatedCode}`);
                    // Generated Code එක global object එකට update කිරීම
                    global.pairCodes[codeKey] = generatedCode;
                } catch (e) {
                    console.error("Pairing Error:", e.message);
                }
            }
        }
    }, 5000);

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed. Reconnecting...', shouldReconnect);
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === 'open') {
            console.log(`✅ ${config.BOT_NAME || "Ｉｔｓme𝑳𝒖𝒄𝒊ｆeｒ ࿐ "} is Connected to WhatsApp!`);
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = msg.key.participant || from;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || "";
        
        const prefix = config.PREFIX || ".";

        // --- 🛡️ ANTI LINK SYSTEM ---
        if (isGroup && body.match(/(https:\/\/|http:\/\/|chat.whatsapp.com|t.me|wa.me)/gi)) {
            try {
                const groupMetadata = await sock.groupMetadata(from);
                const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;

                if (!isAdmin) {
                    const key = `${from}_${sender}`;
                    linkWarnings[key] = (linkWarnings[key] || 0) + 1;

                    // 1. Delete Link Message
                    await sock.sendMessage(from, { delete: msg.key });

                    if (linkWarnings[key] === 1) {
                        // First Warning
                        await sock.sendMessage(from, { 
                            text: `⚠️ *@${sender.split('@')[0]}*, Link දාන්න එපා! පළවෙනි Warning එක. දෙවෙනි පාර දැම්මොත් Group එකෙන් Remove වෙනවා!`, 
                            mentions: [sender] 
                        });
                    } else if (linkWarnings[key] >= 2) {
                        // Second Time -> Remove User
                        await sock.sendMessage(from, { 
                            text: `🚫 *@${sender.split('@')[0]}*, දෙවෙනි පාරත් Link දැමූ නිසා Group එකෙන් Remove කරනවා!`, 
                            mentions: [sender] 
                        });
                        await sock.groupParticipantsUpdate(from, [sender], "remove");
                        delete linkWarnings[key];
                    }
                    return;
                }
            } catch (err) {
                console.error("Anti-link error:", err);
            }
        }

        if (!body.startsWith(prefix)) return;
        const args = body.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        // --- 📜 MAIN MENU ---
        if (command === 'menu' || command === 'help') {
            const menuText = `
╭───「 *${config.BOT_NAME || "Ｉｔｓme𝑳𝒖𝒄𝒊ｆeｒ ࿐ "}* 」───
│ 👑 *Owner:* ${config.OWNER_NAME || "CYBER KING SHADOW 👑"}
│ 🛠️ *Creator:* ${config.CREATOR || "cyber king shadow"}
│ 🏰 *Kingdom:* Shadow Kingdom
│
│ 👥 *GROUP CONTROL*
│  • .add 94xxxxxxxxx
│  • .kick @user
│  • .tagall
│  • .hidetag <text>
│
│ 📥 *DOWNLOAD MENU*
│  • .yt <link/song name>
│  • .fb <link>
│  • .tiktok <link>
│  • .ig <link>
│  • .gimage <search text>
│
│ 🤖 *AI & TOOLS*
│  • .ai <question>
│  • .imagine <prompt>
╰───────────────────────────

📢 *Join Our Official Channels:*
• Channel 1: ${config.WHATSAPP_CHANNEL1 || "https://whatsapp.com/channel/0029Vb8lct0HltY6qWZkFR1V"}
• Channel 2: ${config.WHATSAPP_CHANNEL2 || "https://whatsapp.com/channel/0029Vb6uY0uCsU9R86NUsK2a"}
• Telegram: ${config.TELEGRAM_CHANNEL || "https://t.me/itsmeshadow0"}
`;

            // Owner Contact vCard setup
            const vcard = 'BEGIN:VCARD\n' +
                'VERSION:3.0\n' +
                'FN:' + (config.OWNER_NAME || "CYBER KING SHADOW 👑") + '\n' +
                'TEL;type=CELL;type=VOICE;waid=' + (config.OWNER_NUMBER || "94763834416") + ':+' + (config.OWNER_NUMBER || "94763834416") + '\n' +
                'END:VCARD';

            // Send Menu Text with Image
            await sock.sendMessage(from, {
                image: { url: "https://res.cloudinary.com/df2rnoijw/image/upload/v1752404824/shkqo3nbxkhhbyej2lxm.jpg" },
                caption: menuText
            }, { quoted: msg });

            // Send Owner Contact Button/Card
            await sock.sendMessage(from, {
                contacts: {
                    displayName: config.OWNER_NAME || "CYBER KING SHADOW 👑",
                    contacts: [{ vcard }]
                }
            }, { quoted: msg });
        }

        // --- 📢 TAG ALL ---
        if (command === 'tagall') {
            if (!isGroup) return sock.sendMessage(from, { text: "❌ මෙය Group වල පමණක් භාවිතා කළ හැක!" });
            const groupMetadata = await sock.groupMetadata(from);
            let members = groupMetadata.participants.map(p => p.id);
            let text = `📢 *Tag All by ${config.BOT_NAME}*\n\n` + (args.join(" ") || "සියලුම දෙනාගේ අවධානයට!") + "\n\n";
            await sock.sendMessage(from, { text: text, mentions: members }, { quoted: msg });
        }

        // --- 🤖 AI CHAT ---
        if (command === 'ai') {
            let prompt = args.join(" ");
            if (!prompt) return sock.sendMessage(from, { text: "❌ කරුණාකර ප්‍රශ්නයක් ඇතුළත් කරන්න! (උදා: .ai Hello)" });

            try {
                let res = await axios.get(`https://apis.davidcyriltech.my.id/ai/gemini?text=${encodeURIComponent(prompt)}`);
                if (res.data && res.data.success) {
                    await sock.sendMessage(from, { text: `🤖 *Ｉｔｓme𝑳𝒖𝒄𝒊ｆeｒ AI:*\n\n${res.data.result}` }, { quoted: msg });
                } else {
                    sock.sendMessage(from, { text: "❌ AI Response එක ලබා ගැනීමට නොහැකි විය." });
                }
            } catch (e) {
                sock.sendMessage(from, { text: "❌ AI API Error!" });
            }
        }

        // --- 📥 MEDIA DOWNLOADER ---
        if (['yt', 'fb', 'tiktok', 'ig'].includes(command)) {
            let url = args[0];
            if (!url) return sock.sendMessage(from, { text: "❌ කරුණාකර Video/Media Link එකක් ඇතුළත් කරන්න!" });
            
            await sock.sendMessage(from, { text: `⏳ *Downloading Video...* \n_${config.BOT_NAME}_` }, { quoted: msg });

            try {
                let apiEndpoint = `https://apis.davidcyriltech.my.id/${command === 'yt' ? 'download/ytmp4' : command}?url=${encodeURIComponent(url)}`;
                let res = await axios.get(apiEndpoint);

                if (res.data && res.data.success) {
                    let mediaUrl = res.data.result.download_url || res.data.result.video || res.data.result.url;
                    await sock.sendMessage(from, { 
                        video: { url: mediaUrl }, 
                        caption: `📥 *Downloaded by ${config.BOT_NAME}*\n👑 Owner: ${config.OWNER_NAME}` 
                    }, { quoted: msg });
                } else {
                    sock.sendMessage(from, { text: "❌ Download කිරීමට නොහැකි විය. Link එක පරීක්ෂා කරන්න." });
                }
            } catch (e) {
                sock.sendMessage(from, { text: "❌ Downloader API Error!" });
            }
        }
    });
}

startBot();
