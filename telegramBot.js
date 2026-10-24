const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const { requestPairingCode } = require('./pair');

let bot;
let waSocket = null;
let isRegistered = () => false;
const waitingForNumber = new Set();
const busyChats = new Set();

function setWhatsAppSocket(sock, registeredCheck) {
    waSocket = sock;
    if (typeof registeredCheck === 'function') isRegistered = registeredCheck;
}

function startTelegramBot() {
    if (bot) return bot;

    const token = process.env.TELEGRAM_API || config.TELEGRAM_API;
    if (!token) {
        console.error('❌ TELEGRAM_API is missing. Set it in config.env or environment variables.');
        return null;
    }

    bot = new TelegramBot(token, { polling: true });
    console.log('🤖 Telegram pairing bot started.');

    bot.onText(/^\/start(?:@\w+)?$/, async (msg) => {
        const chatId = msg.chat.id;
        try {
            await bot.sendMessage(
                chatId,
                `✨ Welcome to ${config.BOT_NAME} Pairing Bot!\\n\\nSend /pair to request a WhatsApp pairing code.\\nUse /cancel to cancel.`,
            );
        } catch (err) {
            console.error('Telegram /start error:', err.message);
        }
    });

    bot.onText(/^\/pair(?:@\w+)?$/, async (msg) => {
        const chatId = msg.chat.id;
        if (msg.chat.type !== 'private') {
            return bot.sendMessage(chatId, '🔒 Please use /pair in a private chat with this bot.');
        }
        waitingForNumber.add(chatId);
        return bot.sendMessage(chatId, '📱 Send your WhatsApp number with country code, digits only (example: 947XXXXXXXX). Do not include + or spaces.');
    });

    bot.onText(/^\/cancel(?:@\w+)?$/, async (msg) => {
        waitingForNumber.delete(msg.chat.id);
        busyChats.delete(msg.chat.id);
        return bot.sendMessage(msg.chat.id, '❎ Pairing request cancelled. Send /pair to try again.');
    });

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = typeof msg.text === 'string' ? msg.text.trim() : '';
        if (!text || text.startsWith('/') || !waitingForNumber.has(chatId)) return;
        if (msg.chat.type !== 'private') return;

        const number = text.replace(/[+\s()-]/g, '');
        if (!/^\d{8,15}$/.test(number)) {
            return bot.sendMessage(chatId, '❌ Invalid number. Send digits with country code only (example: 947XXXXXXXX).');
        }
        if (busyChats.has(chatId)) {
            return bot.sendMessage(chatId, '⏳ Your pairing request is already processing. Please wait.');
        }

        busyChats.add(chatId);
        waitingForNumber.delete(chatId);

        try {
            if (!waSocket) {
                throw new Error('WhatsApp socket is not ready yet. Please wait a few seconds and send /pair again.');
            }
            if (isRegistered()) {
                throw new Error('This bot session is already registered. Remove/reset the auth session only if you intend to pair a new account.');
            }

            await bot.sendMessage(chatId, '⏳ Requesting a WhatsApp pairing code…');
            const code = await requestPairingCode(waSocket, number);
            await bot.sendMessage(chatId, `🔐 Your WhatsApp pairing code:\\n\\n${code}\\n\\nOpen WhatsApp → Linked devices → Link a device → Link with phone number, then enter this code.\\n\\nDo not share this code with anyone.`);
            console.log(`Pairing code requested for number ending ${number.slice(-4)}.`);
        } catch (err) {
            console.error('Pairing request failed:', err.message);
            await bot.sendMessage(chatId, `❌ Could not generate a pairing code.\\n${err.message}\\n\\nSend /pair to try again after fixing the issue.`);
        } finally {
            busyChats.delete(chatId);
        }
    });

    bot.on('polling_error', (err) => {
        console.error('Telegram polling error:', err.message);
    });

    return bot;
}

startTelegramBot.setWhatsAppSocket = setWhatsAppSocket;
module.exports = startTelegramBot;
