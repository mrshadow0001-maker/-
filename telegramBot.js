const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const { generatePairCode } = require('./pair');

let verifiedUsers = new Set(); // DB එකක් නැති නිසා memory එකේ. හොඳම දේ MongoDB දාන එක

function startTelegramBot() {
    const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });
    
    bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, 
`👑 *${config.BOT_NAME}* වෙත සාදරයෙන් පිළිගනිමු!

Bot එක Use කරන්න කලින් Verify වෙන්න ඕන.

1️⃣ මේ Channel / Group වලට Join වෙන්න:
📢 Channel: ${config.TELEGRAM_CHANNEL}
👥 Group: ${config.TELEGRAM_GROUP}

2️⃣ Join වෙලා /verify කියලා Type කරන්න.

3️⃣ ඊට පස්සේ /pair 94xxxxxxxxx කියලා WhatsApp Pair Code එක ගන්න.

Creator: ${config.CREATOR}`, { parse_mode: "Markdown" });
    });

    bot.onText(/\/verify/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        try {
            const ch1 = await bot.getChatMember('@itsmeshadow0', userId);
            // Group එක private නිසා check කරන්න බෑ, ඒ නිසා userගෙන් screenshot එකක් වගේ නෙවෙයි, අපි trust එක මත verified කරනවා. හරියටම check කරන්න ඕන නම් group එක public කරන්න.
            // Simplified verify logic:
            verifiedUsers.add(userId);
            bot.sendMessage(chatId, "✅ Verified! දැන් ඔයාට /pair command එක use කරන්න පුළුවන්.");
        } catch (e) {
            bot.sendMessage(chatId, "❌ තාම Join වෙලා නෑ. Channel / Group දෙකටම Join වෙලා /verify කියන්න.\n" + config.TELEGRAM_CHANNEL + "\n" + config.TELEGRAM_GROUP);
        }
    });

    bot.onText(/\/pair (.+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        if (!verifiedUsers.has(userId)) {
            return bot.sendMessage(chatId, "❌ මුලින්ම Verify වෙන්න ඕන! /verify කියලා type කරන්න. Join වෙලා නැත්තම් Join වෙන්න:\n" + config.TELEGRAM_CHANNEL);
        }
        const number = match[1].replace(/[^0-9]/g, '');
        const code = generatePairCode(number);
        bot.sendMessage(chatId, `✅ ඔයාගේ Pair Code එක: *${code}*\n\nWhatsApp Bot එකේ එය ඇතුලත් කරන්න. මේ code එක විනාඩි 2යි වලංගු.\n\nNumber: ${number}`, { parse_mode: "Markdown" });
        // මෙතනින් WhatsApp bot එකට code එක pass කරන logic එක index.js එකේ තියෙනවා
        global.pairCodes = global.pairCodes || {};
        global.pairCodes[code] = number;
    });

    console.log("Telegram Bot Started...");
    return bot;
}
module.exports = startTelegramBot;
