const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "fb",
    alias: ["facebook"],
    react: "📥",
    desc: "Download Facebook videos",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ Please give a Facebook video link.");
    try {
        let res = await fetch(`https://apis.davidcyriltech.my.id/facebook?url=${encodeURIComponent(q)}`);
        let json = await res.json();
        if (!json.success) return reply("❌ Failed to download video.");
        await conn.sendMessage(from, { video: { url: json.result.video_url || json.result.hd }, caption: "📥 *Downloaded by Ｉｔｓme𝑳𝒖𝒄𝒊𝒇𝒆𝒓 ࿐ *" }, { quoted: mek });
    } catch (e) {
        reply("❌ Error occurred!");
    }
});

cmd({
    pattern: "tiktok",
    alias: ["tt"],
    react: "🎵",
    desc: "Download TikTok videos",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ Please give a TikTok link.");
    try {
        let res = await fetch(`https://apis.davidcyriltech.my.id/tiktok?url=${encodeURIComponent(q)}`);
        let json = await res.json();
        if (!json.success) return reply("❌ Failed to download TikTok.");
        await conn.sendMessage(from, { video: { url: json.result.video }, caption: "🎵 *TikTok Downloaded Successfully*" }, { quoted: mek });
    } catch (e) {
        reply("❌ Error occurred!");
    }
});

cmd({
    pattern: "insta",
    alias: ["ig"],
    react: "📸",
    desc: "Download Instagram reels/videos",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ Please give an Instagram link.");
    try {
        let res = await fetch(`https://apis.davidcyriltech.my.id/instagram?url=${encodeURIComponent(q)}`);
        let json = await res.json();
        if (!json.success) return reply("❌ Failed to download Instagram media.");
        await conn.sendMessage(from, { video: { url: json.result.url }, caption: "📸 *Instagram Downloaded*" }, { quoted: mek });
    } catch (e) {
        reply("❌ Error occurred!");
    }
});
