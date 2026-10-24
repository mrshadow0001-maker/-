const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "",
    BOT_NAME: process.env.BOT_NAME || "Ｉｔｓme𝑳𝒖𝒄𝒊𝒇𝒆𝒓 ࿐ ",
    OWNER_NAME: process.env.OWNER_NAME || "CYBER KING SHADOW 👑",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "94763834416",
    TELEGRAM_API: process.env.TELEGRAM_API || "8943968618:AAE7wVn5K7twp44BbojDSNtzpQWY5VxV6oM",
    WHATSAPP_GROUP: "https://chat.whatsapp.com/Cwow4HHJ8zq4IpYMhMq8WI?s=cl&p=i&mlu=4&ilr=4&iam=0",
    WHATSAPP_CHANNEL_1: "https://whatsapp.com/channel/0029Vb8lct0HltY6qWZkFR1V",
    WHATSAPP_CHANNEL_2: "https://whatsapp.com/channel/0029Vb6uY0uCsU9R86NUsK2a",
    TELEGRAM_CHANNEL: "https://t.me/itsmeshadow0",
    AUTO_JOIN_CHANNEL: convertToBool(process.env.AUTO_JOIN_CHANNEL || "true"),
    ANTI_LINK: convertToBool(process.env.ANTI_LINK || "true"), // ලින්ක් ප්‍රොටෙක්ට් කිරීමට
};
