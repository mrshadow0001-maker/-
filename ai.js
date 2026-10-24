const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "ai",
    alias: ["gpt", "ask"],
    react: "🤖",
    desc: "Chat with AI",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ Please ask something to AI!");
    try {
        let res = await fetch(`https://apis.davidcyriltech.my.id/ai/gemini?text=${encodeURIComponent(q)}`);
        let json = await res.json();
        if (!json.success) return reply("❌ AI error!");
        return reply(`🤖 *Ｉｔｓme𝑳𝒖𝒄𝒊𝒇𝒆𝒓 AI:* \n\n${json.result}`);
    } catch (e) {
        reply("❌ Error connecting to AI.");
    }
});

cmd({
    pattern: "aipic",
    alias: ["dalle", "imagegen"],
    react: "🎨",
    desc: "Generate AI Images",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ Please give a prompt to generate image!");
    try {
        let imageUrl = `https://apis.davidcyriltech.my.id/ai/flux?prompt=${encodeURIComponent(q)}`;
        await conn.sendMessage(from, { image: { url: imageUrl }, caption: `🎨 *AI Image for:* ${q}` }, { quoted: mek });
    } catch (e) {
        reply("❌ Failed to generate image.");
    }
});
