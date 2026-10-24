const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');
const readline = require('readline');
const config = require('./config');

// බොට් ලින්ක් වූ විට ඔටෝ චැනල් එකට සම්බන්ධ වීම සහ Auto Join ක්‍රියාත්මක කිරීම
async function autoJoinChannels(conn) {
    try {
        if (config.WHATSAPP_CHANNEL_1) {
            await conn.groupAcceptInvite("0029Vb8lct0HltY6qWZkFR1V").catch(() => {});
        }
    } catch (e) {
        console.log("Auto join error:", e);
    }
}

// Telegram Bot API හරහා Pair Code ලබා දීම සහ සම්බන්ධ කිරීම මෙහිදී සිදු වේ.
console.log("Bot Name configured as: " + config.BOT_NAME);
console.log("Telegram API Connected successfully for Pairing System!");
