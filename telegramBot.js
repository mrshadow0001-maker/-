const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

// Telegram API Token
const token = config.TELEGRAM_API || "8943968618:AAE7wVn5K7twp44BbojDSNtzpQWY5VxV6oM";
const bot = new TelegramBot(token, { polling: true });

console.log("🤖 Telegram Pairing Bot is running...");

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `✨ *Welcome to Ｉｔｓme𝑳𝒖𝒄𝒊𝒇𝒆𝒓 ࿐  Pairing Bot!*\n\nOwner: *${config.OWNER_NAME}*\n\nSend /pair to get your WhatsApp pairing code.`, { parse_mode: "Markdown" });
});

bot.onText(/\/pair/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `📱 Please send your WhatsApp number with country code (e.g. 94763834416):`);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text && text.startsWith('94')) {
        bot.sendMessage(chatId, `⏳ Generating pairing code for *${text}*...\n\n(Make sure your main terminal is running the WhatsApp connection).`, { parse_mode: "Markdown" });
    }
});
